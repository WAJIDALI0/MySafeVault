"use server";

import { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } from "@simplewebauthn/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";

// Using the public tunnel URL for the Relying Party (RP) ID
// In production, this would be your actual domain (e.g., mysafevault.com)
const rpName = "MySafeVault";

// The challenge must be stored temporarily. We use an encrypted cookie for statelessness.
const CHALLENGE_COOKIE = "webauthn_challenge";

function getRPID(origin: string) {
  try {
    const url = new URL(origin);
    return url.hostname;
  } catch {
    return "localhost";
  }
}

export async function getWebAuthnRegistrationOptions(origin: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Get user profile to get their email/name
  const profile = await prisma.profile.findUnique({
    where: { id: user.id }
  });

  const rpID = getRPID(origin);

  // Get existing credentials so the device doesn't register the same one twice
  const existingCredentials = await prisma.webAuthnCredential.findMany({
    where: { profile_id: user.id },
    select: { credential_id: true, transports: true }
  });

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: new Uint8Array(Buffer.from(user.id)),
    userName: user.email || profile?.full_name || "User",
    // Don't prompt users for their authenticator if they've already registered it
    excludeCredentials: existingCredentials.map(cred => ({
      id: Buffer.from(cred.credential_id, 'base64url'),
      type: 'public-key',
      // transports: cred.transports ? cred.transports.split(',') as any : undefined,
    })),
    authenticatorSelection: {
      residentKey: 'required',
      userVerification: 'preferred',
    },
  });

  // Store the challenge in a secure cookie to verify it later
  const cookieStore = await cookies();
  cookieStore.set(CHALLENGE_COOKIE, options.challenge, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 5, // 5 minutes
  });

  return options;
}

export async function verifyWebAuthnRegistration(response: any, origin: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const cookieStore = await cookies();
  const expectedChallenge = cookieStore.get(CHALLENGE_COOKIE)?.value;

  if (!expectedChallenge) {
    throw new Error("Registration challenge expired. Please try again.");
  }

  const rpID = getRPID(origin);

  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: true,
    });
  } catch (error: any) {
    console.error(error);
    throw new Error(`Verification failed: ${error.message}`);
  }

  if (verification.verified && verification.registrationInfo) {
    const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;

    // Save the credential to the database
    await prisma.webAuthnCredential.create({
      data: {
        profile_id: user.id,
        credential_id: Buffer.from(credential.id).toString('base64url'),
        public_key: Buffer.from(credential.publicKey),
        counter: BigInt(credential.counter),
        device_type: credentialDeviceType,
        backed_up: credentialBackedUp,
        transports: response.response.transports ? response.response.transports.join(',') : null,
      }
    });

    // Clear the challenge
    cookieStore.delete(CHALLENGE_COOKIE);

    return { success: true };
  }

  throw new Error("Verification failed");
}

export async function getWebAuthnAuthenticationOptions(origin: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Get credentials for this user
  const userCredentials = await prisma.webAuthnCredential.findMany({
    where: { profile_id: user.id },
  });

  if (userCredentials.length === 0) {
    throw new Error("No biometrics registered for this account.");
  }

  const rpID = getRPID(origin);

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: userCredentials.map(cred => ({
      id: Buffer.from(cred.credential_id, 'base64url'),
      type: 'public-key',
      // transports: cred.transports ? cred.transports.split(',') as any : undefined,
    })),
    userVerification: 'preferred',
  });

  // Store the challenge securely
  const cookieStore = await cookies();
  cookieStore.set(CHALLENGE_COOKIE, options.challenge, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 5, // 5 minutes
  });

  return options;
}

export async function verifyWebAuthnAuthentication(response: any, origin: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const cookieStore = await cookies();
  const expectedChallenge = cookieStore.get(CHALLENGE_COOKIE)?.value;

  if (!expectedChallenge) {
    throw new Error("Authentication challenge expired. Please try again.");
  }

  const rpID = getRPID(origin);

  // Find the exact credential the user signed with
  const credential = await prisma.webAuthnCredential.findUnique({
    where: { credential_id: response.id }
  });

  if (!credential) {
    throw new Error("Biometric credential not found on this device.");
  }

  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: Buffer.from(credential.credential_id, 'base64url'),
        credentialPublicKey: credential.public_key,
        counter: Number(credential.counter),
      },
    });
  } catch (error: any) {
    console.error(error);
    throw new Error(`Authentication failed: ${error.message}`);
  }

  if (verification.verified && verification.authenticationInfo) {
    // Update the counter to prevent replay attacks
    await prisma.webAuthnCredential.update({
      where: { credential_id: credential.credential_id },
      data: { 
        counter: BigInt(verification.authenticationInfo.newCounter),
        last_used_at: new Date()
      }
    });

    cookieStore.delete(CHALLENGE_COOKIE);
    return { success: true };
  }

  throw new Error("Authentication failed");
}

export async function disableWebAuthn() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await prisma.webAuthnCredential.deleteMany({
    where: { profile_id: user.id }
  });
  
  revalidatePath('/settings/security');
  return { success: true };
}

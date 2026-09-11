/**
 * Private Vault Biometrics Service
 * Handles platform WebAuthn authenticators (TouchID, FaceID, Windows Hello, Android Biometrics)
 */

import { bufferToBase64, base64ToBuffer } from "@/lib/crypto/client-vault-crypto";
import {
  VAULT_CREDENTIAL_KEY,
  isIpAddress,
} from "../constants/private-vault.constants";

export async function checkBiometricPlatformAvailability(): Promise<boolean> {
  if (typeof window === "undefined" || !window.PublicKeyCredential) {
    return false;
  }
  if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable !== "function") {
    return false;
  }
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

export async function enrollBiometricCredential(userId: string): Promise<string | null> {
  if (typeof window === "undefined" || !navigator.credentials?.create) {
    return null;
  }

  const host = window.location.hostname;
  const isIp = isIpAddress(host);
  const challenge = new Uint8Array(32);
  window.crypto.getRandomValues(challenge);
  const userIdBytes = new TextEncoder().encode(userId);

  try {
    const cred = (await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: "MySafeVault",
          ...(isIp ? {} : { id: host }),
        },
        user: {
          id: userIdBytes,
          name: "Vault User",
          displayName: "Vault User",
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },
          { alg: -257, type: "public-key" },
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          residentKey: "preferred",
        },
        timeout: 60000,
      },
    })) as any;

    if (cred?.rawId) {
      const credIdBase64 = bufferToBase64(cred.rawId);
      localStorage.setItem(VAULT_CREDENTIAL_KEY, credIdBase64);
      return credIdBase64;
    }
    return null;
  } catch (err) {
    console.warn("Biometric enrollment skipped or dismissed:", err);
    return null;
  }
}

export async function verifyBiometricChallenge(userId: string): Promise<boolean> {
  if (typeof window === "undefined" || !window.PublicKeyCredential) {
    throw new Error("Biometric authenticator is not supported on this browser.");
  }

  const host = window.location.hostname;
  const isIp = isIpAddress(host);

  try {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const storedCredentialId = localStorage.getItem(VAULT_CREDENTIAL_KEY);

    // If not yet enrolled on this device, enroll first
    if (!storedCredentialId) {
      const newCredId = await enrollBiometricCredential(userId);
      return Boolean(newCredId);
    }

    const publicKeyOpts: any = {
      challenge,
      timeout: 60000,
      userVerification: "required",
      ...(isIp ? {} : { rpId: host }),
      allowCredentials: [
        {
          id: base64ToBuffer(storedCredentialId),
          type: "public-key",
          transports: ["internal"],
        },
      ],
    };

    const assertion = await navigator.credentials.get({
      publicKey: publicKeyOpts,
    });

    return Boolean(assertion);
  } catch (err: any) {
    if (err?.name === "NotAllowedError" || err?.message?.includes("cancelled")) {
      if (isIp) {
        throw new Error(
          "Android Chrome restricts hardware WebAuthn on raw IP addresses. Please use your master passcode or connect via a hostname."
        );
      }
      throw new Error("Biometric verification was cancelled.");
    }
    throw new Error(err?.message || "Biometric sensor verification failed.");
  }
}

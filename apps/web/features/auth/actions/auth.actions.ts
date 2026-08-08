"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { 
  LoginSchema, 
  RegisterSchema, 
  ForgotPasswordSchema, 
  ResetPasswordSchema 
} from "../schemas/auth.schema";
import { logActivity } from "@/lib/logger/activity";

export async function login(formData: z.infer<typeof LoginSchema>) {
  const supabase = await createClient();
  const parsed = LoginSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: "Invalid form data" };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    await logActivity({
      profileId: data.user.id,
      action: "login",
      metadata: { method: "email" }
    });
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function register(formData: z.infer<typeof RegisterSchema>) {
  const supabase = await createClient();
  const parsed = RegisterSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: "Invalid form data" };
  }

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/check-email");
}

export async function forgotPassword(formData: z.infer<typeof ForgotPasswordSchema>) {
  const supabase = await createClient();
  const parsed = ForgotPasswordSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: "Invalid form data" };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${appUrl}/api/auth/callback?next=/reset-password`,
  });

  if (error) {
    console.error("Forgot Password Error:", error);
    return { error: error.message };
  }

  redirect("/check-email");
}

export async function resetPassword(formData: z.infer<typeof ResetPasswordSchema>) {
  const supabase = await createClient();
  const parsed = ResetPasswordSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: "Invalid form data" };
  }

  const { data, error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    await logActivity({
      profileId: data.user.id,
      action: "password_changed",
    });
  }

  redirect("/password-updated");
}

export async function logout() {
  const supabase = await createClient();
  
  const { data } = await supabase.auth.getUser();
  if (data.user) {
    await logActivity({
      profileId: data.user.id,
      action: "logout",
    });
  }

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function oauthLogin(provider: 'google' | 'github') {
  // Scaffolded for future MVP iteration
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(data.url);
}

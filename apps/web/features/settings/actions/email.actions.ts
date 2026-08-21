"use server";

import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

export async function sendWelcomeEmail() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return { error: "Unauthorized or missing email" };
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return { error: "Resend API key is not configured. Please add RESEND_API_KEY to your .env file." };
    }

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: "MySafeVault Security <onboarding@resend.dev>",
      to: [user.email],
      subject: "Welcome to MySafeVault - Your Digital Life is Secure",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #0f172a; padding: 24px; text-align: center;">
            <h1 style="color: #10b981; margin: 0;">MySafeVault</h1>
          </div>
          <div style="padding: 24px; background-color: #ffffff;">
            <h2 style="color: #0f172a; margin-top: 0;">Your digital life is now secure.</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.5;">
              Thank you for trusting MySafeVault. This is an automated email to verify your Resend integration.
            </p>
            <p style="color: #475569; font-size: 16px; line-height: 1.5;">
              If you did not request this email, please ignore it or contact support.
            </p>
          </div>
          <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} MySafeVault. All rights reserved.</p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error("Resend Error:", error);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Resend Server Error:", error);
    return { error: error.message || "Failed to send email" };
  }
}

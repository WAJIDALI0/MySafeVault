import { Suspense } from "react";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { MfaVerifyForm } from "@/features/auth/components/mfa-verify-form";
import { Shield, Lock, Smartphone } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Identity | MySafeVault",
  description: "Enter your two-factor authentication code to continue.",
  robots: { index: false, follow: false },
};

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Extra Protection",
    description: "Your account has 2FA enabled",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Verify Device",
    description: "Proves you own this device",
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: "Authenticator",
    description: "Check your authentication app",
  }
];

export default function MfaVerifyPage() {
  return (
    <AuthLayout
      title="Verify your identity 🔒"
      description="Enter the 6-digit code from your authenticator app to continue."
      features={features}
    >
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-2xl font-semibold mb-2">Two-Factor Authentication</h2>
        <p className="text-slate-500">Open your authenticator app and enter the code.</p>
      </div>
      <Suspense fallback={<div className="h-40 flex items-center justify-center">Loading...</div>}>
        <MfaVerifyForm />
      </Suspense>
    </AuthLayout>
  );
}

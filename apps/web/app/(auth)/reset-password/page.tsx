import { AuthLayout } from "@/features/auth/components/auth-layout";
import { ResetForm } from "@/features/auth/components/reset-form";
import { KeyRound, Shield, Settings2 } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | MySafeVault",
  description: "Create a new password for your MySafeVault account.",
  robots: { index: false, follow: false },
};

const features = [
  {
    icon: <KeyRound className="w-6 h-6" />,
    title: "Strong Protection",
    description: "Choose a strong password",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Keep it Safe",
    description: "Don't share with anyone",
  },
  {
    icon: <Settings2 className="w-6 h-6" />,
    title: "You're in Control",
    description: "Update it anytime",
  }
];

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Create new password 🔑"
      description="Enter your new password below to reset your account."
      features={features}
    >
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-2xl font-semibold mb-2">Reset your password</h2>
        <p className="text-slate-500">Enter your new password below.</p>
      </div>
      <ResetForm />
    </AuthLayout>
  );
}

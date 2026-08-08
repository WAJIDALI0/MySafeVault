import { AuthLayout } from "@/features/auth/components/auth-layout";
import { ForgotForm } from "@/features/auth/components/forgot-form";
import { ShieldAlert, Zap, LockKeyhole } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | MySafeVault",
  description: "Reset your MySafeVault password securely.",
  robots: { index: false, follow: false },
};

const features = [
  {
    icon: <ShieldAlert className="w-6 h-6" />,
    title: "Secure Recovery",
    description: "Reset your password securely",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Quick & Easy",
    description: "Get back to your vault in minutes",
  },
  {
    icon: <LockKeyhole className="w-6 h-6" />,
    title: "Account Protection",
    description: "We keep your account safe",
  }
];

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="No worries 🔒"
      description="Enter your email and we'll send you a link to reset your password."
      features={features}
    >
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-2xl font-semibold mb-2">Forgot your password?</h2>
        <p className="text-slate-500">Enter your email address and we'll send you a link to reset it.</p>
      </div>
      <ForgotForm />
    </AuthLayout>
  );
}

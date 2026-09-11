import { AuthLayout } from "@/features/auth/components/auth-layout";
import { LoginForm } from "@/features/auth/components/login-form";
import { ShieldCheck, Lock, Smartphone } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | MySafeVault",
  description: "Sign in to access your encrypted vault and secure your digital life.",
  robots: { index: false, follow: false },
};

const features = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
    title: "AES-256-GCM Security",
    description: "Authenticated military-grade symmetric encryption for your credentials",
  },
  {
    icon: <Lock className="w-6 h-6 text-emerald-400" />,
    title: "Multi-Factor Protection",
    description: "Hardware passkeys and TOTP authenticator verification",
  },
  {
    icon: <Smartphone className="w-6 h-6 text-emerald-400" />,
    title: "Continuous Sync",
    description: "Encrypted data synchronizes reliably across all devices",
  }
];

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      description="Access your protected credentials, private notes, and digital identities."
      features={features}
    >
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white mb-2">Welcome Back</h2>
        <p className="text-slate-500 text-sm">Sign in to your account to access your encrypted vault.</p>
      </div>
      <LoginForm />
    </AuthLayout>
  );
}

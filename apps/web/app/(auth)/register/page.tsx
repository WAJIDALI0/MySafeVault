import { AuthLayout } from "@/features/auth/components/auth-layout";
import { SignupForm } from "@/features/auth/components/signup-form";
import { ShieldCheck, Key, Shield } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | MySafeVault",
  description: "Start securing your digital life today with MySafeVault.",
  robots: { index: false, follow: false },
};

const features = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
    title: "AES-256-GCM Encryption",
    description: "Protected with NIST-approved cryptographic standards",
  },
  {
    icon: <Key className="w-6 h-6 text-emerald-400" />,
    title: "Passkey & Biometrics",
    description: "WebAuthn passwordless authentication support",
  },
  {
    icon: <Shield className="w-6 h-6 text-emerald-400" />,
    title: "Audit Trail & Monitoring",
    description: "Full visibility over all logins, updates, and accesses",
  }
];

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create Your Vault"
      description="Store, organize and protect your digital life in one secure place."
      features={features}
    >
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white mb-2">Create Account</h2>
        <p className="text-slate-500 text-sm">Get started with your secure personal vault in seconds.</p>
      </div>
      <SignupForm />
    </AuthLayout>
  );
}

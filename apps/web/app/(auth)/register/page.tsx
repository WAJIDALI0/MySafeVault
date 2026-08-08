import { AuthLayout } from "@/features/auth/components/auth-layout";
import { SignupForm } from "@/features/auth/components/signup-form";
import { ShieldCheck, EyeOff, Heart } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | MySafeVault",
  description: "Start securing your digital life today with MySafeVault.",
  robots: { index: false, follow: false },
};

const features = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Bank-level Security",
    description: "Advanced encryption for maximum protection",
  },
  {
    icon: <EyeOff className="w-6 h-6" />,
    title: "Zero Knowledge",
    description: "Only you have access to your data",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Peace of Mind",
    description: "Your secrets are safe with us",
  }
];

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account ✨"
      description="Start securing your digital life today with MySafeVault."
      features={features}
    >
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-2xl font-semibold mb-2">Create your account</h2>
        <p className="text-slate-500">Fill in the details below to get started.</p>
      </div>
      <SignupForm />
    </AuthLayout>
  );
}

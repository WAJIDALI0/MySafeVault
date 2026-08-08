import { AuthLayout } from "@/features/auth/components/auth-layout";
import { LoginForm } from "@/features/auth/components/login-form";
import { Shield, Lock, Smartphone } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | MySafeVault",
  description: "Login to access your encrypted vault and secure your digital life.",
  robots: { index: false, follow: false },
};

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "End-to-end Encrypted",
    description: "Your data is always secure",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Private by Design",
    description: "We respect your privacy",
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: "Access Anywhere",
    description: "Sync across all your devices",
  }
];

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back 👋"
      description="Login to access your encrypted vault and secure your digital life."
      features={features}
    >
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-2xl font-semibold mb-2">Login to your account</h2>
        <p className="text-slate-500">Welcome back! Please enter your details.</p>
      </div>
      <LoginForm />
    </AuthLayout>
  );
}

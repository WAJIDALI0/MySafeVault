import { AuthLayout } from "@/features/auth/components/auth-layout";
import { Mail, Link as LinkIcon, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check Your Email | MySafeVault",
  description: "Check your email for the verification link.",
  robots: { index: false, follow: false },
};

const features = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email Sent",
    description: "We've sent the secure link",
  },
  {
    icon: <LinkIcon className="w-6 h-6" />,
    title: "Secure Link",
    description: "The link will expire soon",
  },
  {
    icon: <HelpCircle className="w-6 h-6" />,
    title: "Still need help?",
    description: "Contact our support team",
  }
];

export default function CheckEmailPage() {
  return (
    <AuthLayout
      title="Check your email 📧"
      description="We've sent a secure link to your email address."
      features={features}
    >
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto text-[#10B981]">
          <Mail className="w-10 h-10" />
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-2">Check your email</h2>
          <p className="text-slate-500 mb-6">
            We've sent a secure link to your email address. 
            The link will expire in <strong>15 minutes</strong>.
          </p>
          <p className="text-sm text-slate-400">
            If you don't see the email, check your spam or junk folder.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <Button asChild className="w-full">
            <a href="mailto:">Open email app</a>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/login">Back to login</Link>
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}

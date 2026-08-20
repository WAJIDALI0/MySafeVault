import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | MySafeVault",
  description: "Learn how MySafeVault protects your privacy with Zero-Knowledge architecture.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-300 py-12 px-6 lg:px-12 selection:bg-emerald-500/30">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-outfit font-bold text-white tracking-tight">Privacy Policy</h1>
        </div>
        
        <div className="prose prose-invert prose-emerald max-w-none space-y-6">
          <p className="text-lg text-slate-400">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Zero-Knowledge Architecture</h2>
            <p>
              MySafeVault is fundamentally designed around a Zero-Knowledge architecture. This means that <strong>we cannot see, read, or decrypt your data.</strong> 
              Your master password never leaves your device, and all cryptographic operations (encryption and decryption) occur locally in your browser using AES-256-GCM.
            </p>
          </section>

          <section className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white">2. What Information We Collect</h2>
            <p>We only collect the absolute minimum information required to operate the service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Email Address:</strong> Used strictly for account identification, authentication, and critical security notifications.</li>
              <li><strong>Encrypted Vault Data:</strong> We store the scrambled ciphertext of your vault items. We do not have the decryption keys.</li>
              <li><strong>Authentication Logs:</strong> We log login attempts (e.g., successful/failed logins, IP metadata) to power our Smart Security Insights and alert you to suspicious activity.</li>
            </ul>
          </section>

          <section className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white">3. What We Do NOT Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your Master Password.</li>
              <li>The unencrypted contents of your passwords, secure notes, or documents.</li>
              <li>Third-party tracking cookies or marketing analytics.</li>
            </ul>
          </section>

          <section className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Data Sharing and Disclosure</h2>
            <p>
              Because we do not hold the decryption keys to your data, we cannot share your plain-text information with anyone, including law enforcement. 
              We do not sell your personal information or email address to third parties.
            </p>
          </section>

          <section className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white">5. Account Deletion</h2>
            <p>
              You have full control over your data. You may delete your account at any time from the "Danger Zone" in your settings. 
              Upon deletion, all your encrypted data and personal information are permanently purged from our active databases.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

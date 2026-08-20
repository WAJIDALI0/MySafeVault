import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service | MySafeVault",
  description: "Terms of Service for using MySafeVault.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-300 py-12 px-6 lg:px-12 selection:bg-indigo-500/30">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <FileText className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-outfit font-bold text-white tracking-tight">Terms of Service</h1>
        </div>
        
        <div className="prose prose-invert prose-indigo max-w-none space-y-6">
          <p className="text-lg text-slate-400">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing or using MySafeVault, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Your Master Password and Data Recovery</h2>
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-200">
              <strong className="block mb-2 text-amber-400">CRITICAL NOTICE REGARDING DATA LOSS:</strong>
              Because MySafeVault uses a Zero-Knowledge encryption model, <strong>we do not know your Master Password and cannot recover it for you.</strong> If you lose your Master Password, you will permanently lose access to your encrypted vault. We cannot assist in data recovery under any circumstances.
            </div>
          </section>

          <section className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white">3. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create a strong, unique Master Password that you do not use anywhere else.</li>
              <li>Keep your Master Password and any Two-Factor Authentication (2FA) recovery codes secure.</li>
              <li>Not use the service for any illegal, unauthorized, or malicious purposes.</li>
            </ul>
          </section>

          <section className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, MySafeVault and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your inability to access your data due to a lost Master Password.</li>
              <li>Any unauthorized access to your device or browser.</li>
              <li>Service interruptions or downtime.</li>
            </ul>
          </section>

          <section className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white">5. Service Modifications</h2>
            <p>
              We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice. We shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the service.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

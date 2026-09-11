import { Lock, Shield, CheckCircle2, Smartphone, ShieldCheck, Key } from "lucide-react";
import Link from "next/link";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface AuthLayoutProps {
  title: string;
  description: string;
  features?: Feature[];
  children: React.ReactNode;
}

const defaultFeatures: Feature[] = [
  {
    icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    title: "AES-256-GCM Encryption",
    description: "Your sensitive records are protected with industry-standard cryptographic primitives.",
  },
  {
    icon: <Smartphone className="w-5 h-5 text-emerald-400" />,
    title: "Multi-Device Sync",
    description: "Seamlessly access your vault from your browser, phone, or desktop.",
  },
  {
    icon: <Key className="w-5 h-5 text-emerald-400" />,
    title: "Biometric & 2FA Protection",
    description: "Support for WebAuthn passkeys and authenticator app verification.",
  },
];

export function AuthLayout({ title, description, features = defaultFeatures, children }: AuthLayoutProps) {
  const displayFeatures = features && features.length > 0 ? features : defaultFeatures;

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-[#0B1120]">
      {/* Left Panel - Premium Cybersecurity Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-[#064e3b] via-[#022c22] to-[#01140e] p-12 lg:p-16 text-white border-r border-emerald-900/40 relative overflow-hidden">
        {/* Background radial glow */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 text-white font-bold text-2xl group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-md group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <span className="tracking-tight">MySafeVault</span>
          </Link>
          <p className="text-xs uppercase tracking-widest text-emerald-400/80 font-semibold mt-2">
            Secure • Store • Organize • Protect
          </p>
        </div>

        {/* Centerpiece Hero Statement */}
        <div className="relative z-10 my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Industry-Grade Cybersecurity
          </div>
          <h1 className="text-3xl lg:text-4xl font-outfit font-bold leading-tight mb-4 text-white">
            Your personal vault for a safer digital life.
          </h1>
          <p className="text-emerald-100/70 text-base font-inter max-w-md leading-relaxed">
            {description}
          </p>
        </div>

        {/* Feature Badges */}
        <div className="relative z-10 space-y-4 pt-6 border-t border-emerald-800/40">
          {displayFeatures.map((feature, i) => (
            <div key={i} className="flex gap-3.5 items-start">
              <div className="p-2 bg-emerald-950/60 border border-emerald-700/40 rounded-lg shrink-0 mt-0.5">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-100">{feature.title}</h3>
                <p className="text-xs text-emerald-200/60 mt-0.5 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white">
        <div className="lg:hidden flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xl mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <span>MySafeVault</span>
        </div>
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

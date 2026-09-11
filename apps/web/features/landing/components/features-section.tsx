"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Smartphone, Lock, LayoutDashboard, KeyRound, GlobeLock } from "lucide-react";

const features = [
  {
    title: "AES-256-GCM Cryptographic Vault",
    description: "Your sensitive passwords and documents are sealed using authenticated AES-256-GCM encryption with cryptographic integrity verification.",
    icon: Lock,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20"
  },
  {
    title: "AI Security Posture Audits",
    description: "Continuous real-time hygiene scoring. Automatically detect stale credentials, expiring documents, and weak authentication settings.",
    icon: ShieldCheck,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20"
  },
  {
    title: "Multi-Factor & Passkeys",
    description: "Protect account access with WebAuthn biometrics, passkeys, and RFC 6238 TOTP authenticator app verification.",
    icon: Smartphone,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20"
  },
  {
    title: "Sleek Multi-Theme Interface",
    description: "Engineered with a clean, high-contrast light mode and a deep OLED dark mode that seamlessly syncs with your system preferences.",
    icon: LayoutDashboard,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20"
  },
  {
    title: "Unified Universal Storage",
    description: "Store more than just passwords. Protect national IDs, financial records, encrypted notes, warranties, and receipts in one place.",
    icon: KeyRound,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20"
  },
  {
    title: "Cross-Platform Access",
    description: "Access your encrypted vault smoothly from any modern browser or device with real-time audit logs and session controls.",
    icon: GlobeLock,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 lg:px-12 bg-white dark:bg-[#0B1120] border-t border-slate-200/80 dark:border-slate-800/80 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-outfit font-bold text-slate-900 dark:text-white mb-4 tracking-tight"
          >
            Built for security. Designed for clarity.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-2xl mx-auto"
          >
            Enterprise-grade cryptographic protection meets consumer-level usability. Everything you need to secure your digital life.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 p-8 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bgColor} ${feature.borderColor} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-outfit">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

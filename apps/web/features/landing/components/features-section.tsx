"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Smartphone, EyeOff, LayoutDashboard, KeyRound, GlobeLock } from "lucide-react";

const features = [
  {
    title: "Zero-Knowledge Architecture",
    description: "Your data is encrypted on your device using AES-256-GCM. We never see your master password or your unencrypted data.",
    icon: EyeOff,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20"
  },
  {
    title: "Smart Security Insights",
    description: "Get real-time health scores for your vault. Automatically detect stale passwords and weak security configurations.",
    icon: ShieldCheck,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20"
  },
  {
    title: "Multi-Factor Authentication",
    description: "Secure your account with TOTP authenticator apps. Advanced session tracking alerts you to any unusual login attempts.",
    icon: Smartphone,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20"
  },
  {
    title: "Beautiful & Intuitive",
    description: "A dark-mode first design that feels premium and responsive across all devices, ensuring managing security isn't a chore.",
    icon: LayoutDashboard,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20"
  },
  {
    title: "Universal Storage",
    description: "Store more than just passwords. Securely save credit cards, identity documents, and encrypted secure notes.",
    icon: KeyRound,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20"
  },
  {
    title: "Cross-Device Syncing",
    description: "Access your encrypted vault from anywhere. Your data syncs securely and instantly across all your devices.",
    icon: GlobeLock,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 lg:px-12 bg-[#0B1120] relative">
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-outfit font-bold text-white mb-4"
          >
            Built for paranoia. <br className="md:hidden" /> Designed for humans.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Enterprise-grade security meets a consumer-grade experience. MySafeVault brings advanced cryptographic protection to everyone.
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
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-2xl hover:bg-slate-800/50 transition-colors group"
            >
              <div className={`w-14 h-14 rounded-xl ${feature.bgColor} ${feature.borderColor} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-outfit">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

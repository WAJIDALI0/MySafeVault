"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, KeyRound, Fingerprint } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-12 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 dark:from-[#0B1120] dark:via-[#0c1322] dark:to-[#0B1120]">
      
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-teal-500/10 dark:bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10 w-full">
        
        {/* Trust Badges Row */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>AES-256-GCM Vault</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs">
            <KeyRound className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            <span>Passkey / WebAuthn</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs">
            <Fingerprint className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>AI Security Audits</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl sm:text-5xl lg:text-7xl font-outfit font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-5 sm:mb-6 break-words"
        >
          Your Digital Life, <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-300">
            Securely Protected.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Store, manage and organize your passwords, documents, secure notes and identity information — all in one modern, military-grade encrypted vault.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link 
            href="/register"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="#features"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-xs"
          >
            Explore Features
          </a>
        </motion.div>

        {/* Floating Mini Vault UI Demo Canvas */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="w-full max-w-4xl mx-auto rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xl p-6 sm:p-8 backdrop-blur-md relative"
        >
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono text-slate-400 ml-2">vault.mysafevault.app</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
                AES-256 Synced
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-left">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
              <span className="text-xs text-slate-500 font-medium">Encrypted Items</span>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">100%</p>
              <span className="text-[10px] text-emerald-600 font-semibold">Zero Leaks</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
              <span className="text-xs text-slate-500 font-medium">Security Score</span>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">98/100</p>
              <span className="text-[10px] text-emerald-600 font-semibold">Top Rating</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
              <span className="text-xs text-slate-500 font-medium">Passkey Support</span>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">FIDO2</p>
              <span className="text-[10px] text-slate-500 font-semibold">WebAuthn</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
              <span className="text-xs text-slate-500 font-medium">AI Insights</span>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">Active</p>
              <span className="text-[10px] text-indigo-500 font-semibold">Gemini AI</span>
            </div>
          </div>
        </motion.div>

        {/* Tech Stack Strip */}
        <div className="mt-16 text-xs uppercase tracking-widest text-slate-400 font-semibold">
          Built on Next.js 15 • Supabase • Prisma • WebAuthn • AES-256 Cryptography
        </div>

      </div>
    </section>
  );
}

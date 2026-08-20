"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, KeyRound, Fingerprint } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-12 px-6 lg:px-12 overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-sm font-medium text-slate-300 mb-8 backdrop-blur-sm"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>AES-256-GCM Zero-Knowledge Encryption</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl md:text-7xl font-outfit font-extrabold text-white tracking-tight leading-tight mb-6"
        >
          Your Digital Life, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">
            Cryptographically Secured.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          MySafeVault is an advanced, offline-capable password and document manager. 
          Your data is encrypted on your device before it ever reaches our servers. 
          Not even we can read it.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            href="/register"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] group"
          >
            Create Your Vault
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white px-8 py-4 rounded-xl font-medium transition-all backdrop-blur-sm"
          >
            Access Existing Vault
          </Link>
        </motion.div>

        {/* Visual Trust Indicators */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-20 flex flex-wrap justify-center gap-8 text-slate-500"
        >
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5" />
            <span className="text-sm font-medium">End-to-End Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5" />
            <span className="text-sm font-medium">Biometric Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-medium">Zero-Knowledge Proof</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

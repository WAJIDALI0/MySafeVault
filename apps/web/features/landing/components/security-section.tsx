"use client";

import { motion } from "framer-motion";
import { Lock, FileKey, Shield, ArrowRight, Database, Key } from "lucide-react";

export function SecuritySection() {
  return (
    <section className="py-24 px-6 lg:px-12 bg-slate-50/70 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
        
        {/* Left Content */}
        <div className="lg:w-1/2 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/40 mb-4">
              <Shield className="w-3.5 h-3.5" /> Cryptographic Standards
            </div>
            <h2 className="text-3xl md:text-5xl font-outfit font-bold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
              Security by design, verified by code.
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed mb-4">
              Every secret, credential, and document in MySafeVault is sealed using authenticated <span className="text-emerald-600 dark:text-emerald-400 font-semibold">AES-256-GCM</span> (Galois/Counter Mode).
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
              Each item receives a unique cryptographically random initialization vector (IV) and a 128-bit authentication tag. Even in the event of a raw database dump, your payload remains completely unreadable without the cryptographic key.
            </p>
          </motion.div>

          <motion.ul 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-3.5 pt-2"
          >
            {[
              "Authenticated AES-256-GCM with 128-bit integrity tags",
              "Unique 96-bit cryptographic nonces (IV) per encrypted item",
              "FIDO2 WebAuthn Passkeys & TOTP multi-factor protection",
              "Strict profile-partitioned row-level isolation"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm font-medium">
                <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#10b981] border border-emerald-500/20 shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Right Content - Visual Architecture Diagram */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:w-1/2 w-full"
        >
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 relative shadow-md">
            
            {/* Client Tier */}
            <div className="flex flex-col items-center bg-slate-50 dark:bg-[#0B1120] border border-slate-200/80 dark:border-slate-800 p-5 rounded-xl mb-6 relative z-10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Client Tier (Browser / Mobile)</span>
              <div className="flex items-center gap-4 w-full justify-center">
                <div className="text-center">
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                    <FileKey className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Plaintext Data</span>
                </div>
                
                <div className="flex items-center text-slate-400">
                  <span className="text-[10px] bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 rounded-full text-emerald-700 dark:text-emerald-400 font-mono font-medium">TLS 1.3</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>

                <div className="text-center">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                    <Key className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">WebAuthn Token</span>
                </div>
              </div>
            </div>

            {/* Cryptographic Engine */}
            <div className="flex flex-col items-center bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 p-5 rounded-xl relative z-10 mb-6">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">Cryptographic Engine</span>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                <Lock className="w-4 h-4 text-[#10b981]" />
                AES-256-GCM + 96-bit Random IV + Auth Tag
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center mt-1">Authenticated symmetric cipher executing isolated cryptographic operations.</p>
            </div>
            
            {/* Database Node */}
            <div className="flex flex-col items-center bg-slate-50 dark:bg-[#0B1120] border border-slate-200/80 dark:border-slate-800 p-5 rounded-xl relative z-10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Database Tier (PostgreSQL + RLS)</span>
              <div className="text-center">
                <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                  <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Sealed Ciphertext Only</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-[280px] mx-auto">Payloads are stored purely as encrypted bytes with cryptographic tag validation on read.</p>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Lock, FileKey, Shield, ArrowRight } from "lucide-react";

export function SecuritySection() {
  return (
    <section className="py-24 px-6 lg:px-12 bg-slate-950 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-900/10 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
        
        {/* Left Content */}
        <div className="lg:w-1/2 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-outfit font-bold text-white mb-6 leading-tight">
              Trust math, <br /> not promises.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              Unlike traditional password managers, MySafeVault uses a strict Zero-Knowledge architecture. Your master password is never sent to our servers.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed">
              We encrypt your data directly in your browser using military-grade <span className="text-emerald-400 font-medium">AES-256-GCM</span>. The only thing we store is scrambled ciphertext. Even if our databases are compromised, your data remains mathematically impossible to read.
            </p>
          </motion.div>

          <motion.ul 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 pt-4"
          >
            {[
              "PBKDF2 key derivation with high iteration count",
              "Client-side encryption and decryption",
              "Cryptographically secure pseudo-random nonces",
              "Strict Content Security Policies (CSP)"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <Shield className="w-5 h-5 text-emerald-500 shrink-0" />
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
            
            {/* Browser Node */}
            <div className="flex flex-col items-center bg-[#0B1120] border border-slate-700 p-6 rounded-xl mb-8 relative z-10">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Your Device</span>
              <div className="flex items-center gap-4 w-full justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FileKey className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">Raw Data</span>
                </div>
                
                <div className="flex items-center text-slate-500">
                  <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-emerald-400 font-mono">Encrypt</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Lock className="w-6 h-6 text-slate-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">Ciphertext</span>
                </div>
              </div>
            </div>

            {/* Connecting line */}
            <div className="absolute left-1/2 top-[130px] bottom-20 w-px bg-gradient-to-b from-slate-700 to-indigo-500/50 -translate-x-1/2"></div>
            
            {/* Server Node */}
            <div className="flex flex-col items-center bg-indigo-950/20 border border-indigo-500/20 p-6 rounded-xl relative z-10 mt-16">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-4">Our Servers</span>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-indigo-400" />
                </div>
                <span className="text-sm font-medium text-slate-300">Encrypted Storage</span>
                <p className="text-xs text-slate-500 mt-1 max-w-[200px] mx-auto">We only store and sync the ciphertext.</p>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}

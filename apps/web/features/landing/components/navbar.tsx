"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

export function LandingNavbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 h-20 bg-[#0B1120]/80 backdrop-blur-md border-b border-slate-800/50"
    >
      <Link href="/" className="flex items-center gap-2 group">
        <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
          <Lock className="w-6 h-6 text-emerald-400" />
        </div>
        <span className="font-outfit font-bold text-xl text-white tracking-tight">MySafeVault</span>
      </Link>

      <div className="flex items-center gap-4">
        <Link 
          href="/login" 
          className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          Sign In
        </Link>
        <Link 
          href="/register"
          className="text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
        >
          Get Started
        </Link>
      </div>
    </motion.nav>
  );
}

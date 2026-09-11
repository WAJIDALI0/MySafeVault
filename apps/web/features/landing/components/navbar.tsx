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
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 sm:px-6 lg:px-12 h-16 sm:h-20 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/50"
    >
      <Link href="/" className="flex items-center gap-2 group shrink-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform shadow-xs">
          <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <span className="font-outfit font-bold text-base sm:text-xl text-slate-900 dark:text-white tracking-tight">MySafeVault</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
        <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
        <a href="#security" className="hover:text-slate-900 dark:hover:text-white transition-colors">Security</a>
        <Link href="/docs" className="hover:text-slate-900 dark:hover:text-white transition-colors">API & Specs</Link>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <Link 
          href="/login" 
          className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-1.5 sm:px-3 sm:py-2 transition-colors"
        >
          Sign In
        </Link>
        <Link 
          href="/register"
          className="text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all shadow-sm hover:shadow-md whitespace-nowrap"
        >
          <span className="sm:hidden">Get Started</span>
          <span className="hidden sm:inline">Get Started Free</span>
        </Link>
      </div>
    </motion.nav>
  );
}

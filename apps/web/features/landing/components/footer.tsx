"use client";

import Link from "next/link";
import { Lock, Github, Twitter } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-800 bg-[#0B1120] py-12 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <span className="font-outfit font-bold text-lg text-white">MySafeVault</span>
          </Link>
          <p className="text-slate-500 text-sm">
            Your Digital Life, Cryptographically Secured.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <Link href="#" className="text-slate-400 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </Link>
          <Link href="#" className="text-slate-400 hover:text-white transition-colors">
            <Twitter className="w-5 h-5" />
          </Link>
        </div>

      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
        <p>&copy; {new Date().getFullYear()} MySafeVault. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}

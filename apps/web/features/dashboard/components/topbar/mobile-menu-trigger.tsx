"use client";

import { Menu } from "lucide-react";

export function MobileMenuTrigger() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-mobile-sidebar"))}
      className="lg:hidden p-2 -ml-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
      aria-label="Open navigation menu"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}

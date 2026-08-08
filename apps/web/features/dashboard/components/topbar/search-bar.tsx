"use client";

import { Search, Command } from "lucide-react";

export function SearchBar() {
  return (
    <div className="relative hidden md:flex items-center w-full max-w-md">
      <Search className="absolute left-3 w-4 h-4 text-slate-400" />
      <input 
        type="text" 
        placeholder="Search anything in your vault..." 
        className="w-full h-10 pl-10 pr-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#10B981] transition-shadow text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
      />
      <div className="absolute right-3 flex items-center gap-1 text-[10px] text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
        <Command className="w-3 h-3" />
        <span>K</span>
      </div>
    </div>
  );
}

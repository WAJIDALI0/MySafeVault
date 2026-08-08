"use client";

import { User } from "lucide-react";
import { logout } from "@/features/auth/actions/auth.actions";

export function UserMenu() {
  return (
    <form action={logout}>
      <button type="submit" title="Click to log out" className="flex items-center gap-2 p-1 pr-3 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-red-900/20 hover:border-red-500/50 transition-colors group">
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden group-hover:bg-red-100 dark:group-hover:bg-red-900/50">
          <User className="w-4 h-4 text-slate-500 group-hover:text-red-500" />
        </div>
        <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-red-500">Sign Out</span>
      </button>
    </form>
  );
}

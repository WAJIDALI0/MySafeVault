"use client";

import { User, Settings, LogOut, Activity, UserCircle } from "lucide-react";
import { logout } from "@/features/auth/actions/auth.actions";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface UserMenuProps {
  profile?: {
    full_name: string;
    email: string;
    avatar: string;
  };
}

export function UserMenu({ profile }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = profile?.full_name?.substring(0, 2).toUpperCase() || "U";

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1 pr-3 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center overflow-hidden border border-indigo-200 dark:border-indigo-800 shrink-0">
          {profile?.avatar ? (
            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">{initials}</span>
          )}
        </div>
        <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200">{profile?.full_name?.split(' ')[0] || "User"}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in duration-150 origin-top-right flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{profile?.full_name}</p>
            <p className="text-xs text-slate-500 truncate">{profile?.email}</p>
          </div>
          
          <div className="py-1">
            <Link 
              href="/profile" 
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <UserCircle className="w-4 h-4 text-slate-400" />
              Profile
            </Link>
            <Link 
              href="/settings/account" 
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              Settings
            </Link>
            <Link 
              href="/activity" 
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Activity className="w-4 h-4 text-slate-400" />
              Activity Log
            </Link>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 py-1">
            <form action={logout}>
              <button 
                type="submit" 
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

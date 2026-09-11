"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { X, Lock, Sparkles, ArrowRight } from "lucide-react";
import { InstallAppButton } from "../shared/install-app-button";

interface MobileSidebarProps {
  mainNavItems: any[];
  secondaryNavItems: any[];
  pathname: string;
}

export function MobileSidebar({ mainNavItems, secondaryNavItems, pathname }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-mobile-sidebar", handleOpen);
    return () => window.removeEventListener("open-mobile-sidebar", handleOpen);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={() => setIsOpen(false)} 
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[85vw] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 border-r border-slate-200 dark:border-slate-800">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <Link 
            href="/dashboard" 
            onClick={() => setIsOpen(false)}
            className="text-[#10B981] font-bold text-lg flex items-center gap-2"
          >
            <Lock className="w-5 h-5" />
            <span className="font-outfit font-black">MySafeVault</span>
          </Link>
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-2 -mr-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Main Menu
            </div>
            {mainNavItems.map((item) => {
              const url = new URL(`http://localhost${item.href}`);
              const itemPath = url.pathname;
              const isActive = pathname === itemPath || pathname.startsWith(`${itemPath}/`);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", isActive ? "text-emerald-500" : "text-slate-400")} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              System
            </div>
            {secondaryNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", isActive ? "text-emerald-500" : "text-slate-400")} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-900/60">
          <InstallAppButton />

          <Link
            href="/settings/storage"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-[#064e3b] via-[#022c22] to-[#01140e] text-white border border-emerald-500/30 text-xs font-bold"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Upgrade to Pro</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-300">
              <span>PRO</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

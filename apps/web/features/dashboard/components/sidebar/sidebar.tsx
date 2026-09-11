"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getStorageStats } from "@/features/vault/actions/vault.actions";
import {
  LayoutDashboard,
  Shield,
  FileText,
  KeyRound,
  FileEdit,
  Fingerprint,
  Search,
  Activity,
  Bell,
  Settings,
  Lock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { MobileSidebar } from "./mobile-sidebar";
import { InstallAppButton } from "../shared/install-app-button";

const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Vault", href: "/vault", icon: Shield },
  { name: "Private Vault", href: "/private-vault", icon: Lock },
  { name: "Documents", href: "/vault?category=DOCUMENT", icon: FileText },
  { name: "Passwords", href: "/vault?category=PASSWORD", icon: KeyRound },
  { name: "Secure Notes", href: "/vault?category=SECURE_NOTE", icon: FileEdit },
  { name: "Identity", href: "/vault?category=IDENTITY", icon: Fingerprint },
];

const secondaryNavItems = [
  { name: "Search", href: "/search", icon: Search },
  { name: "Activity", href: "/activity", icon: Activity },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings/account", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [storageBytes, setStorageBytes] = useState(0);
  const [categories, setCategories] = useState<any>({});

  useEffect(() => {
    getStorageStats().then((res) => {
      if (res.success && res.totalBytes !== undefined) {
        setStorageBytes(res.totalBytes);
        setCategories(res.categories);
      }
    });
  }, []);

  // Format bytes to KB/MB/GB
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const STORAGE_LIMIT = 100 * 1024 * 1024 * 1024; // 100 GB for the UI demo
  const usagePercentage = Math.min(100, Math.max(0, (storageBytes / STORAGE_LIMIT) * 100)).toFixed(2);

  return (
    <>
      <MobileSidebar 
        mainNavItems={mainNavItems} 
        secondaryNavItems={secondaryNavItems} 
        pathname={pathname} 
      />

      <aside className="hidden lg:flex flex-col w-64 h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-2 text-[#10B981] font-bold text-xl">
            <Lock className="w-6 h-6" />
            <span>MySafeVault</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-3.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="space-y-0.5">
            {mainNavItems.map((item) => {
              const url = new URL(`http://localhost${item.href}`);
              const itemPath = url.pathname;
              const itemCategory = url.searchParams.get("category");
              
              const isPathMatch = pathname === itemPath || pathname.startsWith(`${itemPath}/`);
              const isCategoryMatch = itemCategory ? searchParams.get("category") === itemCategory : !searchParams.has("category");
              
              const isActive = isPathMatch && (itemPath === "/vault" ? isCategoryMatch : true);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shadow-2xs before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-emerald-500 before:rounded-r-full"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:translate-x-0.5"
                  )}
                >
                  <item.icon className={cn("w-4 h-4 transition-colors", isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400")} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="space-y-0.5">
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              System
            </div>
            {secondaryNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shadow-2xs before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-emerald-500 before:rounded-r-full"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:translate-x-0.5"
                  )}
                >
                  <item.icon className={cn("w-4 h-4 transition-colors", isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400")} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Compact Dock Footer */}
        <div className="p-2.5 border-t border-slate-200/80 dark:border-slate-800 space-y-1.5 bg-slate-50/50 dark:bg-slate-900/40">
          {/* 1. Install Desktop App Action */}
          <InstallAppButton />

          {/* 2. Luxury Compact Upgrade to Pro Banner */}
          <Link 
            href="/settings/storage" 
            className="relative overflow-hidden flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-[#064e3b] via-[#022c22] to-[#01140e] text-white border border-emerald-500/30 hover:border-emerald-400/60 shadow-xs hover:shadow-emerald-500/10 transition-all group active:scale-[0.99]"
          >
            {/* Ambient decorative glow */}
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-emerald-400/20 rounded-full blur-lg pointer-events-none" />

            <div className="flex items-center gap-2 relative z-10">
              <div className="p-1 rounded-lg bg-emerald-400/20 text-emerald-300 group-hover:scale-110 transition-transform">
                <Sparkles className="w-3 h-3" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block leading-tight flex items-center gap-1.5">
                  Upgrade to Pro
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </span>
                <span className="text-[9px] text-emerald-200/70 font-medium">Unlock AI & Vaults</span>
              </div>
            </div>

            <div className="flex items-center gap-1 relative z-10">
              <span className="text-[8px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded-full border border-emerald-400/30">
                PRO
              </span>
              <ArrowRight className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* 3. Compact Storage Used Meter */}
          <div className="bg-white dark:bg-slate-950/80 rounded-xl px-2.5 py-1.5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex justify-between items-center mb-1 text-[10px]">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Storage</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{formatBytes(storageBytes)} / 100 GB</span>
            </div>
            <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.max(Number(usagePercentage), 1)}%` }} />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

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
} from "lucide-react";
import { MobileSidebar } from "./mobile-sidebar";

const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Vault", href: "/vault", icon: Shield },
  { name: "Documents", href: "/vault?category=DOCUMENT", icon: FileText },
  { name: "Passwords", href: "/vault?category=PASSWORD", icon: KeyRound },
  { name: "Secure Notes", href: "/vault?category=SECURE_NOTE", icon: FileEdit },
  { name: "Identity", href: "/vault?category=IDENTITY", icon: Fingerprint },
];

const secondaryNavItems = [
  { name: "Search", href: "/search", icon: Search },
  { name: "Activity", href: "/activity", icon: Activity },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
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

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-8">
          <div className="space-y-1">
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
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#10B981]/10 text-[#10B981]"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="space-y-1">
            <div className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              System
            </div>
            {secondaryNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#10B981]/10 text-[#10B981]"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-950 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-slate-500">Storage Used</span>
              <span className="text-xs font-medium text-slate-900 dark:text-slate-100">{usagePercentage}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#10B981] rounded-full" style={{ width: `${usagePercentage}%` }} />
            </div>
            <p className="text-[10px] text-slate-500 mb-2">{formatBytes(storageBytes)} / 100 GB</p>
            
            {storageBytes > 0 && (
              <div className="grid grid-cols-2 gap-1 mb-4 text-[9px] text-slate-400">
                <div className="flex justify-between"><span>Docs:</span> <span>{formatBytes(categories?.Documents || 0)}</span></div>
                <div className="flex justify-between"><span>Notes:</span> <span>{formatBytes(categories?.Notes || 0)}</span></div>
                <div className="flex justify-between"><span>Pass:</span> <span>{formatBytes(categories?.Passwords || 0)}</span></div>
                <div className="flex justify-between"><span>Other:</span> <span>{formatBytes(categories?.Other || 0)}</span></div>
              </div>
            )}

            <button className="w-full py-1.5 px-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-md hover:opacity-90 transition-opacity">
              Upgrade Plan 👑
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

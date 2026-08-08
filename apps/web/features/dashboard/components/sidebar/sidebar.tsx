"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Passwords", href: "/passwords", icon: KeyRound },
  { name: "Secure Notes", href: "/notes", icon: FileEdit },
  { name: "Identity", href: "/identity", icon: Fingerprint },
];

const secondaryNavItems = [
  { name: "Search", href: "/search", icon: Search },
  { name: "Activity", href: "/activity", icon: Activity },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

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
              <span className="text-xs font-medium text-slate-900 dark:text-slate-100">32%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#10B981] w-[32%] rounded-full" />
            </div>
            <p className="text-[10px] text-slate-500 mb-4">32.4 GB / 100 GB</p>
            <button className="w-full py-1.5 px-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-md hover:opacity-90 transition-opacity">
              Upgrade Plan 👑
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

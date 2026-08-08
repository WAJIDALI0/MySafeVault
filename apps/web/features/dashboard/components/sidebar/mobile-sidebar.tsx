"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, X, Lock } from "lucide-react";

interface MobileSidebarProps {
  mainNavItems: any[];
  secondaryNavItems: any[];
  pathname: string;
}

export function MobileSidebar({ mainNavItems, secondaryNavItems, pathname }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Link href="/dashboard" className="flex items-center gap-2 text-[#10B981] font-bold text-lg">
          <Lock className="w-5 h-5" />
          <span>MySafeVault</span>
        </Link>
        <button onClick={() => setIsOpen(true)} className="p-2 -mr-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative w-64 max-w-sm bg-white dark:bg-slate-900 h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <span className="text-[#10B981] font-bold text-lg flex items-center gap-2">
                <Lock className="w-5 h-5" /> MySafeVault
              </span>
              <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-8">
              <div className="space-y-1">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                      pathname === item.href || pathname.startsWith(`${item.href}/`)
                        ? "bg-[#10B981]/10 text-[#10B981]"
                        : "text-slate-600 dark:text-slate-400"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

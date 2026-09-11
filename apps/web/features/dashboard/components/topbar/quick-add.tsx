"use client";

import { Plus, ChevronDown, KeyRound, StickyNote, FileText, Fingerprint } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export function QuickAdd() {
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

  const items = [
    { label: "Password", icon: KeyRound, type: "PASSWORD", color: "text-purple-500" },
    { label: "Secure Note", icon: StickyNote, type: "SECURE_NOTE", color: "text-amber-500" },
    { label: "Document", icon: FileText, type: "DOCUMENT", color: "text-blue-500" },
    { label: "Identity", icon: Fingerprint, type: "IDENTITY", color: "text-pink-500" },
  ];

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-gradient-to-r from-[#10B981] to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md hover:shadow-emerald-500/20 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Quick Add</span>
        <ChevronDown className="w-3.5 h-3.5 sm:ml-0.5 opacity-80" />
      </button>

      {open && (
        <>
          {/* Mobile backdrop to dismiss dropdown on tap */}
          <div 
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs sm:hidden"
            onClick={() => setOpen(false)}
          />

          <div className="fixed inset-x-4 top-16 z-50 mx-auto max-w-xs sm:max-w-none sm:inset-x-auto sm:absolute sm:right-0 sm:top-auto sm:mt-2 sm:w-52 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-150 origin-top sm:origin-top-right">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 mb-1">
              Create In Vault
            </div>
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.type}
                  href={`/vault?action=new&type=${item.type}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 sm:py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors rounded-xl font-medium"
                >
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

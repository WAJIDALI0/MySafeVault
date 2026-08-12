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
        className="flex items-center gap-2 bg-[#10B981] hover:bg-[#10B981]/90 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:ring-offset-1 dark:focus:ring-offset-[#0B1120]"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Quick Add</span>
        <ChevronDown className="w-4 h-4 sm:ml-1 opacity-70" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg py-1 z-50 animate-in fade-in zoom-in duration-150 origin-top-right">
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1">
            Add New Item
          </div>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.type}
                href={`/vault?action=new&type=${item.type}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Icon className={`w-4 h-4 ${item.color}`} />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

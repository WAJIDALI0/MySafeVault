"use client";

import { KeyRound, FileText, StickyNote, Fingerprint, Plus } from "lucide-react";
import { AddVaultItemDialog } from "../../../vault/components/add-vault-item-dialog";

const actions = [
  { type: "PASSWORD", label: "Add Password", icon: KeyRound, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10" },
  { type: "DOCUMENT", label: "Add Document", icon: FileText, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { type: "SECURE_NOTE", label: "Add Secure Note", icon: StickyNote, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10" },
  { type: "IDENTITY", label: "Upload Identity", icon: Fingerprint, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-500/10" },
];

export function QuickActionsCard() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-white to-slate-50/70 dark:from-[#0b1120] dark:via-[#0b1120] dark:to-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 h-full flex flex-col justify-between shadow-xs hover:shadow-xl hover:shadow-emerald-500/5 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
      {/* Top subtle accent line */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-emerald-500/40 via-teal-400/40 to-emerald-600/40 opacity-80" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <h3 className="font-bold font-outfit text-slate-900 dark:text-white text-base sm:text-lg">Quick Actions</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">Instant encrypted item creation</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200/70 dark:border-emerald-800/50 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Fast Add
        </span>
      </div>
      
      <div className="space-y-3 my-auto relative z-10">
        {actions.map((action) => {
          const ActionIcon = action.icon;
          return (
            <AddVaultItemDialog key={action.type} defaultType={action.type as any}>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-[#111827]/80 border border-slate-200/90 dark:border-slate-800/80 rounded-xl hover:border-emerald-300 dark:hover:border-emerald-500/40 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 hover:shadow-md hover:shadow-emerald-500/5 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group text-left cursor-pointer shadow-2xs">
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl ${action.bg} ${action.color} ring-1 ring-slate-200/60 dark:ring-slate-800 group-hover:scale-110 transition-transform`}>
                    <ActionIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {action.label}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 border border-slate-200/80 dark:border-slate-700/80 group-hover:border-emerald-300 dark:group-hover:border-emerald-500/50 transition-all shadow-2xs">
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                </div>
              </button>
            </AddVaultItemDialog>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Lock, ShieldCheck, Download, UploadCloud, ArrowRight, HardDrive, Fingerprint } from "lucide-react";
import { ExportVaultDialog } from "@/features/vault/components/export-vault-dialog";
import { ImportVaultDialog } from "@/features/vault/components/import-vault-dialog";

export function PrivateVaultStatusCard() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-white to-slate-50/70 dark:from-[#0b1120] dark:via-[#0b1120] dark:to-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 h-full flex flex-col justify-between shadow-xs hover:shadow-xl hover:shadow-emerald-500/5 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
      {/* Accent header line */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 opacity-80" />

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-outfit text-slate-900 dark:text-white text-base">
                Private Vault & Lock Folder
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Zero-Knowledge Local Storage
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200/70 dark:border-emerald-800/50 shrink-0">
            <Fingerprint className="w-3.5 h-3.5" />
            Biometric
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 mb-3.5 leading-relaxed">
          Store high-priority credentials offline in IndexedDB with client-side AES-256-GCM encryption and automatic tab-inactivity locks.
        </p>

        {/* Feature Highlights: Fits comfortably without clipping */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
              Offline Storage
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
              AES-256-GCM
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <Link
          href="/private-vault"
          className="w-full flex items-center justify-between px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm group"
        >
          <span>Open Private Lock Folder</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        <div className="grid grid-cols-2 gap-2">
          <ExportVaultDialog>
            <button
              type="button"
              className="w-full py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              <span>Backup</span>
            </button>
          </ExportVaultDialog>

          <ImportVaultDialog>
            <button
              type="button"
              className="w-full py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5 text-blue-500" />
              <span>Restore</span>
            </button>
          </ImportVaultDialog>
        </div>
      </div>
    </div>
  );
}

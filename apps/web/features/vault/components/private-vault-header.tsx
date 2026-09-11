"use client";

import { ShieldCheck, HardDrive, Cloud, Lock, Key, Download, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportVaultDialog } from "./export-vault-dialog";
import { ImportVaultDialog } from "./import-vault-dialog";

interface PrivateVaultHeaderProps {
  isSyncing: boolean;
  recoveryKey: string | null;
  showRecoveryKeyBanner: boolean;
  onLockVault: () => void;
  onToggleRecoveryKeyBanner: () => void;
  onSyncWithCloud: () => void;
  onImportComplete?: () => void;
}

export function PrivateVaultHeader({
  isSyncing,
  recoveryKey,
  showRecoveryKeyBanner,
  onLockVault,
  onToggleRecoveryKeyBanner,
  onSyncWithCloud,
  onImportComplete,
}: PrivateVaultHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/20 p-6 md:p-8 text-white shadow-xl">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Zero-Knowledge Encrypted Folder
            </span>
            <button
              type="button"
              onClick={onSyncWithCloud}
              disabled={isSyncing}
              title="Click to sync immediately across laptop and mobile"
              className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
            >
              <Cloud className={`w-3.5 h-3.5 ${isSyncing ? "animate-bounce text-cyan-300" : "text-emerald-400"}`} />
              {isSyncing ? "Syncing devices..." : "Cloud Synced (Mobile & Laptop)"}
            </button>
            <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              Offline IndexedDB
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Private Vault & Offline Storage
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Items in this vault are encrypted locally with AES-256-GCM. Decrypted records only exist in transient memory and lock automatically on inactivity or tab switch.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onLockVault}
            className="bg-slate-800/80 hover:bg-slate-700 text-white border-slate-700 gap-1.5 text-xs font-semibold rounded-xl"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            Lock Now
          </Button>

          {recoveryKey && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleRecoveryKeyBanner}
              className="bg-slate-800/80 hover:bg-slate-700 text-white border-slate-700 gap-1.5 text-xs font-semibold rounded-xl"
            >
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              Recovery Key
            </Button>
          )}

          <ExportVaultDialog>
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-800/80 hover:bg-slate-700 text-white border-slate-700 gap-1.5 text-xs font-semibold rounded-xl"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Backup
            </Button>
          </ExportVaultDialog>

          <ImportVaultDialog onImportComplete={onImportComplete}>
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-800/80 hover:bg-slate-700 text-white border-slate-700 gap-1.5 text-xs font-semibold rounded-xl"
            >
              <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
              Restore
            </Button>
          </ImportVaultDialog>
        </div>
      </div>
    </div>
  );
}

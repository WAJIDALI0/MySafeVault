"use client";

import { useState, useEffect } from "react";
import { Lock, HardDrive, Download, Trash2, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportVaultDialog } from "@/features/vault/components/export-vault-dialog";
import { clearLocalPrivateVault, countLocalPrivateItems } from "@/lib/storage/local-vault-store";

export function PrivateVaultSecurityCard() {
  const [itemCount, setItemCount] = useState<number>(0);
  const [autoLockMinutes, setAutoLockMinutes] = useState<number>(5);
  const [isWiping, setIsWiping] = useState(false);
  const [wiped, setWiped] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    countLocalPrivateItems("current_user").then(setItemCount);

    const savedAutoLock = localStorage.getItem("msv_pv_autolock");
    if (savedAutoLock) {
      setAutoLockMinutes(Number(savedAutoLock));
    }
  }, []);

  const handleAutoLockChange = (mins: number) => {
    setAutoLockMinutes(mins);
    localStorage.setItem("msv_pv_autolock", mins.toString());
  };

  const handleWipe = async () => {
    if (!window.confirm("Are you sure you want to wipe your local private vault? Any unbacked items will be permanently erased.")) {
      return;
    }

    try {
      setIsWiping(true);
      await clearLocalPrivateVault("current_user");
      localStorage.removeItem("msv_pv_hash");
      localStorage.removeItem("msv_pv_autolock");
      setItemCount(0);
      setWiped(true);
      setTimeout(() => setWiped(false), 3000);
    } catch (err) {
      console.error("Failed to wipe local vault:", err);
    } finally {
      setIsWiping(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0b1120] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Private Vault & Offline Storage
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Zero-knowledge local folder encrypted with AES-256-GCM
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {itemCount} Local {itemCount === 1 ? "Item" : "Items"}
          </span>
        </div>

        <div className="space-y-4 pt-2">
          {/* Auto Lock Timer setting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Inactivity Auto-Lock
                </p>
                <p className="text-[10px] text-slate-500">
                  Lock vault automatically when idle or minimizing tab
                </p>
              </div>
            </div>

            <select
              value={autoLockMinutes}
              onChange={(e) => handleAutoLockChange(Number(e.target.value))}
              className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value={0}>Immediately</option>
              <option value={1}>1 Minute</option>
              <option value={5}>5 Minutes</option>
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
            </select>
          </div>

          {/* Backup Action */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-500" />
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Export Encrypted Backup
                </p>
                <p className="text-[10px] text-slate-500">
                  Download authenticated .msvault container
                </p>
              </div>
            </div>

            <ExportVaultDialog>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 gap-1.5 border-slate-200 dark:border-slate-700"
              >
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                Export
              </Button>
            </ExportVaultDialog>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          IndexedDB Isolated
        </span>

        <button
          type="button"
          onClick={handleWipe}
          disabled={isWiping}
          className="text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {wiped ? "Vault Cleared" : isWiping ? "Clearing..." : "Wipe Local Vault"}
        </button>
      </div>
    </div>
  );
}

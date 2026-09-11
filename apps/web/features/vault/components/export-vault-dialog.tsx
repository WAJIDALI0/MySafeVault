"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchVaultItemsForExport } from "../actions/vault-export-import.actions";
import { buildMsvaultExport } from "@/lib/crypto/msvault-package";
import { getPasswordStrength } from "@/lib/password-utils";
import {
  ShieldCheck,
  Lock,
  Download,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  FileCheck,
  Loader2,
} from "lucide-react";

interface ExportVaultDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultScope?: "ALL" | "PASSWORDS" | "DOCUMENTS";
}

export function ExportVaultDialog({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultScope = "ALL",
}: ExportVaultDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = (val: boolean) => {
    if (controlledOnOpenChange) controlledOnOpenChange(val);
    else setInternalOpen(val);
  };

  const [scope, setScope] = useState<"ALL" | "PASSWORDS" | "DOCUMENTS">(defaultScope);
  const [passphrase, setPassphrase] = useState("");
  const [confirmPassphrase, setConfirmPassphrase] = useState("");
  const [passwordHint, setPasswordHint] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(passphrase);

  const resetForm = () => {
    setPassphrase("");
    setConfirmPassphrase("");
    setPasswordHint("");
    setError(null);
    setSuccess(false);
  };

  const handleExport = async () => {
    setError(null);

    if (!passphrase || passphrase.length < 6) {
      setError("Passphrase must be at least 6 characters long.");
      return;
    }

    if (passphrase !== confirmPassphrase) {
      setError("Passphrases do not match. Please re-enter.");
      return;
    }

    try {
      setIsExporting(true);

      // 1. Fetch user items securely
      const res = await fetchVaultItemsForExport();
      if (!res.success || !res.items) {
        throw new Error(res.error || "Failed to retrieve vault items.");
      }

      // 2. Filter by scope if requested
      let filteredItems = res.items;
      if (scope === "PASSWORDS") {
        filteredItems = res.items.filter((i) => i.type === "PASSWORD");
      } else if (scope === "DOCUMENTS") {
        filteredItems = res.items.filter((i) => i.type === "DOCUMENT");
      }

      if (filteredItems.length === 0) {
        throw new Error("No items found matching the selected export scope.");
      }

      // 3. Client-side encryption with Web Crypto PBKDF2 (100k iter) + AES-256-GCM
      const msvaultContent = await buildMsvaultExport({
        passphrase,
        passwordHint,
        items: filteredItems,
        metadata: {
          scope,
          totalExported: filteredItems.length,
          generatedBy: "MySafeVault Client",
        },
      });

      // 4. Trigger client-side download
      const blob = new Blob([msvaultContent], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().slice(0, 10);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mysafevault-backup-${timestamp}.msvault`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        resetForm();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during export.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) resetForm();
      }}
    >
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Encrypted Vault Export
            </DialogTitle>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Export your items into a tamper-proof <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">.msvault</span> container. Protected with 256-bit AES-GCM and PBKDF2.
          </p>
        </DialogHeader>

        {success ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 animate-bounce" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Encrypted Backup Downloaded!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Keep your passphrase safe. You will need it to restore this backup.
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Scope Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Export Scope
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {(["ALL", "PASSWORDS", "DOCUMENTS"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setScope(opt)}
                    className={`py-2 px-3 text-xs rounded-xl border font-medium transition-all ${
                      scope === opt
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 shadow-sm"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {opt === "ALL" ? "All Items" : opt === "PASSWORDS" ? "Passwords" : "Docs"}
                  </button>
                ))}
              </div>
            </div>

            {/* Passphrase Input */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Backup Passphrase (Required)
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a strong passphrase"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="pr-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {passphrase && (
                <div className="space-y-1 pt-1">
                  <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength === "Weak"
                          ? "w-1/3 bg-red-500"
                          : strength === "Medium"
                          ? "w-2/3 bg-amber-500"
                          : "w-full bg-emerald-500"
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Strength: {strength}</span>
                    <span>Min 6 characters</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Passphrase */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Confirm Passphrase
              </Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Repeat passphrase"
                value={confirmPassphrase}
                onChange={(e) => setConfirmPassphrase(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            {/* Password Hint */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password Hint <span className="text-slate-400 font-normal">(Optional)</span>
              </Label>
              <Input
                type="text"
                placeholder="e.g. My favorite university library room"
                value={passwordHint}
                onChange={(e) => setPasswordHint(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
              />
            </div>

            {/* Security Notice */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                Zero-knowledge guarantee: Your passphrase is never sent to any server. If you forget your passphrase, this backup cannot be recovered.
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isExporting}
            className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
          >
            Cancel
          </Button>
          {!success && (
            <Button
              type="button"
              onClick={handleExport}
              disabled={isExporting || !passphrase || passphrase !== confirmPassphrase}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-2 shadow-sm"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Encrypting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export .msvault
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useRef } from "react";
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
import {
  inspectMsvaultHeader,
  parseAndDecryptMsvault,
  ExportVaultItem,
} from "@/lib/crypto/msvault-package";
import { restoreImportedVaultItems } from "../actions/vault-export-import.actions";
import {
  UploadCloud,
  FileCheck,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Key,
  FileText,
  CreditCard,
  UserCheck,
  Loader2,
} from "lucide-react";

interface ImportVaultDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onImportComplete?: () => void;
}

export function ImportVaultDialog({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onImportComplete,
}: ImportVaultDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = (val: boolean) => {
    if (controlledOnOpenChange) controlledOnOpenChange(val);
    else setInternalOpen(val);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rawFileContent, setRawFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileHeader, setFileHeader] = useState<{
    itemCount?: number;
    passwordHint?: string;
    createdAt?: string;
  } | null>(null);

  const [passphrase, setPassphrase] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const [decryptedItems, setDecryptedItems] = useState<ExportVaultItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

  const resetState = () => {
    setRawFileContent(null);
    setFileName("");
    setFileHeader(null);
    setPassphrase("");
    setError(null);
    setDecryptedItems([]);
    setSelectedItemIds(new Set());
    setSuccessCount(null);
  };

  const handleFileSelect = (file: File) => {
    setError(null);
    if (!file.name.endsWith(".msvault") && !file.name.endsWith(".json")) {
      setError("Please select a valid .msvault backup container file.");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setRawFileContent(content);
      const inspection = inspectMsvaultHeader(content);
      if (!inspection.isValid) {
        setError(inspection.error || "File is not a recognized MySafeVault container.");
        return;
      }
      setFileHeader({
        itemCount: inspection.itemCount,
        passwordHint: inspection.passwordHint,
        createdAt: inspection.createdAt,
      });
    };
    reader.onerror = () => setError("Failed to read file.");
    reader.readAsText(file);
  };

  const handleDecrypt = async () => {
    if (!rawFileContent) return;
    if (!passphrase) {
      setError("Please enter the container passphrase.");
      return;
    }

    try {
      setError(null);
      setIsDecrypting(true);

      const result = await parseAndDecryptMsvault(rawFileContent, passphrase);
      setDecryptedItems(result.items);
      // Select all by default
      setSelectedItemIds(new Set(result.items.map((i) => i.id || Math.random().toString())));
    } catch (err: any) {
      if (err.message?.includes("ERR_DECRYPT_FAILED") || err.message?.includes("Invalid passphrase")) {
        setError("Incorrect passphrase. Unable to decrypt container.");
      } else if (err.message?.includes("TAMPER_DETECTED")) {
        setError("Integrity error: This backup file has been modified or corrupted.");
      } else {
        setError(err.message || "Failed to decrypt container.");
      }
    } finally {
      setIsDecrypting(false);
    }
  };

  const toggleSelectItem = (id: string) => {
    const updated = new Set(selectedItemIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedItemIds(updated);
  };

  const toggleSelectAll = () => {
    if (selectedItemIds.size === decryptedItems.length) {
      setSelectedItemIds(new Set());
    } else {
      setSelectedItemIds(new Set(decryptedItems.map((i) => i.id)));
    }
  };

  const handleConfirmImport = async () => {
    const itemsToImport = decryptedItems
      .filter((i) => selectedItemIds.has(i.id))
      .map((i) => ({
        title: i.title,
        type: i.type || i.category?.toUpperCase() || "PASSWORD",
        description: i.description || null,
        data: i.data || {
          username: i.username,
          password: i.password,
          url: i.url,
          notes: i.notes,
        },
        isFavorite: Boolean(i.isFavorite),
      }));

    if (itemsToImport.length === 0) {
      setError("Please select at least one item to import.");
      return;
    }

    try {
      setIsImporting(true);
      setError(null);
      const res = await restoreImportedVaultItems(itemsToImport);
      if (!res.success) {
        throw new Error(res.error || "Failed to import items.");
      }

      setSuccessCount(res.importedCount);
      if (onImportComplete) onImportComplete();
      setTimeout(() => {
        setOpen(false);
        resetState();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred during import.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) resetState();
      }}
    >
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Restore Encrypted Backup
            </DialogTitle>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Import an encrypted <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">.msvault</span> file with client-side zero-knowledge decryption.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1 py-2 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successCount !== null ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 animate-bounce" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Restore Complete!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Successfully restored {successCount} items to your vault.
              </p>
            </div>
          ) : decryptedItems.length > 0 ? (
            /* STEP 3: Decrypted Item Preview */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Items to Restore ({selectedItemIds.size}/{decryptedItems.length})
                </span>
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                >
                  {selectedItemIds.size === decryptedItems.length ? "Deselect All" : "Select All"}
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 p-2 bg-slate-50/50 dark:bg-slate-950/50">
                {decryptedItems.map((item, idx) => {
                  const isSelected = selectedItemIds.has(item.id || idx.toString());
                  return (
                    <div
                      key={item.id || idx}
                      onClick={() => toggleSelectItem(item.id || idx.toString())}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-emerald-500/50 bg-white dark:bg-slate-900 shadow-sm"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.type === "PASSWORD" ? (
                            <Key className="w-3.5 h-3.5" />
                          ) : item.type === "DOCUMENT" ? (
                            <FileText className="w-3.5 h-3.5" />
                          ) : (
                            <CreditCard className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                            {item.title}
                          </p>
                          {item.data?.username && (
                            <p className="text-[11px] text-slate-500 truncate">
                              {item.data.username}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono uppercase">
                        {item.type || "Item"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* STEP 1 & 2: File Upload + Decrypt Passphrase */
            <div className="space-y-4">
              {/* File Dropzone */}
              <input
                type="file"
                ref={fileInputRef}
                accept=".msvault,.json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />

              {!rawFileContent ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center hover:border-emerald-500 dark:hover:border-emerald-500 cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/30"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-white">
                    Click to select your <span className="text-emerald-600 dark:text-emerald-400">.msvault</span> file
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Encrypted container format with SHA-256 integrity checks
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">{fileName}</p>
                      <p className="text-[10px] text-slate-500">
                        {fileHeader?.itemCount ?? 0} encrypted items • {fileHeader?.createdAt ? new Date(fileHeader.createdAt).toLocaleDateString() : "Unknown date"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRawFileContent(null);
                      setFileHeader(null);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    Change
                  </button>
                </div>
              )}

              {/* Password Hint if present */}
              {fileHeader?.passwordHint && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
                  <Unlock className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <div>
                    <span className="font-semibold">Password Hint: </span>
                    <span>{fileHeader.passwordHint}</span>
                  </div>
                </div>
              )}

              {/* Passphrase Input */}
              {rawFileContent && (
                <div className="space-y-1.5 pt-1">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Enter Decryption Passphrase
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Passphrase used during export"
                      value={passphrase}
                      onChange={(e) => setPassphrase(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleDecrypt();
                      }}
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
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDecrypting || isImporting}
            className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
          >
            Cancel
          </Button>

          {decryptedItems.length > 0 ? (
            <Button
              type="button"
              onClick={handleConfirmImport}
              disabled={isImporting || selectedItemIds.size === 0}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-2 shadow-sm"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Restore Selected ({selectedItemIds.size})
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleDecrypt}
              disabled={isDecrypting || !rawFileContent || !passphrase}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-2 shadow-sm"
            >
              {isDecrypting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Decrypting in memory...
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  Decrypt & Preview
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

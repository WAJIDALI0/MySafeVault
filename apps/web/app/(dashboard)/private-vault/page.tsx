"use client";

import { useState } from "react";
import { usePrivateVault, DecryptedPrivateItem } from "@/features/vault/hooks/use-private-vault";
import { PrivateVaultLockScreen } from "@/features/vault/components/private-vault-lock-screen";
import { ExportVaultDialog } from "@/features/vault/components/export-vault-dialog";
import { ImportVaultDialog } from "@/features/vault/components/import-vault-dialog";
import { PrivateVaultItemDialog } from "@/features/vault/components/private-vault-item-dialog";
import { PrivateVaultItemViewDialog } from "@/features/vault/components/private-vault-item-view-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Lock,
  ShieldCheck,
  Plus,
  Download,
  UploadCloud,
  Search,
  Key,
  FileText,
  CreditCard,
  UserCheck,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Check,
  HardDrive,
  ExternalLink,
  Cpu,
} from "lucide-react";

export default function PrivateVaultPage() {
  const {
    isLocked,
    isConfigured,
    isBiometricsAvailable,
    recoveryKey,
    isLoading,
    items,
    autoLockMinutes,
    lockVault,
    setupPasscode,
    unlockWithPasscode,
    unlockWithBiometrics,
    performBiometricVerification,
    resetPasscodeWithBiometrics,
    resetPasscodeWithRecoveryKey,
    resetPrivateVault,
    addPrivateItem,
    updatePrivateItem,
    deleteItem,
  } = usePrivateVault();

  // Navigation & Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRecoveryKeyBanner, setShowRecoveryKeyBanner] = useState(false);

  // Dialog states
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DecryptedPrivateItem | null>(null);
  const [viewingItem, setViewingItem] = useState<DecryptedPrivateItem | null>(null);

  // Quick interactions
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  // Determine active category for new item creation
  const getPreselectedCategory = (): DecryptedPrivateItem["category"] => {
    switch (selectedCategory) {
      case "NOTE":
        return "note";
      case "CARD":
        return "card";
      case "IDENTITY":
        return "identity";
      case "PASSWORD":
      default:
        return "password";
    }
  };

  const handleOpenNewDialog = () => {
    setEditingItem(null);
    setItemDialogOpen(true);
  };

  const handleOpenEditDialog = (item: DecryptedPrivateItem) => {
    setViewingItem(null);
    setEditingItem(item);
    setItemDialogOpen(true);
  };

  const handleSaveItem = async (
    title: string,
    category: DecryptedPrivateItem["category"],
    data: Record<string, any>,
    id?: string
  ) => {
    if (id) {
      await updatePrivateItem(id, title, category, data);
    } else {
      await addPrivateItem(title, category, data);
    }
  };

  const handleCopy = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleReveal = (id: string) => {
    const next = new Set(revealedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setRevealedIds(next);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // RENDER LOCK SCREEN IF LOCKED
  if (isLocked) {
    return (
      <PrivateVaultLockScreen
        isConfigured={isConfigured}
        isBiometricsAvailable={isBiometricsAvailable}
        recoveryKey={recoveryKey}
        onUnlockPasscode={unlockWithPasscode}
        onUnlockBiometrics={unlockWithBiometrics}
        onSetupPasscode={setupPasscode}
        onVerifyBiometrics={performBiometricVerification}
        onResetWithBiometrics={resetPasscodeWithBiometrics}
        onResetWithRecoveryKey={resetPasscodeWithRecoveryKey}
        onEmergencyWipe={resetPrivateVault}
      />
    );
  }


  // FILTER ITEMS
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "ALL" || item.category.toUpperCase() === selectedCategory;
    const q = searchQuery.toLowerCase();
    const data = item.data || {};
    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      data.username?.toLowerCase()?.includes(q) ||
      data.cardholderName?.toLowerCase()?.includes(q) ||
      data.fullName?.toLowerCase()?.includes(q) ||
      data.apiKeyService?.toLowerCase()?.includes(q) ||
      data.notes?.toLowerCase()?.includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Security Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/20 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero-Knowledge Encrypted Folder
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                Offline IndexedDB
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Private Vault & Offline Storage
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl">
              Items in this vault are encrypted locally with AES-256-GCM. Decrypted records only exist in transient memory and lock automatically on inactivity or tab switch.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={lockVault}
              className="bg-slate-800/80 hover:bg-slate-700 text-white border-slate-700 gap-1.5 text-xs font-semibold rounded-xl"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Lock Now
            </Button>

            {recoveryKey && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRecoveryKeyBanner(!showRecoveryKeyBanner)}
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
                Export .msvault
              </Button>
            </ExportVaultDialog>

            <ImportVaultDialog>
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-800/80 hover:bg-slate-700 text-white border-slate-700 gap-1.5 text-xs font-semibold rounded-xl"
              >
                <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
                Restore Backup
              </Button>
            </ImportVaultDialog>

            <Button
              size="sm"
              onClick={handleOpenNewDialog}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              Add Private Item
            </Button>
          </div>
        </div>
      </div>

      {/* Emergency Recovery Key Banner */}
      {showRecoveryKeyBanner && recoveryKey && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg animate-in fade-in">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Emergency Recovery Key</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-mono">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Keep this 16-character key secure. You can use it to reset your passcode if forgotten.
              </p>
              <div className="font-mono text-sm font-bold text-emerald-400 tracking-wider mt-1 select-all">
                {recoveryKey}
              </div>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => handleCopy(recoveryKey, "recovery_key")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl gap-1.5 shrink-0"
          >
            {copiedId === "recovery_key" ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Key
              </>
            )}
          </Button>
        </div>
      )}


      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All Items", count: items.length },
            {
              id: "PASSWORD",
              label: "Passwords",
              count: items.filter((i) => i.category === "password").length,
            },
            {
              id: "NOTE",
              label: "Notes",
              count: items.filter((i) => i.category === "note").length,
            },
            {
              id: "CARD",
              label: "Cards",
              count: items.filter((i) => i.category === "card").length,
            },
            {
              id: "IDENTITY",
              label: "Identity",
              count: items.filter((i) => i.category === "identity").length,
            },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedCategory === cat.id
                    ? "bg-emerald-700 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search private items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl"
          />
        </div>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            {selectedCategory === "ALL"
              ? "Your Private Vault is Empty"
              : `No ${selectedCategory.toLowerCase()} found`}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Store highly confidential passwords, payment cards, recovery seeds, or identity documents locally with client-side AES-256-GCM encryption.
          </p>
          <Button
            onClick={handleOpenNewDialog}
            size="sm"
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add First {selectedCategory === "ALL" ? "Private Item" : selectedCategory.toLowerCase()}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isRevealed = revealedIds.has(item.id);
            const isCopied = copiedId === item.id;
            const data = item.data || {};
            const isSeed = item.category === "note" && data.noteSubtype === "CRYPTO_SEED";
            const isApiKey = item.category === "note" && data.noteSubtype === "API_KEY";

            return (
              <div
                key={item.id}
                onClick={() => setViewingItem(item)}
                className="group relative rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-3 cursor-pointer"
              >
                <div>
                  {/* Card Header with Icon & Category Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                        {item.category === "password" ? (
                          <Key className="w-4 h-4" />
                        ) : item.category === "card" ? (
                          <CreditCard className="w-4 h-4" />
                        ) : item.category === "identity" ? (
                          <UserCheck className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>
                      <div className="truncate">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                          {item.category === "card"
                            ? `${data.cardBrand || "Card"}`
                            : item.category === "note"
                            ? isSeed
                              ? "Crypto Seed"
                              : isApiKey
                              ? "API Key"
                              : "Secure Note"
                            : item.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(item.id);
                        }}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Category-Specific Visual Body Preview */}

                  {/* 1. PASSWORD CATEGORY PREVIEW */}
                  {item.category === "password" && (
                    <div className="space-y-1.5 pt-1">
                      {data.username && (
                        <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800/80">
                          <span className="text-[11px] text-slate-400">User:</span>
                          <span className="font-mono font-medium truncate max-w-[180px]">
                            {data.username}
                          </span>
                        </div>
                      )}

                      {data.password && (
                        <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800/80">
                          <span className="text-[11px] text-slate-400">Secret:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs">
                              {isRevealed ? data.password : "••••••••••••"}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleReveal(item.id);
                              }}
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                            >
                              {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      )}

                      {data.url && (
                        <div className="text-[11px] text-slate-400 truncate flex items-center gap-1 pt-0.5">
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{data.url.replace(/^https?:\/\//, "")}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. PAYMENT CARD CATEGORY PREVIEW */}
                  {item.category === "card" && (
                    <div className="space-y-2 pt-1">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-mono text-xs flex items-center justify-between border border-slate-700/60">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-amber-300 shrink-0" />
                          <span className="tracking-widest">
                            {isRevealed
                              ? data.cardNumber || "•••• •••• •••• ••••"
                              : data.cardNumber
                              ? `•••• •••• •••• ${data.cardNumber.slice(-4)}`
                              : "•••• •••• •••• ••••"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleReveal(item.id);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                        <span className="truncate max-w-[150px] uppercase font-semibold">
                          {data.cardholderName || "CARDHOLDER"}
                        </span>
                        <span>
                          {data.cardExpMonth && data.cardExpYear
                            ? `${data.cardExpMonth}/${data.cardExpYear}`
                            : "MM/YY"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 3. SECURE NOTE / SEED / API KEY PREVIEW */}
                  {item.category === "note" && (
                    <div className="pt-1">
                      {isSeed ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            <span>Crypto Mnemonic Seed</span>
                            <span className="font-mono">
                              {(data.seedPhraseRaw || "").trim().split(/\s+/).filter(Boolean).length} Words
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 font-mono text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                            {isRevealed
                              ? data.seedPhraseRaw
                              : "•••••••• •••••••• •••••••• •••••••• •••••••• ••••••••"}
                          </div>
                        </div>
                      ) : isApiKey ? (
                        <div className="space-y-1.5">
                          <div className="text-[11px] text-slate-400 flex items-center justify-between">
                            <span>Service: {data.apiKeyService || "API Key"}</span>
                            <span className="font-mono text-emerald-500">Active</span>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 font-mono text-xs text-slate-700 dark:text-slate-300 truncate">
                            {isRevealed ? data.apiSecretKey : "sk-••••••••••••••••••••••••"}
                          </div>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 font-mono text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                          {data.noteBody || data.notes || "Empty note"}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. DIGITAL IDENTITY PREVIEW */}
                  {item.category === "identity" && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs py-1 border-t border-slate-100 dark:border-slate-800/80">
                        <span className="text-[11px] text-slate-400">Name:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                          {data.fullName || "---"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs py-1 border-t border-slate-100 dark:border-slate-800/80">
                        <span className="text-[11px] text-slate-400">Number:</span>
                        <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                          {isRevealed ? data.idNumber : "••••••••••••"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer with Quick Copy Action */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-[10px] text-slate-400">
                    Updated {new Date(item.updatedAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1">
                    {/* Primary quick copy action depending on category */}
                    {item.category === "password" && data.password && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(data.password, item.id);
                        }}
                        className="h-7 px-2 text-[11px] font-semibold gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy Password
                          </>
                        )}
                      </Button>
                    )}

                    {item.category === "card" && data.cardNumber && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(data.cardNumber.replace(/\s/g, ""), item.id);
                        }}
                        className="h-7 px-2 text-[11px] font-semibold gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy Card
                          </>
                        )}
                      </Button>
                    )}

                    {item.category === "note" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(
                            data.seedPhraseRaw || data.apiSecretKey || data.noteBody || data.notes || "",
                            item.id
                          );
                        }}
                        className="h-7 px-2 text-[11px] font-semibold gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy Secret
                          </>
                        )}
                      </Button>
                    )}

                    {item.category === "identity" && data.idNumber && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(data.idNumber, item.id);
                        }}
                        className="h-7 px-2 text-[11px] font-semibold gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy ID
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dynamic Item Create / Edit Dialog */}
      <PrivateVaultItemDialog
        open={itemDialogOpen}
        onOpenChange={setItemDialogOpen}
        defaultCategory={getPreselectedCategory()}
        editItem={editingItem}
        onSave={handleSaveItem}
      />

      {/* Dynamic Item View Details Dialog */}
      <PrivateVaultItemViewDialog
        item={viewingItem}
        open={Boolean(viewingItem)}
        onOpenChange={(isOpen) => !isOpen && setViewingItem(null)}
        onEdit={handleOpenEditDialog}
        onDelete={deleteItem}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { usePrivateVault, DecryptedPrivateItem } from "@/features/vault/hooks/use-private-vault";
import { PrivateVaultLockScreen } from "@/features/vault/components/private-vault-lock-screen";
import { PrivateVaultHeader } from "@/features/vault/components/private-vault-header";
import { PrivateVaultCategoryFilter } from "@/features/vault/components/private-vault-category-filter";
import { PrivateVaultItemCard } from "@/features/vault/components/private-vault-item-card";
import { PrivateVaultEmptyState } from "@/features/vault/components/private-vault-empty-state";
import { PrivateVaultItemDialog } from "@/features/vault/components/private-vault-item-dialog";
import { PrivateVaultItemViewDialog } from "@/features/vault/components/private-vault-item-view-dialog";
import { Button } from "@/components/ui/button";
import { Key, Copy, Check, Plus } from "lucide-react";

export default function PrivateVaultPage() {
  const {
    isLocked,
    isConfigured,
    isBiometricsAvailable,
    recoveryKey,
    isLoading,
    isSyncing,
    items,
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
    syncWithCloud,
  } = usePrivateVault();

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRecoveryKeyBanner, setShowRecoveryKeyBanner] = useState(false);

  // Dialog states
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DecryptedPrivateItem | null>(null);
  const [viewingItem, setViewingItem] = useState<DecryptedPrivateItem | null>(null);

  // Interaction feedback states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

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

  // Render lock screen when locked
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

  // Filter items matching category and search text
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
      {/* Header Banner */}
      <PrivateVaultHeader
        isSyncing={isSyncing}
        recoveryKey={recoveryKey}
        showRecoveryKeyBanner={showRecoveryKeyBanner}
        onLockVault={lockVault}
        onToggleRecoveryKeyBanner={() => setShowRecoveryKeyBanner(!showRecoveryKeyBanner)}
        onSyncWithCloud={syncWithCloud}
        onImportComplete={syncWithCloud}
      />

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

      {/* Controls and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <PrivateVaultCategoryFilter
            items={items}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onSelectCategory={setSelectedCategory}
            onSearchChange={setSearchQuery}
          />
        </div>

        <Button
          size="sm"
          onClick={handleOpenNewDialog}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 shrink-0 self-end sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Private Item
        </Button>
      </div>

      {/* Item List / Empty State */}
      {filteredItems.length === 0 ? (
        <PrivateVaultEmptyState
          selectedCategory={selectedCategory}
          onAddNew={handleOpenNewDialog}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <PrivateVaultItemCard
              key={item.id}
              item={item}
              isRevealed={revealedIds.has(item.id)}
              isCopied={copiedId === item.id}
              onView={setViewingItem}
              onToggleReveal={toggleReveal}
              onCopy={handleCopy}
              onDelete={deleteItem}
            />
          ))}
        </div>
      )}

      {/* Creation / Edit Dialog */}
      <PrivateVaultItemDialog
        open={itemDialogOpen}
        onOpenChange={setItemDialogOpen}
        editItem={editingItem}
        defaultCategory={getPreselectedCategory()}
        onSave={handleSaveItem}
      />

      {/* Viewing Dialog */}
      <PrivateVaultItemViewDialog
        item={viewingItem}
        open={Boolean(viewingItem)}
        onOpenChange={(open) => {
          if (!open) setViewingItem(null);
        }}
        onEdit={handleOpenEditDialog}
        onDelete={deleteItem}
      />
    </div>
  );
}

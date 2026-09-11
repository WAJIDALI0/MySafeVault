"use client";

import { Lock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrivateVaultEmptyStateProps {
  selectedCategory: string;
  onAddNew: () => void;
}

export function PrivateVaultEmptyState({
  selectedCategory,
  onAddNew,
}: PrivateVaultEmptyStateProps) {
  return (
    <div className="text-center py-16 px-4 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30">
      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
        <Lock className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-white">
        {selectedCategory === "ALL"
          ? "Your Private Vault is Empty"
          : `No ${selectedCategory.toLowerCase()} found`}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
        Store confidential passwords, payment cards, recovery seeds, or identity documents with end-to-end zero-knowledge encryption that automatically synchronizes between all your devices.
      </p>
      <Button
        onClick={onAddNew}
        size="sm"
        className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl gap-1.5 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add First {selectedCategory === "ALL" ? "Private Item" : selectedCategory.toLowerCase()}
      </Button>
    </div>
  );
}

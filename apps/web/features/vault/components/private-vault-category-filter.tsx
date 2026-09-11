"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DecryptedPrivateItem } from "../types/private-vault.types";

interface PrivateVaultCategoryFilterProps {
  items: DecryptedPrivateItem[];
  selectedCategory: string;
  searchQuery: string;
  onSelectCategory: (category: string) => void;
  onSearchChange: (query: string) => void;
}

export function PrivateVaultCategoryFilter({
  items,
  selectedCategory,
  searchQuery,
  onSelectCategory,
  onSearchChange,
}: PrivateVaultCategoryFilterProps) {
  const categories = [
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
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === cat.id
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300"
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
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
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl"
        />
      </div>
    </div>
  );
}

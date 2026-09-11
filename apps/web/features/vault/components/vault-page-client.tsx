"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Shield, Plus, Search, Star, ArrowUpDown, Filter, Download, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VaultItemsGrid } from "@/features/vault/components/vault-items-grid";
import { AddVaultItemDialog } from "@/features/vault/components/add-vault-item-dialog";
import { ExportVaultDialog } from "./export-vault-dialog";
import { ImportVaultDialog } from "./import-vault-dialog";
import { getCategoryStyle } from "@/lib/utils/category-styles";

interface VaultPageClientProps {
  initialItems: any[];
}

export function VaultPageClient({ initialItems }: VaultPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category");
  const actionParam = searchParams.get("action");
  const typeParam = searchParams.get("type");
  
  const [currentCategory, setCurrentCategory] = useState(categoryParam || "ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const [optimisticFavorites, setOptimisticFavorites] = useState<Record<string, boolean>>({});
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const isValidCategory = categoryParam && categoryParam !== "ALL" && categoryParam !== "FAVORITES";
  const [addType, setAddType] = useState(isValidCategory ? categoryParam : "PASSWORD");

  // Sync state if URL changes
  useEffect(() => {
    setCurrentCategory(categoryParam || "ALL");
    
    if (actionParam === "new") {
      setIsAddOpen(true);
      if (typeParam) {
        setAddType(typeParam);
      }
      
      // Remove query params to avoid re-triggering on reload
      const url = new URL(window.location.href);
      url.searchParams.delete("action");
      url.searchParams.delete("type");
      window.history.replaceState({}, '', url.toString());
    }
  }, [categoryParam, actionParam, typeParam]);

  const handleCategoryChange = (catId: string) => {
    setCurrentCategory(catId);
    if (catId === "ALL") {
      router.push("/vault");
    } else {
      router.push(`/vault?category=${catId}`);
    }
  };

  const categories = [
    { label: "All Items", icon: Shield, id: "ALL" },
    { label: getCategoryStyle('PASSWORD').label + "s", icon: getCategoryStyle('PASSWORD').icon, id: "PASSWORD" },
    { label: getCategoryStyle('DOCUMENT').label + "s", icon: getCategoryStyle('DOCUMENT').icon, id: "DOCUMENT" },
    { label: getCategoryStyle('SECURE_NOTE').label + "s", icon: getCategoryStyle('SECURE_NOTE').icon, id: "SECURE_NOTE" },
    { label: getCategoryStyle('IDENTITY').label, icon: getCategoryStyle('IDENTITY').icon, id: "IDENTITY" },
    { label: getCategoryStyle('RECEIPT').label + "s", icon: getCategoryStyle('RECEIPT').icon, id: "RECEIPT" },
    { label: getCategoryStyle('WARRANTY').label, icon: getCategoryStyle('WARRANTY').icon, id: "WARRANTY" },
    { label: "Favorites", icon: getCategoryStyle('FAVORITE').icon, id: "FAVORITES" },
  ];

  // Filter & sort items
  const filteredItems = initialItems
    .filter((item) => {
      // 1. Filter by Category
      const isFav = optimisticFavorites[item.id] ?? item.is_favorite;
      if (currentCategory === "FAVORITES" && !isFav) return false;
      if (currentCategory !== "ALL" && currentCategory !== "FAVORITES" && item.type !== currentCategory) return false;
      
      // 2. Filter by Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) || 
          (item.description && item.description.toLowerCase().includes(q))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      // default: newest
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="space-y-6">
      {/* Header & Controls Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white tracking-tight">Your Vault</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} securely encrypted & protected.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search vault..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white dark:bg-[#0b1120] border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus-visible:ring-[#10b981] rounded-xl shadow-2xs"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 px-3 pr-8 rounded-xl bg-white dark:bg-[#0b1120] border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 appearance-none cursor-pointer shadow-2xs"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="title">Sort by: Title (A-Z)</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Export & Import Buttons */}
          <ExportVaultDialog>
            <Button
              variant="outline"
              className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b1120] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs h-9 px-3 shrink-0 shadow-2xs gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </ExportVaultDialog>

          <ImportVaultDialog>
            <Button
              variant="outline"
              className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b1120] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs h-9 px-3 shrink-0 shadow-2xs gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">Restore</span>
            </Button>
          </ImportVaultDialog>

          {/* Add Item Button */}
          <AddVaultItemDialog 
            open={isAddOpen} 
            onOpenChange={setIsAddOpen} 
            defaultType={addType as any}
          >
            <Button 
              onClick={() => { setIsAddOpen(true); setAddType((currentCategory && currentCategory !== "ALL" && currentCategory !== "FAVORITES") ? currentCategory : "PASSWORD"); }} 
              className="bg-[#10b981] hover:bg-[#059669] text-white shadow-xs rounded-xl font-semibold text-xs h-9 px-4 shrink-0 transition-all hover:shadow-md hover:shadow-[#10b981]/20 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add Item
            </Button>
          </AddVaultItemDialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-56 shrink-0 space-y-1">
          {categories.map((cat) => {
            const isActive = currentCategory === cat.id;
            return (
              <button 
                key={cat.id} 
                onClick={() => handleCategoryChange(cat.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive 
                  ? "bg-[#10b981]/10 text-[#10b981] font-medium" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#111827] hover:text-slate-900 dark:hover:text-white font-medium"
                }`}
              >
                <cat.icon className={`w-4 h-4 ${isActive ? "text-[#10b981]" : "text-slate-400 dark:text-slate-500"}`} />
                {cat.label}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          {filteredItems.length === 0 ? (
            <div className="bg-white dark:bg-[#0b1120] border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl p-8 flex flex-col items-center justify-center text-center h-[460px]">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-[#10b981]" />
              </div>
              <h3 className="text-lg font-bold font-outfit text-slate-900 dark:text-white mb-2">No items found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
                {searchQuery 
                  ? `No items match "${searchQuery}" in ${categories.find(c => c.id === currentCategory)?.label.toLowerCase()}. Try another keyword.`
                  : "This section of your vault is currently empty. Securely store your credentials, documents, or keys here."}
              </p>
              {!searchQuery && (
                <AddVaultItemDialog 
                  open={isAddOpen} 
                  onOpenChange={setIsAddOpen} 
                  defaultType={addType as any}
                >
                  <Button 
                    onClick={() => { setIsAddOpen(true); setAddType((currentCategory && currentCategory !== "ALL" && currentCategory !== "FAVORITES") ? currentCategory : "PASSWORD"); }} 
                    className="bg-[#10b981] hover:bg-[#059669] text-white rounded-xl shadow-xs px-5 font-semibold text-xs h-10 transition-all hover:shadow-md hover:shadow-[#10b981]/20 active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add your first item
                  </Button>
                </AddVaultItemDialog>
              )}
            </div>
          ) : (
            <VaultItemsGrid 
              items={filteredItems} 
              optimisticFavorites={optimisticFavorites} 
              setOptimisticFavorites={setOptimisticFavorites} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

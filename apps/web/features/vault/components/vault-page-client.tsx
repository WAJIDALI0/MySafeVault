"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Shield, Plus, Search, Star, KeyRound, FileText, FileLock2, Fingerprint, Receipt, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VaultItemsGrid } from "@/features/vault/components/vault-items-grid";
import { AddVaultItemDialog } from "@/features/vault/components/add-vault-item-dialog";

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
    { label: "Passwords", icon: KeyRound, id: "PASSWORD" },
    { label: "Documents", icon: FileText, id: "DOCUMENT" },
    { label: "Secure Notes", icon: FileLock2, id: "SECURE_NOTE" },
    { label: "Identity", icon: Fingerprint, id: "IDENTITY" },
    { label: "Receipts", icon: Receipt, id: "RECEIPT" },
    { label: "Warranties", icon: ShieldCheck, id: "WARRANTY" },
    { label: "Favorites", icon: Star, id: "FAVORITES" },
  ];

  // Filter items instantly on the client side
  const filteredItems = initialItems.filter((item) => {
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
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-white tracking-tight">Your Vault</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your securely encrypted items.</p>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="Search vault..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#0b1120] border-slate-800 text-sm focus-visible:ring-[#10b981]"
            />
          </div>
          <AddVaultItemDialog 
            open={isAddOpen} 
            onOpenChange={setIsAddOpen} 
            defaultType={addType as any}
          >
            <Button onClick={() => { setIsAddOpen(true); setAddType((currentCategory && currentCategory !== "ALL" && currentCategory !== "FAVORITES") ? currentCategory : "PASSWORD"); }} className="bg-[#10b981] hover:bg-[#059669] text-white shrink-0">
              <Plus className="w-4 h-4 mr-2" /> Add Item
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
                  : "text-slate-400 hover:bg-[#111827] hover:text-white font-medium"
                }`}
              >
                <cat.icon className={`w-4 h-4 ${isActive ? "text-[#10b981]" : "text-slate-500"}`} />
                {cat.label}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          {filteredItems.length === 0 ? (
            <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center h-[500px]">
              <div className="w-16 h-16 bg-[#111827] rounded-2xl border border-slate-800 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No items found</h3>
              <p className="text-slate-400 text-sm max-w-sm mb-6">
                {searchQuery 
                  ? `No items match "${searchQuery}" in ${categories.find(c => c.id === currentCategory)?.label.toLowerCase()}.`
                  : "You haven't added any items to this category yet."}
              </p>
              {!searchQuery && (
                <AddVaultItemDialog 
                  open={isAddOpen} 
                  onOpenChange={setIsAddOpen} 
                  defaultType={addType as any}
                >
                  <Button onClick={() => { setIsAddOpen(true); setAddType((currentCategory && currentCategory !== "ALL" && currentCategory !== "FAVORITES") ? currentCategory : "PASSWORD"); }} className="bg-[#10b981] hover:bg-[#059669] text-white">
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

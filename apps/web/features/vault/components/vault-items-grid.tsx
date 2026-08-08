"use client";

import { useState, useTransition } from "react";
import { KeyRound, FileText, Shield, Star, Loader2 } from "lucide-react";
import { ViewVaultItemDialog } from "./view-vault-item-dialog";
import { toggleFavorite } from "../actions/vault.actions";

interface VaultItemsGridProps {
  items: any[];
  optimisticFavorites: Record<string, boolean>;
  setOptimisticFavorites: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export function VaultItemsGrid({ items, optimisticFavorites, setOptimisticFavorites }: VaultItemsGridProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const selectedItem = items.find(i => i.id === selectedItemId);

  const handleFavoriteToggle = (e: React.MouseEvent, id: string, currentStatus: boolean) => {
    e.stopPropagation();
    const isFav = optimisticFavorites[id] ?? currentStatus;
    const nextStatus = !isFav;
    
    // Instantly update UI
    setOptimisticFavorites(prev => ({ ...prev, [id]: nextStatus }));
    
    startTransition(async () => {
      await toggleFavorite(id, nextStatus);
    });
  };

  const handleItemClick = (item: any) => {
    setSelectedItemId(item.id);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            onClick={() => handleItemClick(item)}
            className="bg-[#0b1120] border border-slate-800 rounded-xl p-4 hover:border-slate-700 hover:bg-[#111827] transition-all cursor-pointer flex flex-col group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#111827] group-hover:bg-[#0b1120] transition-colors rounded-lg border border-slate-800">
                  {item.type === 'PASSWORD' ? <KeyRound className="w-5 h-5 text-purple-500" /> :
                   item.type === 'DOCUMENT' ? <FileText className="w-5 h-5 text-blue-500" /> :
                   <Shield className="w-5 h-5 text-slate-400" />}
                </div>
                <div>
                  <h4 className="font-medium text-white">{item.title}</h4>
                  <p className="text-xs text-slate-500 capitalize">{item.type.toLowerCase()}</p>
                </div>
              </div>
              <button 
                onClick={(e) => handleFavoriteToggle(e, item.id, item.is_favorite)}
                disabled={isPending}
                className="p-1.5 rounded-md hover:bg-slate-800 transition-colors"
              >
                <Star className={`w-4 h-4 transition-colors ${(optimisticFavorites[item.id] ?? item.is_favorite) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600 hover:text-yellow-400'}`} />
              </button>
            </div>
            <div className="mt-auto text-[11px] text-slate-500">
              Updated {new Date(item.updated_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <ViewVaultItemDialog 
          itemId={selectedItem.id}
          itemTitle={selectedItem.title}
          itemType={selectedItem.type}
          itemIsFavorite={optimisticFavorites[selectedItem.id] ?? selectedItem.is_favorite}
          itemDescription={selectedItem.description || ""}
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setTimeout(() => setSelectedItemId(null), 300); // clear after animation
          }}
        />
      )}
    </>
  );
}

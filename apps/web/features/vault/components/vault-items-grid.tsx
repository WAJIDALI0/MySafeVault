"use client";

import { useState, useTransition } from "react";
import { KeyRound, FileText, Shield, Star, Loader2, MoreHorizontal } from "lucide-react";
import { ViewVaultItemDialog } from "./view-vault-item-dialog";
import { toggleFavorite } from "../actions/vault.actions";
import { getCategoryStyle } from "@/lib/utils/category-styles";

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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {items.map((item) => {
          const categoryStyle = getCategoryStyle(item.type);
          const StyleIcon = categoryStyle.icon;
          const isFav = optimisticFavorites[item.id] ?? item.is_favorite;

          return (
            <div 
              key={item.id} 
              onClick={() => handleItemClick(item)}
              className="relative overflow-hidden bg-gradient-to-b from-white via-white to-slate-50/60 dark:from-[#0b1120] dark:via-[#0b1120] dark:to-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 hover:border-emerald-300 dark:hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="flex justify-between items-start mb-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl ${categoryStyle.bgColor} flex items-center justify-center border border-slate-100 dark:border-slate-800/80 ring-1 ring-black/5 group-hover:scale-110 group-hover:shadow-sm transition-all duration-200 shrink-0`}>
                      <StyleIcon className={`w-5 h-5 ${categoryStyle.textColor}`} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-700 dark:group-hover:bg-emerald-950/40 dark:group-hover:text-emerald-400 transition-colors">
                          {item.type.toLowerCase().replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={(e) => handleFavoriteToggle(e, item.id, item.is_favorite)}
                      className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${isFav ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}
                      title={isFav ? "Remove favorite" : "Add to favorites"}
                    >
                      <Star className={`w-4 h-4 transition-colors ${isFav ? 'text-amber-400 fill-amber-400 drop-shadow-xs' : 'text-slate-400 dark:text-slate-500 hover:text-amber-400'}`} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleItemClick(item); }}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      title="View / Edit"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {item.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                <span>Updated {new Date(item.updated_at).toLocaleDateString()}</span>
                <span className="text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all font-bold flex items-center gap-1 group-hover:translate-x-0.5">
                  Decrypt & view →
                </span>
              </div>
            </div>
          );
        })}
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

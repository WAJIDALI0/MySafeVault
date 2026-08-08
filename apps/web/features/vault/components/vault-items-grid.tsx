"use client";

import { useState } from "react";
import { KeyRound, FileText, Shield, Star } from "lucide-react";
import { ViewVaultItemDialog } from "./view-vault-item-dialog";

interface VaultItemsGridProps {
  items: any[];
}

export function VaultItemsGrid({ items }: VaultItemsGridProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemTitle, setSelectedItemTitle] = useState("");
  const [selectedItemType, setSelectedItemType] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleItemClick = (item: any) => {
    setSelectedItemId(item.id);
    setSelectedItemTitle(item.title);
    setSelectedItemType(item.type);
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
              {item.is_favorite && <Star className="w-4 h-4 text-rose-500 fill-rose-500/20" />}
            </div>
            <div className="mt-auto text-[11px] text-slate-500">
              Updated {new Date(item.updated_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      <ViewVaultItemDialog 
        itemId={selectedItemId!}
        itemTitle={selectedItemTitle}
        itemType={selectedItemType}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}

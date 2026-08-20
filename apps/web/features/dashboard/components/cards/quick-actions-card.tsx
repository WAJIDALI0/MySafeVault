"use client";

import { ArrowRight } from "lucide-react";
import { AddVaultItemDialog } from "../../../vault/components/add-vault-item-dialog";
import { VaultItemType } from "@prisma/client";
import { getCategoryStyle } from "@/lib/utils/category-styles";
import Link from "next/link";

const actionTypes: VaultItemType[] = ["PASSWORD", "DOCUMENT", "SECURE_NOTE", "IDENTITY", "RECEIPT", "WARRANTY"];

export function QuickActionsCard() {
  return (
    <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-6 h-full flex flex-col justify-between">
      <h3 className="font-medium text-white mb-6">Quick Actions</h3>
      
      <div className="grid grid-cols-3 gap-3 mb-4">
        {actionTypes.map((type, i) => {
          const style = getCategoryStyle(type);
          const StyleIcon = style.icon;
          return (
            <AddVaultItemDialog key={i} defaultType={type}>
              <button className="flex flex-col items-center justify-center py-4 px-2 bg-[#111827] border border-slate-800/50 rounded-xl hover:border-slate-700 hover:bg-slate-800/50 hover:-translate-y-0.5 transition-all group">
                <div className={`p-2.5 rounded-xl ${style.bgColor} border border-transparent group-hover:border-slate-700/50 mb-3 group-hover:scale-110 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.05)] transition-all`}>
                  <StyleIcon className={`w-4 h-4 ${style.textColor}`} />
                </div>
                <span className="text-[10px] font-medium text-slate-300 text-center leading-tight">
                  Add {style.label}
                </span>
              </button>
            </AddVaultItemDialog>
          );
        })}
      </div>

      <Link href="/vault" className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#10b981] hover:text-white bg-[#10b981]/5 hover:bg-[#10b981]/10 border border-[#10b981]/20 py-2.5 rounded-lg transition-colors mt-auto">
        View All Actions <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

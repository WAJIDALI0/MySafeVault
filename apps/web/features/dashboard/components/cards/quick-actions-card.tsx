"use client";

import { KeyRound, FileText, StickyNote, Fingerprint, Receipt, ShieldCheck, ArrowRight } from "lucide-react";
import { AddVaultItemDialog } from "../../../vault/components/add-vault-item-dialog";
import { VaultItemType } from "@prisma/client";
import Link from "next/link";

const actions = [
  { label: "Add Password", icon: KeyRound, color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/10", border: "border-[#8b5cf6]/20", type: "PASSWORD" as VaultItemType },
  { label: "Add Document", icon: FileText, color: "text-[#3b82f6]", bg: "bg-[#3b82f6]/10", border: "border-[#3b82f6]/20", type: "DOCUMENT" as VaultItemType },
  { label: "Add Secure Note", icon: StickyNote, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10", border: "border-[#f59e0b]/20", type: "SECURE_NOTE" as VaultItemType },
  { label: "Add ID / Card", icon: Fingerprint, color: "text-[#10b981]", bg: "bg-[#10b981]/10", border: "border-[#10b981]/20", type: "IDENTITY" as VaultItemType },
  { label: "Add Receipt", icon: Receipt, color: "text-[#ef4444]", bg: "bg-[#ef4444]/10", border: "border-[#ef4444]/20", type: "RECEIPT" as VaultItemType },
  { label: "Add Warranty", icon: ShieldCheck, color: "text-[#6366f1]", bg: "bg-[#6366f1]/10", border: "border-[#6366f1]/20", type: "WARRANTY" as VaultItemType },
];

export function QuickActionsCard() {
  return (
    <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-6 h-full flex flex-col justify-between">
      <h3 className="font-medium text-white mb-6">Quick Actions</h3>
      
      <div className="grid grid-cols-3 gap-3 mb-4">
        {actions.map((action, i) => (
          <AddVaultItemDialog key={i} defaultType={action.type}>
            <button className="flex flex-col items-center justify-center py-4 px-2 bg-[#111827] border border-slate-800/50 rounded-xl hover:border-slate-700 transition-colors group">
              <div className={`p-2.5 rounded-xl ${action.bg} ${action.color} ${action.border} border mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium text-slate-300 text-center leading-tight">
                {action.label}
              </span>
            </button>
          </AddVaultItemDialog>
        ))}
      </div>

      <Link href="/vault" className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#10b981] hover:text-white bg-[#10b981]/5 hover:bg-[#10b981]/10 border border-[#10b981]/20 py-2.5 rounded-lg transition-colors mt-auto">
        View All Actions <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

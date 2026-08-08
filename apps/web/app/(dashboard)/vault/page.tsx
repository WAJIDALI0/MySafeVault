import { Shield, Plus, Search, Star, KeyRound, FileText, FileLock2, Fingerprint, Receipt, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";
import { VaultItemsGrid } from "@/features/vault/components/vault-items-grid";

export default async function VaultPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let items: any[] = [];
  if (user) {
    items = await prisma.vaultItem.findMany({
      where: { profile_id: user.id },
      orderBy: { updated_at: 'desc' },
    });
  }

  const categories = [
    { label: "All Items", icon: Shield, active: true },
    { label: "Passwords", icon: KeyRound },
    { label: "Documents", icon: FileText },
    { label: "Secure Notes", icon: FileLock2 },
    { label: "Identity", icon: Fingerprint },
    { label: "Receipts", icon: Receipt },
    { label: "Warranties", icon: ShieldCheck },
    { label: "Favorites", icon: Star },
  ];

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
              className="pl-9 bg-[#0b1120] border-slate-800 text-sm focus-visible:ring-[#10b981]"
            />
          </div>
          <Button className="bg-[#10b981] hover:bg-[#059669] text-white shrink-0">
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-56 shrink-0 space-y-1">
          {categories.map((cat, i) => (
            <button 
              key={i} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                cat.active 
                ? "bg-[#10b981]/10 text-[#10b981] font-medium" 
                : "text-slate-400 hover:bg-[#111827] hover:text-white font-medium"
              }`}
            >
              <cat.icon className={`w-4 h-4 ${cat.active ? "text-[#10b981]" : "text-slate-500"}`} />
              {cat.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          {items.length === 0 ? (
            <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center h-[500px]">
              <div className="w-16 h-16 bg-[#111827] rounded-2xl border border-slate-800 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No items found</h3>
              <p className="text-slate-400 text-sm max-w-sm mb-6">
                You haven't added any items to your vault yet. Start adding passwords, documents, or secure notes.
              </p>
              <Button className="bg-[#10b981] hover:bg-[#059669] text-white">
                <Plus className="w-4 h-4 mr-2" /> Add your first item
              </Button>
            </div>
          ) : (
            <VaultItemsGrid items={items} />
          )}
        </div>
      </div>
    </div>
  );
}

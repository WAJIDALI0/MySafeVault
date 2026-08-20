import { Calendar, CreditCard, Shield, Plus, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma/client";
import Link from "next/link";

export async function UpcomingExpirationsCard({ userId }: { userId: string }) {
  let upcomingItems: any[] = [];
  
  if (userId) {
    // Fetch all items and parse metadata to find expirations
    // (In Postgres 12+ we could query jsonb directly, but we use a simple findMany and filter for safety right now)
    let itemsWithMeta: any[] = [];
    try {
      itemsWithMeta = await prisma.vaultItem.findMany({
        where: { profile_id: userId, type: { in: ['DOCUMENT', 'IDENTITY'] } },
        select: { id: true, title: true, type: true, metadata: true }
      });
    } catch (e: any) {
      console.error("UpcomingExpirationsCard Prisma Error:", e.message || e);
    }
    
    const withExpirations = itemsWithMeta
      .filter(i => {
        const meta = i.metadata as any;
        return meta && meta.expiresAt;
      })
      .map(i => {
        const meta = i.metadata as any;
        const expiresAt = new Date(meta.expiresAt);
        const days = Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
        return {
          id: i.id,
          title: i.title,
          type: i.type,
          expiresAt,
          days
        };
      })
      .filter(i => i.days > 0) // Only future expirations
      .sort((a, b) => a.days - b.days)
      .slice(0, 3);
      
    upcomingItems = withExpirations;
  }

  return (
    <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-medium">Upcoming Expirations</h3>
        <Link href="/vault" className="text-sm text-slate-400 hover:text-white transition-colors">View all</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-1">
        
        {upcomingItems.length === 0 ? (
          <div className="col-span-1 sm:col-span-2 md:col-span-4 flex flex-col items-center justify-center p-8 bg-[#111827]/50 rounded-xl border border-slate-800/50">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-base font-medium text-white mb-1">All clear!</p>
            <p className="text-sm text-slate-400 mb-5 text-center">You don't have any vault items expiring soon.</p>
            <Link 
              href="/vault?action=new" 
              className="inline-flex items-center justify-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Item
            </Link>
          </div>
        ) : (
          upcomingItems.map((item, index) => (
            <div key={item.id} className="bg-[#111827] rounded-lg p-4 border border-slate-800/50 flex flex-col justify-between group hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded flex items-center justify-center ${index === 0 ? 'bg-[#10b981]/10 text-[#10b981]' : index === 1 ? 'bg-[#f59e0b]/10 text-[#f59e0b]' : 'bg-[#8b5cf6]/10 text-[#8b5cf6]'}`}>
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200 truncate w-[100px]" title={item.title}>{item.title}</p>
                  <p className="text-xs text-slate-500">Expires in</p>
                </div>
              </div>
              <div>
                <p className={`text-xl font-bold mb-1 ${item.days <= 7 ? 'text-red-400' : 'text-white'}`}>{item.days} days</p>
                <p className="text-xs text-slate-500">{item.expiresAt.toLocaleDateString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

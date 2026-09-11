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
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-white to-slate-50/70 dark:from-[#0b1120] dark:via-[#0b1120] dark:to-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xs rounded-2xl p-6 h-full flex flex-col hover:shadow-xl hover:shadow-emerald-500/5 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
      {/* Top subtle accent line */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-amber-500/40 via-emerald-400/40 to-teal-500/40 opacity-80" />

      <div className="flex items-center justify-between mb-5 relative z-10">
        <div>
          <h3 className="text-slate-900 dark:text-white font-bold text-base sm:text-lg">Upcoming Expirations</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">Timely cryptographic alerts for expiring credentials & IDs</p>
        </div>
        <Link 
          href="/vault" 
          className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 group/link transition-all"
        >
          <span>View all</span>
          <span className="group-hover/link:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-1 relative z-10">
        
        {upcomingItems.length === 0 ? (
          <div className="col-span-1 sm:col-span-2 md:col-span-4 flex flex-col items-center justify-center p-6 bg-white/60 dark:bg-[#111827]/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
            <div className="w-11 h-11 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-[#10b981]" />
            </div>
            <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1">All clear & up to date!</p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-3.5 text-center">No documents, warranties, or certificates are expiring soon.</p>
            <Link 
              href="/vault?action=new" 
              className="inline-flex items-center justify-center px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 rounded-xl shadow-xs transition-all"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add Document
            </Link>
          </div>
        ) : (
          upcomingItems.map((item, index) => (
            <div key={item.id} className="bg-white/80 dark:bg-[#111827]/80 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between group hover:border-emerald-300 dark:hover:border-emerald-500/40 hover:shadow-sm transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${index === 0 ? 'bg-emerald-500/10 text-[#10b981]' : index === 1 ? 'bg-amber-500/10 text-amber-600' : 'bg-purple-500/10 text-purple-600'}`}>
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate" title={item.title}>{item.title}</p>
                  <p className="text-xs text-slate-400 font-medium">Expires in</p>
                </div>
              </div>
              <div>
                <p className={`text-xl sm:text-2xl font-black font-outfit mb-0.5 ${item.days <= 7 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>{item.days} days</p>
                <p className="text-xs text-slate-400 font-medium">{item.expiresAt.toLocaleDateString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

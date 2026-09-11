import { prisma } from "@/lib/prisma/client";
import Link from "next/link";
import { HardDrive, ArrowRight, ShieldCheck } from "lucide-react";

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export async function StorageCard({ userId }: { userId: string }) {
  let items: any[] = [];
  try {
    items = await prisma.vaultItem.findMany({
      where: { profile_id: userId },
      select: { type: true, encrypted_data: true }
    });
  } catch (e: any) {
    console.error("StorageCard Prisma Error:", e.message || e);
  }

  const categories = { Documents: 0, Images: 0, Notes: 0, Passwords: 0, Other: 0 };
  let totalBytes = 0;

  items.forEach(item => {
    const bytes = item.encrypted_data ? Buffer.byteLength(item.encrypted_data, 'utf8') : 0;
    totalBytes += bytes;
    
    switch(item.type) {
      case 'DOCUMENT': categories.Documents += bytes; break;
      case 'SECURE_NOTE': categories.Notes += bytes; break;
      case 'PASSWORD': categories.Passwords += bytes; break;
      case 'IDENTITY': categories.Other += bytes; break;
      default: categories.Other += bytes;
    }
  });
  
  const maxStorage = 100 * 1024 * 1024 * 1024; // 100 GB
  const usedPercentage = totalBytes > 0 ? ((totalBytes / maxStorage) * 100).toFixed(1) : "0.0";
  const displayTotal = formatBytes(totalBytes);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-white to-slate-50/70 dark:from-[#0b1120] dark:via-[#0b1120] dark:to-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 h-full flex flex-col justify-between shadow-xs hover:shadow-xl hover:shadow-emerald-500/5 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 group">
      {/* Top subtle accent line */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 opacity-85" />

      {/* Ambient glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-emerald-500 blur-3xl opacity-10 dark:opacity-20 pointer-events-none" />

      <div>
        {/* Header matching Row 3 style */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20 shrink-0 group-hover:scale-105 transition-transform">
              <HardDrive className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg truncate">
                Storage Usage
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                Quota allocation & volume
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200/70 dark:border-emerald-800/50 shrink-0 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            100 GB Plan
          </span>
        </div>
        
        {/* Center Donut and Stats Gauge */}
        <div className="flex items-center gap-4 sm:gap-5 my-3 p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 relative z-10">
          {/* Responsive Donut Gauge */}
          <div className="relative w-20 h-20 sm:w-22 sm:h-22 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_2px_8px_rgba(16,185,129,0.2)]" viewBox="0 0 112 112">
              <circle 
                cx="56" 
                cy="56" 
                r="44" 
                fill="none" 
                stroke="currentColor" 
                className="text-slate-100 dark:text-slate-800/80" 
                strokeWidth="10" 
              />
              <circle 
                cx="56" 
                cy="56" 
                r="44" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="10" 
                strokeDasharray={276.5} 
                strokeDashoffset={276.5 * (1 - Math.min(1, Math.max(Number(usedPercentage) / 100, 0.005)))} 
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out" 
              />
            </svg>
            <div className="text-center absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-outfit leading-none">
                {usedPercentage}%
              </span>
              <span className="text-[8px] sm:text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                Used
              </span>
            </div>
          </div>
          
          {/* Total Metric & Adaptive Fluid Quota Bar */}
          <div className="flex-1 min-w-0">
            <div className="text-2xl sm:text-3xl font-black font-outfit text-slate-900 dark:text-white leading-tight tracking-tight truncate">
              {displayTotal}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
              of 100 GB allocated
            </div>
            
            {/* Fluid responsive progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex shadow-inner mt-2.5">
              <div 
                style={{ width: `${Math.min(100, Math.max(Number(usedPercentage), 1))}%` }} 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" 
              />
            </div>
          </div>
        </div>

        {/* Breakdown Grid: 2 Columns, fully fluid, responsive labels */}
        <div className="grid grid-cols-2 gap-2 my-3 relative z-10">
          <div className="px-2.5 py-2 rounded-xl bg-slate-50/80 dark:bg-[#111827]/40 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
              <div className="w-2 h-2 rounded-full bg-[#10b981] shrink-0" />
              <span className="truncate">Docs</span>
            </div>
            <span className="text-[11px] sm:text-xs text-slate-900 dark:text-white font-bold font-mono shrink-0 ml-1">
              {formatBytes(categories.Documents)}
            </span>
          </div>

          <div className="px-2.5 py-2 rounded-xl bg-slate-50/80 dark:bg-[#111827]/40 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
              <div className="w-2 h-2 rounded-full bg-[#8b5cf6] shrink-0" />
              <span className="truncate">Images</span>
            </div>
            <span className="text-[11px] sm:text-xs text-slate-900 dark:text-white font-bold font-mono shrink-0 ml-1">
              {formatBytes(categories.Images)}
            </span>
          </div>

          <div className="px-2.5 py-2 rounded-xl bg-slate-50/80 dark:bg-[#111827]/40 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
              <div className="w-2 h-2 rounded-full bg-[#f59e0b] shrink-0" />
              <span className="truncate">Notes</span>
            </div>
            <span className="text-[11px] sm:text-xs text-slate-900 dark:text-white font-bold font-mono shrink-0 ml-1">
              {formatBytes(categories.Notes)}
            </span>
          </div>

          <div className="px-2.5 py-2 rounded-xl bg-slate-50/80 dark:bg-[#111827]/40 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
              <div className="w-2 h-2 rounded-full bg-[#3b82f6] shrink-0" />
              <span className="truncate">Keys</span>
            </div>
            <span className="text-[11px] sm:text-xs text-slate-900 dark:text-white font-bold font-mono shrink-0 ml-1">
              {formatBytes(categories.Passwords + categories.Other)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button: Perfect visual alignment with Card 2 and Card 3 */}
      <Link 
        href="/settings/storage" 
        className="relative z-10 w-full flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 border border-emerald-500/30 py-2.5 rounded-xl shadow-xs transition-all hover:shadow-md hover:shadow-emerald-500/10 active:scale-[0.99] group/btn mt-2"
      >
        <span>Manage Storage & Quotas</span>
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

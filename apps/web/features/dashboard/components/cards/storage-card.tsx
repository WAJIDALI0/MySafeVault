// Cache bust: 1
import { prisma } from "@/lib/prisma/client";
import Link from "next/link";

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export async function StorageCard({ userId }: { userId: string }) {
  const items = await prisma.vaultItem.findMany({
    where: { profile_id: userId },
    select: { type: true, encrypted_data: true }
  });

  const categories = { Documents: 0, Images: 0, Notes: 0, Passwords: 0, Other: 0 };
  let totalBytes = 0;

  items.forEach(item => {
    const bytes = Buffer.byteLength(item.encrypted_data, 'utf8');
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
  const usedPercentage = totalBytes > 0 ? ((totalBytes / maxStorage) * 100).toFixed(1) : "0";
  const displayTotal = formatBytes(totalBytes);

  const docsPct = totalBytes > 0 ? categories.Documents / totalBytes : 0;
  const imgPct = totalBytes > 0 ? categories.Images / totalBytes : 0;
  const otherPct = totalBytes > 0 ? categories.Other / totalBytes : 0;
  const notesPassPct = totalBytes > 0 ? (categories.Notes + categories.Passwords) / totalBytes : 0;

  const circumference = 251.2;
  
  const docsOffset = circumference - (docsPct * circumference);
  
  const imgOffset = circumference - (imgPct * circumference);
  const imgRot = docsPct * 360;

  const otherOffset = circumference - (otherPct * circumference);
  const otherRot = (docsPct + imgPct) * 360;

  const notesPassOffset = circumference - (notesPassPct * circumference);
  const notesPassRot = (docsPct + imgPct + otherPct) * 360;

  return (
    <Link href="/settings/storage" className="block bg-[#0b1120] border border-slate-800 rounded-xl p-6 h-full flex flex-col justify-between hover:border-slate-700 hover:bg-[#111827]/50 transition-colors group outline-none focus:ring-2 focus:ring-[#10b981]/50 focus:ring-offset-1 focus:ring-offset-[#0b1120]">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-medium text-white group-hover:text-slate-200">Storage Usage</h3>
        <span className="text-xs font-medium text-[#10b981] group-hover:text-[#059669] transition-colors">
          Manage Storage
        </span>
      </div>
      
      <div className="flex items-center gap-6 mb-8 justify-center">
        {/* Multi-color Donut Chart */}
        <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle cx="48" cy="48" r="40" fill="none" stroke="#1e293b" strokeWidth="12" />
            
            {/* Documents (Green) */}
            {docsPct > 0 && (
              <circle cx="48" cy="48" r="40" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={docsOffset} className="transition-all duration-1000" />
            )}
            
            {/* Images (Purple) */}
            {imgPct > 0 && (
              <circle cx="48" cy="48" r="40" fill="none" stroke="#8b5cf6" strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={imgOffset} className="transition-all duration-1000" style={{ transform: `rotate(${imgRot}deg)`, transformOrigin: 'center' }} />
            )}

            {/* Other Files (Orange) */}
            {otherPct > 0 && (
              <circle cx="48" cy="48" r="40" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={otherOffset} className="transition-all duration-1000" style={{ transform: `rotate(${otherRot}deg)`, transformOrigin: 'center' }} />
            )}
            
            {/* Notes & Passwords (Blue) */}
            {notesPassPct > 0 && (
              <circle cx="48" cy="48" r="40" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={notesPassOffset} className="transition-all duration-1000" style={{ transform: `rotate(${notesPassRot}deg)`, transformOrigin: 'center' }} />
            )}
          </svg>
          <div className="text-center absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-sm font-bold text-white">{usedPercentage}%</span>
          </div>
        </div>
        
        <div className="flex flex-col justify-center">
          <div className="text-2xl font-bold font-outfit text-white leading-tight">{displayTotal}</div>
          <div className="text-xs text-slate-500">of 100 GB used</div>
        </div>
      </div>

      <div className="space-y-3 mt-auto">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <div className="w-2 h-2 rounded-full bg-[#10b981]" />
            Documents
          </div>
          <span className="text-slate-400">{formatBytes(categories.Documents)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <div className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
            Images
          </div>
          <span className="text-slate-400">{formatBytes(categories.Images)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
            Other Files
          </div>
          <span className="text-slate-400">{formatBytes(categories.Other)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
            Notes & Passwords
          </div>
          <span className="text-slate-400">{formatBytes(categories.Notes + categories.Passwords)}</span>
        </div>
      </div>
    </Link>
  );
}

import { Fingerprint, FileText, KeyRound, StickyNote, LogIn, LogOut, Shield, Pencil, Trash, Download, UploadCloud, Unlock, Eye } from "lucide-react";
import { getRecentActivity } from "../../actions/dashboard.actions";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { prisma } from "@/lib/prisma/client";

function getActivityConfig(action: string, metadata: any = {}) {
  const rawNoun = metadata?.title || metadata?.itemId || "";

  switch (action) {
    case "login":
      return { verb: "Logged In", noun: "", type: "Security", icon: LogIn, color: "text-[#10b981]", bg: "bg-[#10b981]/10", border: "border-[#10b981]/20" };
    case "logout":
      return { verb: "Logged Out", noun: "", type: "Security", icon: LogOut, color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500/20" };
    
    // Vault Actions
    case "vault_export":
    case "vault_exported":
      return { verb: "Exported", noun: rawNoun || "Encrypted Backup", type: "Export", icon: Download, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
    case "vault_import":
    case "vault_imported":
      return { verb: "Restored", noun: rawNoun || "Vault Backup", type: "Restore", icon: UploadCloud, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" };
    case "vault_unlock":
    case "vault_unlocked":
      return { verb: "Unlocked", noun: rawNoun || "Private Vault", type: "Auth", icon: Unlock, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" };

    // Creates
    case "create_password":
      return { verb: "Added", noun: rawNoun || "Password", type: "Password", icon: KeyRound, color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/10", border: "border-[#8b5cf6]/20" };
    case "create_document":
      return { verb: "Uploaded", noun: rawNoun || "Document", type: "Document", icon: FileText, color: "text-[#3b82f6]", bg: "bg-[#3b82f6]/10", border: "border-[#3b82f6]/20" };
    case "create_secure_note":
      return { verb: "Added", noun: rawNoun || "Secure Note", type: "Note", icon: StickyNote, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10", border: "border-[#f59e0b]/20" };
    case "create_identity":
      return { verb: "Added", noun: rawNoun || "Identity", type: "Identity", icon: Fingerprint, color: "text-[#ec4899]", bg: "bg-[#ec4899]/10", border: "border-[#ec4899]/20" };
    case "create_receipt":
    case "create_warranty":
      return { verb: "Saved", noun: rawNoun || "Warranty", type: "Record", icon: FileText, color: "text-[#14b8a6]", bg: "bg-[#14b8a6]/10", border: "border-[#14b8a6]/20" };
      
    // CRUD
    case "update_item":
      return { verb: "Updated", noun: rawNoun || "Vault Item", type: "Edit", icon: Pencil, color: "text-[#3b82f6]", bg: "bg-[#3b82f6]/10", border: "border-[#3b82f6]/20" }; 
    case "delete_item":
      return { verb: "Deleted", noun: rawNoun || "Item", type: "Delete", icon: Trash, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" };
    case "view_item":
      return { verb: "Viewed", noun: rawNoun || "Vault Record", type: "Access", icon: Eye, color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/10", border: "border-[#8b5cf6]/20" };

    default: {
      const formatted = action
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      return {
        verb: formatted,
        noun: rawNoun,
        type: "Security",
        icon: Shield,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
      };
    }
  }
}

export async function RecentActivityCard({ userId }: { userId: string }) {
  const logs = await prisma.activityLog.findMany({
    where: { profile_id: userId },
    orderBy: { created_at: 'desc' },
    take: 5,
  });

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-white to-slate-50/70 dark:from-[#0b1120] dark:via-[#0b1120] dark:to-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 h-full flex flex-col justify-between shadow-xs hover:shadow-xl hover:shadow-emerald-500/5 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
      {/* Top subtle accent line */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-blue-500/40 via-indigo-400/40 to-emerald-500/40 opacity-80" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">Recent Activity</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">Real-time immutable audit trail</p>
        </div>
        <Link 
          href="/activity" 
          className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 group/link transition-all"
        >
          <span>View all</span>
          <span className="group-hover/link:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>

      {/* Activity List */}
      <div className="space-y-2 flex-1 flex flex-col justify-center relative z-10">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 text-center">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-3">
              <Shield className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No recent activity</p>
            <p className="text-xs text-slate-500 mt-1">Cryptographic events will appear here in real time.</p>
          </div>
        ) : (
          logs.map((log: any) => {
            const config = getActivityConfig(log.action, log.metadata);
            
            return (
              <div 
                key={log.id} 
                className="flex items-center justify-between group px-3 py-2 rounded-xl bg-white/60 dark:bg-[#111827]/40 border border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-[#111827] transition-all"
              >
                <div className="flex gap-2.5 items-center min-w-0 pr-2">
                  <div className={`p-1.5 rounded-lg ${config.bg} ${config.color} shrink-0 border ${config.border}`}>
                    <config.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                      {config.verb} {config.noun && <span className="font-medium text-slate-500 dark:text-slate-400">{config.noun}</span>}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-medium">{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</p>
                  </div>
                </div>
                <div className="shrink-0">
                  <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border bg-white dark:bg-[#0b1120] ${config.border} ${config.color} shadow-2xs`}>
                    {config.type}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

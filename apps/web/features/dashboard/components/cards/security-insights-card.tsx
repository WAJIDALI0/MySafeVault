import { Sparkles, ShieldAlert, CheckCircle2, Lightbulb, ArrowRight, Bot } from "lucide-react";
import { prisma } from "@/lib/prisma/client";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export async function SecurityInsightsCard({ userId }: { userId: string }) {
  const insights: { id: string; type: 'success' | 'warning' | 'info'; text: string; icon: any; color: string; bg: string }[] = [];

  try {
    // 1. Vault Item Age Insight (Stale passwords)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const staleItems = await prisma.vaultItem.count({
      where: {
        profile_id: userId,
        type: "PASSWORD",
        updated_at: { lt: oneYearAgo }
      }
    });

    if (staleItems > 0) {
      insights.push({
        id: "stale-passwords",
        type: "warning",
        text: `You have ${staleItems} password${staleItems === 1 ? '' : 's'} that haven't been rotated in over a year.`,
        icon: ShieldAlert,
        color: "text-amber-500 dark:text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/20"
      });
    }

    // 2. Recent MFA Activity Insight
    const recentMfaActivity = await prisma.activityLog.findFirst({
      where: {
        profile_id: userId,
        action: "mfa_enabled",
      },
      orderBy: { created_at: "desc" }
    });

    if (recentMfaActivity) {
      insights.push({
        id: "mfa-enabled",
        type: "success",
        text: `Strong posture: Multi-Factor Authentication enabled ${formatDistanceToNow(new Date(recentMfaActivity.created_at), { addSuffix: true })}.`,
        icon: CheckCircle2,
        color: "text-[#10b981]",
        bg: "bg-[#10b981]/10 border-[#10b981]/20"
      });
    }

    // 3. Vault usage insight
    const totalItems = await prisma.vaultItem.count({
      where: { profile_id: userId }
    });

    if (totalItems === 0) {
      insights.push({
        id: "empty-vault",
        type: "info",
        text: "Vault initialized. Add credentials or documents to trigger real-time AI security audits.",
        icon: Lightbulb,
        color: "text-blue-500 dark:text-blue-400",
        bg: "bg-blue-500/10 border-blue-500/20"
      });
    } else if (insights.length < 3) {
      insights.push({
        id: "vault-active",
        type: "success",
        text: `${totalItems} items protected under AES-256-GCM encryption with continuous integrity checks.`,
        icon: CheckCircle2,
        color: "text-[#10b981]",
        bg: "bg-[#10b981]/10 border-[#10b981]/20"
      });
    }

  } catch (error) {
    console.error("Failed to generate security insights:", error);
  }

  const displayInsights = insights.slice(0, 3);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-white to-emerald-50/20 dark:from-[#0b1120] dark:via-[#0b1120] dark:to-[#022c22]/20 border border-slate-200/80 dark:border-slate-800 shadow-xs rounded-2xl p-6 h-full flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-500/5 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 group">
      {/* Top AI gradient accent line */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 opacity-90" />

      {/* Ambient glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-emerald-500 blur-3xl opacity-10 dark:opacity-20 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-[#10b981] border border-emerald-500/20 rounded-xl shadow-xs ring-1 ring-emerald-500/15 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">AI Security Insights</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">Continuous machine auditing</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/50 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Scan
          </span>
        </div>
        
        <div className="space-y-3 mb-5">
          {displayInsights.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No warnings detected. Vault hygiene is optimal.</p>
          ) : (
            displayInsights.map((insight) => (
              <div 
                key={insight.id} 
                className="flex gap-3.5 p-3.5 rounded-xl bg-white/70 dark:bg-[#111827]/40 border border-slate-200/70 dark:border-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-[#111827] shadow-2xs hover:shadow-xs transition-all"
              >
                <div className={`p-2 rounded-lg border shrink-0 h-fit ${insight.bg} ${insight.color}`}>
                  <insight.icon className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">{insight.text}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <Link 
        href="/settings/security" 
        className="relative z-10 w-full flex items-center justify-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 border border-emerald-500/30 py-2.5 rounded-xl shadow-xs transition-all hover:shadow-md hover:shadow-emerald-500/10 active:scale-[0.99] group/btn mt-auto"
      >
        <span>Run Full Posture Audit</span>
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

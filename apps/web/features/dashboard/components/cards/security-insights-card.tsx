import { Lightbulb, ShieldAlert, CheckCircle2, Info, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma/client";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export async function SecurityInsightsCard({ userId }: { userId: string }) {
  const insights: { id: string; type: 'success' | 'warning' | 'info'; text: string; icon: any; color: string }[] = [];

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
        text: `You have ${staleItems} password${staleItems === 1 ? '' : 's'} that haven't been updated in over a year.`,
        icon: ShieldAlert,
        color: "text-amber-500"
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
        text: `Good job: You enabled 2FA ${formatDistanceToNow(new Date(recentMfaActivity.created_at), { addSuffix: true })}.`,
        icon: CheckCircle2,
        color: "text-emerald-500"
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
        text: "Your vault is empty. Get started by adding your first secure item.",
        icon: Lightbulb,
        color: "text-blue-500"
      });
    } else if (insights.length < 3) {
      insights.push({
        id: "vault-active",
        type: "success",
        text: `You are securely storing ${totalItems} items in your encrypted vault.`,
        icon: CheckCircle2,
        color: "text-emerald-500"
      });
    }

  } catch (error) {
    console.error("Failed to generate security insights:", error);
  }

  // Ensure we show at most 3 insights
  const displayInsights = insights.slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-indigo-900/40 to-[#0b1120] border border-indigo-500/20 rounded-xl p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Lightbulb className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="font-medium text-white">Smart Security Insights</h3>
        </div>
        
        <div className="space-y-4 mb-6">
          {displayInsights.length === 0 ? (
            <p className="text-sm text-slate-400">No new insights at this time.</p>
          ) : (
            displayInsights.map((insight) => (
              <div key={insight.id} className="flex gap-3">
                <insight.icon className={`w-5 h-5 shrink-0 ${insight.color} mt-0.5`} />
                <p className="text-sm text-slate-300 leading-relaxed">{insight.text}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <Link 
        href="/settings/security" 
        className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 py-2.5 rounded-lg transition-colors mt-auto"
      >
        Review Security Issues <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

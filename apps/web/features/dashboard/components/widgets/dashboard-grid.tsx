// Cache bust: 1

import { Suspense } from "react";
import { SecurityScoreCard } from "../cards/security-score-card";
import { VaultOverviewCard } from "../cards/vault-overview-card";
import { QuickActionsCard } from "../cards/quick-actions-card";
import { StorageCard } from "../cards/storage-card";
import { RecentActivityCard } from "../cards/recent-activity-card";
import { UpcomingExpirationsCard } from "../cards/upcoming-expirations-card";
import { SecurityInsightsCard } from "../cards/security-insights-card";
import { PrivateVaultStatusCard } from "../cards/private-vault-card";
import { Calendar, Shield, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCachedProfile } from "@/lib/services/profile.service";
import { WidgetErrorBoundary } from "./widget-error-boundary";

function CardSkeleton({ h = "h-[300px]" }: { h?: string }) {
  return <div className={`w-full bg-slate-100 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-xl ${h} animate-pulse`}></div>;
}

export async function DashboardGrid() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;
  
  let firstName = "Wajid";
  if (user) {
    const profile = await getCachedProfile(user.id);
    if (profile?.full_name) {
      firstName = profile.full_name.split(" ")[0];
    }
  }

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex flex-col h-full w-full max-w-[1600px] mx-auto pb-20 space-y-8">
      
      {/* Hero Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Subtle ambient backdrop glow */}
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black font-outfit text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            <span>Good {timeGreeting}, {firstName}</span>
            <span className="inline-block hover:rotate-12 transition-transform cursor-default">👋</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-1.5 flex items-center gap-2 font-medium">
            <span>Everything important is protected, organized, and within reach.</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex items-center gap-2 bg-white/90 dark:bg-[#0b1120]/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-2xs rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{today}</span>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Fully Secured</span>
          </div>
        </div>
      </div>

      {/* Row 1: Full-Width 5-Column Metric Overview Cards */}
      <div>
        <WidgetErrorBoundary title="Vault Overview" h="h-[130px]">
          <Suspense fallback={<CardSkeleton h="h-[130px]" />}>
            <VaultOverviewCard userId={user.id} />
          </Suspense>
        </WidgetErrorBoundary>
      </div>

      {/* Row 2: Security Score, Recent Activity, Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
        <div className="md:col-span-1">
          <WidgetErrorBoundary title="Security Score" h="min-h-[380px]">
            <Suspense fallback={<CardSkeleton h="h-[380px]" />}>
              <SecurityScoreCard userId={user.id} />
            </Suspense>
          </WidgetErrorBoundary>
        </div>
        <div className="md:col-span-1">
          <WidgetErrorBoundary title="Recent Activity" h="min-h-[380px]">
            <Suspense fallback={<CardSkeleton h="h-[380px]" />}>
              <RecentActivityCard userId={user.id} />
            </Suspense>
          </WidgetErrorBoundary>
        </div>
        <div className="md:col-span-2 xl:col-span-1">
          <QuickActionsCard />
        </div>
      </div>

      {/* Row 3: Storage Usage, AI Security Insights, and Private Vault & Lock Folder */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
        <div className="md:col-span-1">
          <WidgetErrorBoundary title="Storage Limits" h="min-h-[340px]">
            <Suspense fallback={<CardSkeleton h="h-[340px]" />}>
              <StorageCard userId={user.id} />
            </Suspense>
          </WidgetErrorBoundary>
        </div>
        <div className="md:col-span-1">
          <WidgetErrorBoundary title="Security Insights" h="min-h-[340px]">
            <Suspense fallback={<CardSkeleton h="h-[340px]" />}>
              <SecurityInsightsCard userId={user.id} />
            </Suspense>
          </WidgetErrorBoundary>
        </div>
        <div className="md:col-span-2 xl:col-span-1">
          <PrivateVaultStatusCard />
        </div>
      </div>

      {/* Row 4: Upcoming Expirations */}
      <div>
        <WidgetErrorBoundary title="Upcoming Expirations" h="h-[220px]">
          <Suspense fallback={<CardSkeleton h="h-[220px]" />}>
            <UpcomingExpirationsCard userId={user.id} />
          </Suspense>
        </WidgetErrorBoundary>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <Shield className="w-4 h-4 text-emerald-600 dark:text-[#10b981]" />
          <p>Protected with AES-256-GCM encryption and multi-factor verification.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 text-xs">
            System status: Operational
            <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
          </span>
          <button className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700/50 text-xs font-medium shadow-2xs">
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Now
          </button>
        </div>
      </div>

    </div>
  );
}

// Cache bust: 1

import { Suspense } from "react";
import { SecurityScoreCard } from "../cards/security-score-card";
import { VaultOverviewCard } from "../cards/vault-overview-card";
import { QuickActionsCard } from "../cards/quick-actions-card";
import { StorageCard } from "../cards/storage-card";
import { RecentActivityCard } from "../cards/recent-activity-card";
import { UpcomingExpirationsCard } from "../cards/upcoming-expirations-card";
import { SecurityRecommendationsCard } from "../cards/security-recommendations-card";
import { Calendar, Shield, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCachedProfile } from "@/lib/services/profile.service";
import { WidgetErrorBoundary } from "./widget-error-boundary";

function CardSkeleton({ h = "h-[300px]" }: { h?: string }) {
  return <div className={`w-full bg-[#0b1120] border border-slate-800 rounded-xl ${h} animate-pulse`}></div>;
}

export async function DashboardGrid() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;
  
  let firstName = "User";
  if (user) {
    const profile = await getCachedProfile(user.id);
    if (profile?.full_name) {
      firstName = profile.full_name.split(" ")[0];
    }
  }

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const weekday = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="flex flex-col h-full w-full max-w-[1600px] mx-auto pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">Here's what's happening with your vault today.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-[#0b1120] border border-slate-800 rounded-lg px-4 py-2.5">
          <Calendar className="w-5 h-5 text-slate-400" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-200">{today}</span>
            <span className="text-xs text-slate-500">{weekday}</span>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* ROW 1 */}
        <div className="lg:col-span-2">
          <WidgetErrorBoundary title="Vault Overview" h="h-[140px]">
            <Suspense fallback={<CardSkeleton h="h-[140px]" />}>
              <VaultOverviewCard userId={user.id} />
            </Suspense>
          </WidgetErrorBoundary>
        </div>
        <div className="lg:col-span-1">
          <WidgetErrorBoundary title="Security Score" h="h-[140px]">
            <Suspense fallback={<CardSkeleton h="h-[140px]" />}>
              <SecurityScoreCard userId={user.id} />
            </Suspense>
          </WidgetErrorBoundary>
        </div>

        {/* ROW 2 */}
        <div className="lg:col-span-1">
          <WidgetErrorBoundary title="Recent Activity" h="h-[380px]">
            <Suspense fallback={<CardSkeleton h="h-[380px]" />}>
              <RecentActivityCard userId={user.id} />
            </Suspense>
          </WidgetErrorBoundary>
        </div>
        <div className="lg:col-span-1">
          <QuickActionsCard />
        </div>
        <div className="lg:col-span-1">
          <WidgetErrorBoundary title="Storage Limits" h="h-[300px]">
            <Suspense fallback={<CardSkeleton h="h-[300px]" />}>
              <StorageCard userId={user.id} />
            </Suspense>
          </WidgetErrorBoundary>
        </div>

        {/* ROW 3 */}
        <div className="lg:col-span-2">
          <WidgetErrorBoundary title="Upcoming Expirations" h="h-[380px]">
            <Suspense fallback={<CardSkeleton h="h-[380px]" />}>
              <UpcomingExpirationsCard userId={user.id} />
            </Suspense>
          </WidgetErrorBoundary>
        </div>
        <div className="lg:col-span-1">
          <SecurityRecommendationsCard />
        </div>

      </div>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <Shield className="w-4 h-4 text-slate-500" />
          <p>Your data is encrypted end-to-end and stored securely.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-slate-500 flex items-center gap-2">
            Last sync: 2 mins ago
            <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
          </span>
          <button className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700/50">
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Now
          </button>
        </div>
      </div>

    </div>
  );
}

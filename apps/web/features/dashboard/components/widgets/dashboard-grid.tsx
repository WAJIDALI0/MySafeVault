

import { SecurityScoreCard } from "../cards/security-score-card";
import { VaultOverviewCard } from "../cards/vault-overview-card";
import { QuickActionsCard } from "../cards/quick-actions-card";
import { StorageCard } from "../cards/storage-card";
import { RecentActivityCard } from "../cards/recent-activity-card";
import { UpcomingExpirationsCard } from "../cards/upcoming-expirations-card";
import { SecurityRecommendationsCard } from "../cards/security-recommendations-card";
import { Calendar, Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardGrid() {
  return (
    <div className="flex flex-col h-full w-full max-w-[1600px] mx-auto pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2">
            Welcome back, Wajid! 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">Here's what's happening with your vault today.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-[#0b1120] border border-slate-800 rounded-lg px-4 py-2.5">
          <Calendar className="w-5 h-5 text-slate-400" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-200">May 27, 2025</span>
            <span className="text-xs text-slate-500">Tuesday</span>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* ROW 1 */}
        <div className="lg:col-span-2">
          <VaultOverviewCard />
        </div>
        <div className="lg:col-span-1">
          <SecurityScoreCard />
        </div>

        {/* ROW 2 */}
        <div className="lg:col-span-1">
          <RecentActivityCard />
        </div>
        <div className="lg:col-span-1">
          <QuickActionsCard />
        </div>
        <div className="lg:col-span-1">
          <StorageCard />
        </div>

        {/* ROW 3 */}
        <div className="lg:col-span-2">
          <UpcomingExpirationsCard />
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

import { CheckCircle2, AlertTriangle, Info, ChevronRight } from "lucide-react";

export function SecurityRecommendationsCard() {
  return (
    <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-medium">Security Recommendations</h3>
        <button className="text-sm text-slate-400 hover:text-white transition-colors">View all</button>
      </div>

      <div className="space-y-4 flex-1">
        
        {/* Recommendation 1 */}
        <div className="group flex items-start gap-4 p-3 -mx-3 rounded-lg hover:bg-slate-800/30 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[#10b981]/10 flex items-center justify-center text-[#10b981] flex-shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200">Great! Your 2FA is enabled</p>
            <p className="text-xs text-slate-500 truncate mt-0.5">Two-factor authentication adds an extra layer of security.</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors self-center flex-shrink-0" />
        </div>

        {/* Recommendation 2 */}
        <div className="group flex items-start gap-4 p-3 -mx-3 rounded-lg hover:bg-slate-800/30 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[#f59e0b]/10 flex items-center justify-center text-[#f59e0b] flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#f59e0b]">You have 3 weak passwords</p>
            <p className="text-xs text-slate-500 truncate mt-0.5">We recommend updating them to strong passwords.</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors self-center flex-shrink-0" />
        </div>

        {/* Recommendation 3 */}
        <div className="group flex items-start gap-4 p-3 -mx-3 rounded-lg hover:bg-slate-800/30 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6] flex-shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200">Backup your vault</p>
            <p className="text-xs text-slate-500 truncate mt-0.5">Last backup was 5 days ago. Backup regularly for safety.</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors self-center flex-shrink-0" />
        </div>

      </div>
    </div>
  );
}

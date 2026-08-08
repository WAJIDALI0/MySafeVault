import { FolderOpen, KeyRound, FileText, FileLock2, Star, TrendingUp, ChevronDown, Shield } from "lucide-react";
import { getDashboardCounts } from "../../actions/dashboard.actions";

export async function VaultOverviewCard() {
  const countsResponse = await getDashboardCounts();
  const data = countsResponse.data || { totalItems: 0, passwords: 0, documents: 0, secureNotes: 0, favorites: 0 };

  const stats = [
    { label: "Total Items", value: data.totalItems.toString(), icon: FolderOpen, color: "text-slate-400", bg: "bg-slate-800/50", trend: "+0 this week" },
    { label: "Passwords", value: data.passwords.toString(), icon: KeyRound, color: "text-purple-500", bg: "bg-purple-500/10", trend: "+0 this week" },
    { label: "Documents", value: data.documents.toString(), icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+0 this week" },
    { label: "Secure Notes", value: data.secureNotes.toString(), icon: FileLock2, color: "text-amber-500", bg: "bg-amber-500/10", trend: "+0 this week" },
    { label: "Favorites", value: data.favorites.toString(), icon: Star, color: "text-rose-500", bg: "bg-rose-500/10", trend: "+0 this week" },
  ];

  return (
    <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-6 shadow-sm overflow-hidden h-full flex flex-col">
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="font-medium text-white">Vault Overview</h3>
        </div>
        
        <button className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700/50 transition-colors">
          This Week
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#111827] border border-slate-800/50 rounded-lg p-4 flex flex-col justify-between hover:border-slate-700 transition-colors cursor-default">
            
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-1.5 rounded-md ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-slate-400">{stat.label}</span>
            </div>
            
            <div>
              <div className="text-3xl font-bold font-outfit text-white mb-2">
                {stat.value}
              </div>
              <div className="text-[11px] font-medium text-[#10b981] flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </div>
            </div>
            
          </div>
        ))}
      </div>
      
    </div>
  );
}

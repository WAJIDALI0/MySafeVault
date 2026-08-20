import { FolderOpen, TrendingUp, ChevronDown, Shield } from "lucide-react";
import { getDashboardStats } from "../../services/dashboard.service";
import { getCategoryStyle } from "@/lib/utils/category-styles";
import Link from "next/link";

export async function VaultOverviewCard({ userId }: { userId: string }) {
  const data = await getDashboardStats(userId);

  const trendLabel = data.trend === 0 ? "No change" : (data.trend > 0 ? `+${data.trend} this week` : `${data.trend} this week`);

  const stats = [
    { label: "Total Items", value: data.totalItems.toString(), icon: FolderOpen, color: "text-slate-400", bg: "bg-slate-800/50", trend: trendLabel, href: "/vault" },
    { label: "Passwords", value: data.passwords.toString(), icon: getCategoryStyle('PASSWORD').icon, color: getCategoryStyle('PASSWORD').textColor, bg: getCategoryStyle('PASSWORD').bgColor, trend: trendLabel, href: "/vault?category=PASSWORD" },
    { label: "Documents", value: data.documents.toString(), icon: getCategoryStyle('DOCUMENT').icon, color: getCategoryStyle('DOCUMENT').textColor, bg: getCategoryStyle('DOCUMENT').bgColor, trend: trendLabel, href: "/vault?category=DOCUMENT" },
    { label: "Secure Notes", value: data.secureNotes.toString(), icon: getCategoryStyle('SECURE_NOTE').icon, color: getCategoryStyle('SECURE_NOTE').textColor, bg: getCategoryStyle('SECURE_NOTE').bgColor, trend: trendLabel, href: "/vault?category=SECURE_NOTE" },
    { label: "Favorites", value: data.favorites.toString(), icon: getCategoryStyle('FAVORITE').icon, color: getCategoryStyle('FAVORITE').textColor, bg: getCategoryStyle('FAVORITE').bgColor, trend: trendLabel, href: "/vault?favorites=true" },
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
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href} className="bg-[#111827] border border-slate-800/50 rounded-lg p-4 flex flex-col justify-between hover:border-[#10b981]/50 hover:bg-slate-800/30 transition-colors cursor-pointer group outline-none focus:ring-2 focus:ring-[#10b981]/50 focus:ring-offset-1 focus:ring-offset-[#111827]">
            
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-1.5 rounded-md ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300">{stat.label}</span>
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
            
          </Link>
        ))}
      </div>
      
    </div>
  );
}

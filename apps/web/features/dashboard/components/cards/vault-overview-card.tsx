import { FolderOpen, KeyRound, FileText, StickyNote, Fingerprint, TrendingUp, ArrowUpRight } from "lucide-react";
import { getDashboardStats } from "../../services/dashboard.service";
import Link from "next/link";

export async function VaultOverviewCard({ userId }: { userId: string }) {
  const data = await getDashboardStats(userId);

  const formatTrend = (delta: number) => {
    if (delta > 0) return `+${delta} this week`;
    if (delta < 0) return `${delta} this week`;
    return "+0 this week";
  };

  const trendLabel = formatTrend(data.trend);

  const stats = [
    {
      label: "Total Items",
      value: data.totalItems.toString(),
      icon: FolderOpen,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
      accentGradient: "from-emerald-500 via-teal-400 to-emerald-600",
      glowColor: "bg-emerald-500",
      hoverShadow: "hover:shadow-emerald-500/10 hover:border-emerald-300 dark:hover:border-emerald-500/50",
      iconRing: "ring-emerald-500/20",
      trendBg: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200/70 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300",
      trend: trendLabel,
      href: "/vault",
    },
    {
      label: "Passwords",
      value: data.passwords.toString(),
      icon: KeyRound,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10 dark:bg-purple-500/15",
      accentGradient: "from-purple-500 via-indigo-400 to-purple-600",
      glowColor: "bg-purple-500",
      hoverShadow: "hover:shadow-purple-500/10 hover:border-purple-300 dark:hover:border-purple-500/50",
      iconRing: "ring-purple-500/20",
      trendBg: "bg-purple-50 dark:bg-purple-950/50 border-purple-200/70 dark:border-purple-800/50 text-purple-700 dark:text-purple-300",
      trend: data.passwords > 0 ? "+1 this week" : "+0 this week",
      href: "/vault?category=PASSWORD",
    },
    {
      label: "Documents",
      value: data.documents.toString(),
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10 dark:bg-blue-500/15",
      accentGradient: "from-blue-500 via-sky-400 to-blue-600",
      glowColor: "bg-blue-500",
      hoverShadow: "hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-500/50",
      iconRing: "ring-blue-500/20",
      trendBg: "bg-blue-50 dark:bg-blue-950/50 border-blue-200/70 dark:border-blue-800/50 text-blue-700 dark:text-blue-300",
      trend: data.documents > 0 ? "+1 this week" : "+0 this week",
      href: "/vault?category=DOCUMENT",
    },
    {
      label: "Secure Notes",
      value: data.secureNotes.toString(),
      icon: StickyNote,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10 dark:bg-amber-500/15",
      accentGradient: "from-amber-500 via-yellow-400 to-amber-600",
      glowColor: "bg-amber-500",
      hoverShadow: "hover:shadow-amber-500/10 hover:border-amber-300 dark:hover:border-amber-500/50",
      iconRing: "ring-amber-500/20",
      trendBg: "bg-amber-50 dark:bg-amber-950/50 border-amber-200/70 dark:border-amber-800/50 text-amber-700 dark:text-amber-300",
      trend: "+0 this week",
      href: "/vault?category=SECURE_NOTE",
    },
    {
      label: "Identity",
      value: data.identities.toString(),
      icon: Fingerprint,
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-500/10 dark:bg-cyan-500/15",
      accentGradient: "from-cyan-500 via-teal-400 to-cyan-600",
      glowColor: "bg-cyan-500",
      hoverShadow: "hover:shadow-cyan-500/10 hover:border-cyan-300 dark:hover:border-cyan-500/50",
      iconRing: "ring-cyan-500/20",
      trendBg: "bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200/70 dark:border-cyan-800/50 text-cyan-700 dark:text-cyan-300",
      trend: "+0 this week",
      href: "/vault?category=IDENTITY",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5 w-full">
      {stats.map((stat, i) => (
        <Link 
          key={i} 
          href={stat.href} 
          className={`relative overflow-hidden bg-gradient-to-b from-white via-white to-slate-50/70 dark:from-[#0b1120] dark:via-[#0b1120] dark:to-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-xs hover:shadow-xl ${stat.hoverShadow} hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group outline-none focus:ring-2 focus:ring-emerald-500/40 last:col-span-2 sm:last:col-span-1`}
        >
          {/* Top colored accent line */}
          <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${stat.accentGradient} opacity-90 group-hover:h-[4px] transition-all duration-300`} />

          {/* Ambient corner glow */}
          <div className={`absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-15 dark:opacity-25 pointer-events-none group-hover:opacity-30 transition-opacity duration-300 ${stat.glowColor}`} />

          <div className="flex items-start sm:items-center justify-between gap-2 mb-3 sm:mb-4 relative z-10">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className={`p-2 sm:p-2.5 rounded-xl shrink-0 ${stat.bg} ${stat.color} ring-1 ${stat.iconRing} group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                {stat.label}
              </span>
            </div>

            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300 dark:text-slate-600 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 shrink-0 hidden sm:block" />
          </div>
          
          <div className="relative z-10">
            <div className="text-2xl sm:text-4xl font-black font-outfit text-slate-900 dark:text-white mb-2 tracking-tight flex items-baseline gap-2">
              {stat.value}
            </div>
            <div className={`inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border ${stat.trendBg} transition-colors shadow-2xs`}>
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="truncate">{stat.trend}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

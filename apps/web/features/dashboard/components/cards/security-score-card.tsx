import { Check, AlertTriangle, ArrowRight, Info, ShieldAlert, ShieldCheck } from "lucide-react";
import { getSecurityScore } from "../../services/security-score.service";
import Link from "next/link";

export async function SecurityScoreCard({ userId }: { userId: string }) {
  const data = await getSecurityScore(userId);
  
  // Determine color based on score
  let colorHex = "#10b981"; // Emerald/Strong
  let colorClass = "text-[#10b981]";
  let bgClass = "bg-[#10b981]";
  let borderClass = "border-[#10b981]/20";
  let badgeBg = "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-800/50";
  
  if (data.score < 50) {
    colorHex = "#ef4444"; // Red/Weak
    colorClass = "text-[#ef4444]";
    bgClass = "bg-[#ef4444]";
    borderClass = "border-[#ef4444]/20";
    badgeBg = "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200/70 dark:border-red-800/50";
  } else if (data.score < 80) {
    colorHex = "#f59e0b"; // Amber/Fair
    colorClass = "text-[#f59e0b]";
    bgClass = "bg-[#f59e0b]";
    borderClass = "border-[#f59e0b]/20";
    badgeBg = "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/70 dark:border-amber-800/50";
  }

  const circumference = 327;
  const strokeDashoffset = circumference * (1 - (data.score / 100));

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-white to-emerald-50/25 dark:from-[#0b1120] dark:via-[#0b1120] dark:to-[#022c22]/20 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-full shadow-xs hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-300/80 dark:hover:border-emerald-500/40 transition-all duration-300 group">
      {/* Top emerald accent line */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 opacity-90" />

      {/* Ambient glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-emerald-500 blur-3xl opacity-10 dark:opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
            <span>Security Score</span>
            <Info className="w-4 h-4 text-slate-400 dark:text-slate-500 cursor-help" />
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Continuous cryptographic posture audit
          </p>
        </div>
        <span className={`inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-2xs ${badgeBg}`}>
          {data.label}
        </span>
      </div>

      {/* Center Donut + Breakdown */}
      <div className="flex-1 flex flex-col justify-center gap-4 my-auto relative z-10">
        <div className="flex flex-row items-center gap-4 sm:gap-5 justify-start">
          {/* Donut Chart */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-[0_2px_8px_rgba(16,185,129,0.25)]">
              <circle
                cx="56"
                cy="56"
                r="46"
                fill="none"
                stroke="currentColor"
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="10"
              />
              <circle
                cx="56"
                cy="56"
                r="46"
                fill="none"
                stroke={colorHex}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="text-center flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-black font-outfit text-slate-900 dark:text-white leading-none">
                {data.score}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">
                / 100
              </span>
            </div>
          </div>

          {/* Clean Guidance List (No ugly scrollbars, fits comfortably) */}
          <div className="flex-1 min-w-0 space-y-2">
            {data.score === 100 ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  Optimal Security
                </p>
                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-snug">
                  All active cryptographic and authentication checks passed.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  Recommendations
                </p>
                {data.warnings.slice(0, 2).map((warning, i) => (
                  <div
                    key={`warn-${i}`}
                    className="p-2 rounded-lg bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 text-[11px] sm:text-xs font-semibold text-amber-900 dark:text-amber-200 leading-tight"
                  >
                    {warning}
                  </div>
                ))}
                {data.warnings.length === 0 && data.passes.slice(0, 1).map((pass, i) => (
                  <div
                    key={`pass-${i}`}
                    className="p-2 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-[11px] sm:text-xs font-medium text-emerald-800 dark:text-emerald-200"
                  >
                    ✓ {pass}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80 relative z-10">
        <Link
          href="/settings/security"
          className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 border border-emerald-500/30 py-2.5 rounded-xl shadow-xs transition-all hover:shadow-md hover:shadow-emerald-500/10 active:scale-[0.99] group/btn"
        >
          <span>Improve Security</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

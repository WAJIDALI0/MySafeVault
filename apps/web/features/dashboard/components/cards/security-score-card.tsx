import { Check, AlertTriangle, ArrowRight, Info, ShieldAlert } from "lucide-react";
import { getSecurityScore } from "../../services/security-score.service";
import Link from "next/link";

export async function SecurityScoreCard({ userId }: { userId: string }) {
  const data = await getSecurityScore(userId);
  
  // Calculate SVG stroke offset based on percentage (377 is full circle)
  // 377 * (1 - (score / 100))
  const dashOffset = 377 * (1 - (data.score / 100));
  
  // Determine color based on score
  let colorHex = "#10b981"; // Emerald/Strong
  let colorClass = "text-[#10b981]";
  let bgClass = "bg-[#10b981]";
  let borderClass = "border-[#10b981]/20";
  let hoverBgClass = "hover:bg-[#10b981]/10";
  
  if (data.score < 50) {
    colorHex = "#ef4444"; // Red/Weak
    colorClass = "text-[#ef4444]";
    bgClass = "bg-[#ef4444]";
    borderClass = "border-[#ef4444]/20";
    hoverBgClass = "hover:bg-[#ef4444]/10";
  } else if (data.score < 80) {
    colorHex = "#f59e0b"; // Amber/Fair
    colorClass = "text-[#f59e0b]";
    bgClass = "bg-[#f59e0b]";
    borderClass = "border-[#f59e0b]/20";
    hoverBgClass = "hover:bg-[#f59e0b]/10";
  }

  return (
    <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-6 flex flex-col justify-between h-full hover:border-slate-700 transition-colors">
      <div className="flex justify-between items-start mb-6">
        <h3 className="font-medium text-white flex items-center gap-2">
          Security Score
          <Info className="w-3.5 h-3.5 text-slate-500 cursor-help" />
        </h3>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 xl:gap-8 justify-center">
          
          {/* Donut Chart */}
          <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
             {/* Background circle */}
             <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="60" fill="none" stroke="#1e293b" strokeWidth="12" />
                {/* Foreground circle */}
                <circle cx="72" cy="72" r="60" fill="none" stroke={colorHex} strokeWidth="12" strokeDasharray="377" strokeDashoffset={dashOffset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
             </svg>
             <div className="text-center flex flex-col items-center">
               <span className="text-4xl font-bold font-outfit text-white leading-none mt-2">{data.score}</span>
               <span className="text-[10px] text-slate-500 font-medium mt-1">/100</span>
             </div>
             <div className={`absolute -bottom-2 ${bgClass} text-[#0b1120] px-3 py-0.5 rounded-full text-xs font-bold`}>
               {data.label}
             </div>
          </div>
          
          {/* Checklist */}
          <div className="flex flex-col gap-3 min-w-0 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
            {data.score === 100 ? (
              <div className="mb-1">
                <p className="text-sm font-semibold text-emerald-400 mb-1">Excellent Security 🛡️</p>
                <p className="text-xs text-slate-400 leading-relaxed">Your account meets all currently implemented security checks.</p>
              </div>
            ) : (
              <div className="mb-1">
                <p className="text-sm font-semibold text-white mb-1">Improvements available</p>
                <p className="text-xs text-slate-400 leading-relaxed">Address the following warnings to improve your vault's security.</p>
              </div>
            )}

            {data.warnings.map((warning, i) => (
              <div key={`warn-${i}`} className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300">{warning}</span>
              </div>
            ))}
            {data.score !== 100 && data.passes.map((pass, i) => (
              <div key={`pass-${i}`} className="flex items-start gap-2 opacity-60">
                <Check className="w-3.5 h-3.5 text-[#10b981] flex-shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300">{pass}</span>
              </div>
            ))}
            {data.passes.length === 0 && data.warnings.length === 0 && (
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span className="text-xs text-slate-500 truncate">No security data</span>
              </div>
            )}
          </div>

        </div>

        <Link href="/settings/security" className={`w-full mt-4 flex items-center justify-center gap-2 text-sm font-semibold ${colorClass} hover:text-white bg-transparent ${hoverBgClass} border ${borderClass} py-2.5 rounded-lg transition-colors`}>
          Improve Security <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

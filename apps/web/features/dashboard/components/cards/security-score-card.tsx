"use client";

import { Check, AlertTriangle, ArrowRight, Info } from "lucide-react";

export function SecurityScoreCard() {
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
                {/* Foreground circle (85%) */}
                <circle cx="72" cy="72" r="60" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="377" strokeDashoffset="56.5" strokeLinecap="round" />
             </svg>
             <div className="text-center flex flex-col items-center">
               <span className="text-[10px] text-slate-500 font-medium">/100</span>
               <span className="text-4xl font-bold font-outfit text-white leading-none">85</span>
               <span className="text-[10px] text-slate-500 font-medium">/100</span>
             </div>
             <div className="absolute -bottom-2 bg-[#10b981] text-[#0b1120] px-3 py-0.5 rounded-full text-xs font-bold">
               Strong
             </div>
          </div>
          
          {/* Checklist */}
          <div className="flex flex-col gap-3 min-w-0">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#10b981] flex-shrink-0" />
              <span className="text-xs text-slate-300 truncate">Email verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#10b981] flex-shrink-0" />
              <span className="text-xs text-slate-300 truncate">2FA enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#10b981] flex-shrink-0" />
              <span className="text-xs text-slate-300 truncate">No compromised passwords</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b] flex-shrink-0" />
              <span className="text-xs text-slate-300 truncate">3 weak passwords</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b] flex-shrink-0" />
              <span className="text-xs text-slate-300 truncate">1 reused password</span>
            </div>
          </div>

        </div>

        <button className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-[#10b981] hover:text-white bg-[#10b981]/5 hover:bg-[#10b981]/10 border border-[#10b981]/20 py-2.5 rounded-lg transition-colors">
          Improve Security <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

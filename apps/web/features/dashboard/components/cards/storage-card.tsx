"use client";

export function StorageCard() {
  return (
    <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-6 h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-medium text-white">Storage Usage</h3>
        <button className="text-xs font-medium text-[#10b981] hover:text-[#059669] transition-colors">
          Manage Storage
        </button>
      </div>
      
      <div className="flex items-center gap-6 mb-8 justify-center">
        {/* Multi-color Donut Chart */}
        <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle cx="48" cy="48" r="40" fill="none" stroke="#1e293b" strokeWidth="12" />
            
            {/* Documents (Green - ~40%) */}
            <circle cx="48" cy="48" r="40" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="150" className="transition-all duration-1000" />
            
            {/* Images (Purple - ~25%) */}
            <circle cx="48" cy="48" r="40" fill="none" stroke="#8b5cf6" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="188" className="transition-all duration-1000" style={{ transform: 'rotate(144deg)', transformOrigin: 'center' }} />

            {/* Other Files (Orange - ~15%) */}
            <circle cx="48" cy="48" r="40" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="213" className="transition-all duration-1000" style={{ transform: 'rotate(234deg)', transformOrigin: 'center' }} />
            
            {/* Notes & Passwords (Blue - ~12%) */}
            <circle cx="48" cy="48" r="40" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="221" className="transition-all duration-1000" style={{ transform: 'rotate(288deg)', transformOrigin: 'center' }} />
          </svg>
          <div className="text-center absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-white">32%</span>
          </div>
        </div>
        
        <div className="flex flex-col justify-center">
          <div className="text-2xl font-bold font-outfit text-white leading-tight">32.4 GB</div>
          <div className="text-xs text-slate-500">of 100 GB used</div>
        </div>
      </div>

      <div className="space-y-3 mt-auto">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <div className="w-2 h-2 rounded-full bg-[#10b981]" />
            Documents
          </div>
          <span className="text-slate-400">14.2 GB</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <div className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
            Images
          </div>
          <span className="text-slate-400">8.7 GB</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
            Other Files
          </div>
          <span className="text-slate-400">5.1 GB</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
            Notes & Passwords
          </div>
          <span className="text-slate-400">4.4 GB</span>
        </div>
      </div>
    </div>
  );
}

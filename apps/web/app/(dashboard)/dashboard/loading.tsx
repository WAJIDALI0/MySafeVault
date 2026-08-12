import { Shield, Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center animate-pulse">
        <Loader2 className="w-8 h-8 text-[#10B981] animate-spin" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Loading Dashboard</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Decrypting your secure metrics...</p>
      </div>
      
      {/* Skeletons for grid layout */}
      <div className="w-full max-w-5xl mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 opacity-50 px-4">
        {/* Top row */}
        <div className="col-span-1 lg:col-span-8 h-[200px] bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="col-span-1 lg:col-span-4 h-[200px] bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        
        {/* Bottom row */}
        <div className="col-span-1 lg:col-span-4 h-[350px] bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="col-span-1 lg:col-span-4 h-[350px] bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="col-span-1 lg:col-span-4 h-[350px] bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

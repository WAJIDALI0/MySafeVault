import { Calendar, CreditCard, Shield, Plus } from "lucide-react";

export function UpcomingExpirationsCard() {
  return (
    <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-medium">Upcoming Expirations</h3>
        <button className="text-sm text-slate-400 hover:text-white transition-colors">View all</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-1">
        {/* Passport Card */}
        <div className="bg-[#111827] rounded-lg p-4 border border-slate-800/50 flex flex-col justify-between group hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded bg-[#10b981]/10 flex items-center justify-center text-[#10b981]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">Passport</p>
              <p className="text-xs text-slate-500">Expires in</p>
            </div>
          </div>
          <div>
            <p className="text-xl font-bold text-white mb-1">28 days</p>
            <p className="text-xs text-slate-500">Jun 24, 2025</p>
          </div>
        </div>

        {/* Driving License */}
        <div className="bg-[#111827] rounded-lg p-4 border border-slate-800/50 flex flex-col justify-between group hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded bg-[#f59e0b]/10 flex items-center justify-center text-[#f59e0b]">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">Driving License</p>
              <p className="text-xs text-slate-500">Expires in</p>
            </div>
          </div>
          <div>
            <p className="text-xl font-bold text-white mb-1">45 days</p>
            <p className="text-xs text-slate-500">Jul 11, 2025</p>
          </div>
        </div>

        {/* Health Insurance */}
        <div className="bg-[#111827] rounded-lg p-4 border border-slate-800/50 flex flex-col justify-between group hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded bg-[#8b5cf6]/10 flex items-center justify-center text-[#8b5cf6]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">Health Insurance</p>
              <p className="text-xs text-slate-500">Expires in</p>
            </div>
          </div>
          <div>
            <p className="text-xl font-bold text-white mb-1">62 days</p>
            <p className="text-xs text-slate-500">Jul 28, 2025</p>
          </div>
        </div>

        {/* Add Reminder */}
        <button className="bg-transparent border border-dashed border-slate-700 rounded-lg p-4 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-slate-300 hover:border-slate-500 hover:bg-slate-800/20 transition-all">
          <Plus className="w-6 h-6" />
          <span className="text-sm">Add Reminder</span>
        </button>
      </div>
    </div>
  );
}

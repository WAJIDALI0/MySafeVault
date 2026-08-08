import { Fingerprint, FileText, KeyRound, StickyNote, LogIn, LogOut, Shield } from "lucide-react";
import { getRecentActivity } from "../../actions/dashboard.actions";

function formatTimeAgo(dateString: string | Date) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} secs ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

function getActivityConfig(action: string, metadata: any = {}) {
  switch (action) {
    case "login":
      return { verb: "Logged", noun: "In", type: "Security", icon: LogIn, color: "text-[#10b981]", bg: "bg-[#10b981]/10", border: "border-[#10b981]/20" };
    case "logout":
      return { verb: "Logged", noun: "Out", type: "Security", icon: LogOut, color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500/20" };
    case "password_changed":
      return { verb: "Changed", noun: "Password", type: "Security", icon: Shield, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10", border: "border-[#f59e0b]/20" };
    case "create_password":
      return { verb: "Added", noun: metadata?.title || "Password", type: "Password", icon: KeyRound, color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/10", border: "border-[#8b5cf6]/20" };
    case "create_document":
      return { verb: "Uploaded", noun: metadata?.title || "Document", type: "Document", icon: FileText, color: "text-[#3b82f6]", bg: "bg-[#3b82f6]/10", border: "border-[#3b82f6]/20" };
    case "create_note":
      return { verb: "Added", noun: metadata?.title || "Note", type: "Note", icon: StickyNote, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10", border: "border-[#f59e0b]/20" };
    default:
      return { verb: "Performed", noun: action, type: "Action", icon: Fingerprint, color: "text-slate-400", bg: "bg-slate-800/50", border: "border-slate-700" };
  }
}

export async function RecentActivityCard() {
  const activityResponse = await getRecentActivity();
  const logs = activityResponse.data || [];

  return (
    <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-white">Recent Activity</h3>
        <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
          View all
        </button>
      </div>

      <div className="space-y-5 flex-1">
        {logs.length === 0 ? (
          <div className="text-slate-500 text-sm italic py-4">No recent activity.</div>
        ) : (
          logs.map((log: any) => {
            const config = getActivityConfig(log.action, log.metadata);
            
            return (
              <div key={log.id} className="flex items-center justify-between group">
                <div className="flex gap-4 items-center">
                  <div className={`p-2.5 rounded-xl ${config.bg} ${config.color} shrink-0`}>
                    <config.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {config.verb} <span className="font-normal text-slate-400">{config.noun}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{formatTimeAgo(log.created_at)}</p>
                  </div>
                </div>
                <div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border bg-[#0b1120] ${config.border} ${config.color}`}>
                    {config.type}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

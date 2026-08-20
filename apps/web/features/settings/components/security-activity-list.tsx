import Link from 'next/link';
import { Shield, ArrowRight } from 'lucide-react';
import { getActivities } from '@/features/activity/actions/activity.actions';
import { formatDistanceToNow } from 'date-fns';

// Helper to grab an icon/color based on action
function getActivityIcon(action: string) {
  return <Shield className="w-4 h-4 text-emerald-500" />;
}

export async function SecurityActivityList() {
  const result = await getActivities('Security', undefined, 5);
  const activities = result.success && result.data ? result.data : [];

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Recent Security Activity</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review your latest account security events</p>
        </div>
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-sm text-slate-500">No recent security activity.</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-slate-100 dark:bg-slate-900 rounded-lg">
                {getActivityIcon(activity.action)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                  {activity.action.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Link 
          href="/activity"
          className="flex items-center justify-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          View all activity <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

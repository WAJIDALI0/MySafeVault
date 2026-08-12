import { ActivityList } from '@/features/activity/components/activity-list';

export const metadata = {
  title: 'Activity Log | MySafeVault',
};

export default function ActivityPage() {
  return (
    <div className="max-w-5xl mx-auto w-full p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-outfit text-slate-900 dark:text-white">Activity Log</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Track all actions performed within your account and vault.</p>
      </div>

      <ActivityList />
    </div>
  );
}

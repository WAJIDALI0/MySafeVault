import { AlertTriangle, Trash2 } from 'lucide-react';

export const metadata = {
  title: 'Danger Zone | MySafeVault',
};

export default function DangerZonePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold font-outfit text-red-600 dark:text-red-400">Danger Zone</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Irreversible and destructive actions for your account.</p>
      </div>

      <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400 shrink-0 h-fit">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200">Delete Account</h3>
              <p className="text-sm text-red-700 dark:text-red-300/80 mt-1 max-w-md">
                Permanently delete your account and all encrypted data. This action cannot be undone. 
                All passwords, notes, and documents will be erased immediately.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-full uppercase tracking-wider">
              Coming Soon
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] text-right">
              Account deletion will be available once the full deletion workflow is implemented.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

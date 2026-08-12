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
          
          <button 
            disabled 
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600/50 text-white font-medium rounded-xl cursor-not-allowed shrink-0"
            title="Account deletion is currently disabled for your safety."
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

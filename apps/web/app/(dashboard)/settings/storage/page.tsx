import { getStorageStats } from '@/features/vault/actions/vault.actions';
import { formatBytes } from '@/lib/utils';
import { HardDrive, FileText, Key, FilePlus, Image as ImageIcon } from 'lucide-react';

export const metadata = {
  title: 'Storage Settings | MySafeVault',
};

const TOTAL_STORAGE = 100 * 1024 * 1024 * 1024; // 100 GB

export default async function StorageSettingsPage() {
  const stats = await getStorageStats();

  if (!stats || stats.error) {
    return <div>Error loading storage stats.</div>;
  }

  const usedBytes = stats.totalBytes || 0;
  const usagePercentage = Math.min((usedBytes / TOTAL_STORAGE) * 100, 100);
  
  const categories = [
    { name: 'Documents', size: stats.categories?.Documents || 0, icon: FileText, color: 'bg-blue-500' },
    { name: 'Images', size: stats.categories?.Images || 0, icon: ImageIcon, color: 'bg-purple-500' },
    { name: 'Notes', size: stats.categories?.Notes || 0, icon: FilePlus, color: 'bg-amber-500' },
    { name: 'Passwords', size: stats.categories?.Passwords || 0, icon: Key, color: 'bg-emerald-500' },
    { name: 'Other', size: stats.categories?.Other || 0, icon: HardDrive, color: 'bg-slate-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold font-outfit text-slate-900 dark:text-white">Storage Management</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monitor your encrypted vault storage usage.</p>
      </div>

      <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
              <HardDrive className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Storage Used</p>
              <h3 className="text-3xl font-bold font-outfit text-slate-900 dark:text-white mt-1">
                {formatBytes(usedBytes)} <span className="text-lg text-slate-500 font-normal">of 100 GB</span>
              </h3>
            </div>
          </div>
          <div className="w-full md:w-1/3 text-right">
             <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mb-2">{usagePercentage.toFixed(2)}% Used</p>
             <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full" style={{ width: `${Math.max(usagePercentage, 1)}%` }}></div>
             </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-8 mb-4">Storage Breakdown</h3>
        {usedBytes > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${cat.color}`}>
                    <cat.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white">{cat.name}</span>
                </div>
                <span className="text-sm font-semibold text-slate-500">{formatBytes(cat.size)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
              <HardDrive className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Your vault is empty</h4>
            <p className="text-sm text-slate-500 max-w-md">
              You haven't stored any items yet. Add passwords, documents, or secure notes to see your storage breakdown here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

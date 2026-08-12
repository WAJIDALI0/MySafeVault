import { AppearanceForm } from '@/features/settings/components/appearance-form';

export const metadata = {
  title: 'Appearance Settings | MySafeVault',
};

export default function AppearanceSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold font-outfit text-slate-900 dark:text-white">Appearance</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Customize how MySafeVault looks on your device.</p>
      </div>

      <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-4">Theme Preference</h3>
        <AppearanceForm />
      </div>
    </div>
  );
}

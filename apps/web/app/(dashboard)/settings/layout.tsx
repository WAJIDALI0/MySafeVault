import { ReactNode } from 'react';
import Link from 'next/link';
import { User, Shield, Palette, Bell, HardDrive, Trash2 } from 'lucide-react';
import { SettingsSidebar } from '@/features/settings/components/settings-sidebar';

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto h-full">
      <div className="w-full md:w-64 shrink-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-outfit text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account preferences</p>
        </div>
        <SettingsSidebar />
      </div>
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

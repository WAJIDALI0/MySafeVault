"use client";

import { useState } from 'react';
import { updateNotificationPreferences } from '../actions/preferences.actions';
import { Loader2 } from 'lucide-react';

export function NotificationPreferencesClient({ initialSettings }: { initialSettings: Record<string, boolean> }) {
  const [settings, setSettings] = useState(initialSettings);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const toggleSetting = async (key: string) => {
    const newValue = !settings[key];
    
    // Optimistic UI update
    setSettings(prev => ({ ...prev, [key]: newValue }));
    setLoadingKey(key);

    try {
      await updateNotificationPreferences({ [key]: newValue });
    } catch (err) {
      // Revert on error
      setSettings(prev => ({ ...prev, [key]: !newValue }));
    } finally {
      setLoadingKey(null);
    }
  };

  const options = [
    { key: 'security_alerts', title: 'Security Alerts', description: 'Get notified about unusual login attempts or security risks.' },
    { key: 'vault_activity', title: 'Vault Activity', description: 'Updates when items are added, modified, or deleted.' },
    { key: 'expirations', title: 'Expirations', description: 'Reminders when passwords or documents are about to expire.' },
    { key: 'system_notifications', title: 'System Notifications', description: 'Important updates about MySafeVault maintenance.' },
  ];

  return (
    <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
      {options.map((item) => (
        <div key={item.key} className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
              {item.title}
              {loadingKey === item.key && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer mt-1">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={!!settings[item.key]} 
              onChange={() => toggleSetting(item.key)}
              disabled={loadingKey === item.key}
            />
            <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
          </label>
        </div>
      ))}
    </div>
  );
}

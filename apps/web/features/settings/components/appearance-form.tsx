"use client";

import { useTheme } from 'next-themes';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AppearanceForm() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-40"></div>;
  }

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.value;
        
        return (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={`
              flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all
              ${isActive 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-primary-200 dark:hover:border-primary-800'
              }
            `}
          >
            <Icon className="w-8 h-8" />
            <span className="font-semibold">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

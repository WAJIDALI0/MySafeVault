"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Shield, Palette, Bell, HardDrive, Trash2 } from 'lucide-react';

const navItems = [
  { href: '/settings/account', label: 'Account', icon: User },
  { href: '/settings/security', label: 'Security', icon: Shield },
  { href: '/settings/appearance', label: 'Appearance', icon: Palette },
  { href: '/settings/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings/storage', label: 'Storage', icon: HardDrive },
  { href: '/settings/danger', label: 'Danger Zone', icon: Trash2, danger: true },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium overflow-hidden
              ${isActive 
                ? (item.danger 
                    ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' 
                    : 'bg-[#10b981]/10 text-[#10b981] dark:text-[#34d399]')
                : (item.danger 
                    ? 'text-slate-600 dark:text-slate-400 hover:bg-rose-50/50 dark:hover:bg-rose-900/10 hover:text-rose-500' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50')
              }
            `}
          >
            {isActive && (
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.danger ? 'bg-rose-500' : 'bg-[#10b981]'} rounded-r-full`} />
            )}
            <Icon className={`w-5 h-5 ${isActive && item.danger ? 'text-red-500' : ''}`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

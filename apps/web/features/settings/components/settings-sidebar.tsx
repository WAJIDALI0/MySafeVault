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
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
              ${isActive 
                ? (item.danger 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                    : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400')
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }
            `}
          >
            <Icon className={`w-5 h-5 ${isActive && item.danger ? 'text-red-500' : ''}`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

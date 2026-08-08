"use client";

import { Bell } from "lucide-react";

export function NotificationButton() {
  return (
    <button className="relative p-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
      <Bell className="w-5 h-5" />
      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950" />
    </button>
  );
}

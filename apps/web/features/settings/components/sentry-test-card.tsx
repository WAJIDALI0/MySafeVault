"use client";

import { AlertTriangle } from "lucide-react";

export function SentryTestCard() {
  return (
    <div className="flex flex-col p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">Sentry.io Error Tracking</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Generate a test error to verify integration</p>
          </div>
        </div>
        <button 
          onClick={() => {
            throw new Error("Sentry Test Error from MySafeVault Dashboard");
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          Throw Test Error
        </button>
      </div>
    </div>
  );
}

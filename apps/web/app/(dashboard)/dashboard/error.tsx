"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-6 px-4">
      <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center border border-red-200 dark:border-red-900/50">
        <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-500" />
      </div>
      
      <div className="text-center max-w-md">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          We encountered an error while loading your dashboard. Your vault data remains secure. Please try refreshing.
        </p>
        
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:ring-offset-2 dark:focus:ring-offset-[#0B1120]"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="w-full max-w-3xl mt-8 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto text-left">
          <p className="text-xs font-mono text-red-600 dark:text-red-400 font-bold mb-2">{error.message}</p>
          <pre className="text-[10px] font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{error.stack}</pre>
        </div>
      )}
    </div>
  );
}

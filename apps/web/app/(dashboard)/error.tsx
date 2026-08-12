"use client";

import { useEffect } from "react";
import { ShieldAlert, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-6">
      <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 border-4 border-red-50 dark:border-red-900/10">
        <ShieldAlert className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white mb-2">Something went wrong</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
        We encountered an unexpected error while loading this page. 
        Your secure data remains safe.
      </p>
      
      <Button 
        onClick={() => reset()}
        className="bg-primary-600 hover:bg-primary-700 text-white font-medium gap-2"
      >
        <RefreshCcw className="w-4 h-4" /> Try Again
      </Button>
    </div>
  );
}

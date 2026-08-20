"use client";

import { Monitor, LogOut, Loader2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export function ActiveSessionsCard() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignOutOthers = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      const { error } = await supabase.auth.signOut({ scope: 'others' });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to sign out of other devices:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-500">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">Active Sessions</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage devices logged into your account</p>
          </div>
        </div>
        <button 
          onClick={handleSignOutOthers}
          disabled={loading || success}
          className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : success ? (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          ) : (
            <LogOut className="w-4 h-4" />
          )}
          {success ? 'Signed Out' : 'Sign out other devices'}
        </button>
      </div>
      <div className="mt-2 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Current session: <span className="font-medium text-slate-900 dark:text-slate-300">This Device</span>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from 'react';
import { Key, Smartphone } from 'lucide-react';
import { ChangePasswordDialog } from './change-password-dialog';

export function AuthMethodsClient({ isMfaEnabled }: { isMfaEnabled: boolean }) {
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  return (
    <div className="md:col-span-2 mt-4 space-y-4">
      <h3 className="font-semibold text-slate-900 dark:text-white">Authentication Methods</h3>
      
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-primary-600 dark:text-primary-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">Password</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your master password</p>
          </div>
        </div>
        <button 
          onClick={() => setIsPasswordDialogOpen(true)}
          className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          Change
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl opacity-60">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-500">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{isMfaEnabled ? 'Enabled' : 'Not currently enabled (Coming Soon)'}</p>
          </div>
        </div>
        <button disabled className="px-4 py-2 text-sm font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-not-allowed">
          {isMfaEnabled ? 'Manage' : 'Enable'}
        </button>
      </div>
      
      <ChangePasswordDialog 
        isOpen={isPasswordDialogOpen} 
        onClose={() => setIsPasswordDialogOpen(false)} 
      />
    </div>
  );
}

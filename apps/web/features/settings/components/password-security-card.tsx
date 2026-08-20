"use client";

import { useState } from 'react';
import { Key } from 'lucide-react';
import { ChangePasswordDialog } from './change-password-dialog';

export function PasswordSecurityCard() {
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="flex items-center justify-between">
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
      </div>
      <ChangePasswordDialog 
        isOpen={isPasswordDialogOpen} 
        onClose={() => setIsPasswordDialogOpen(false)} 
      />
    </>
  );
}

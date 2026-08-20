"use client";

import { useState, useTransition } from 'react';
import { Mail, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { resendVerificationEmail } from '@/features/auth/actions/auth.actions';

interface EmailSecurityCardProps {
  email: string;
  isVerified: boolean;
}

export function EmailSecurityCard({ email, isVerified }: EmailSecurityCardProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleResend = () => {
    setMessage(null);
    startTransition(async () => {
      const res = await resendVerificationEmail(email);
      if (res?.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: 'Verification email sent!' });
      }
    });
  };

  return (
    <div className="flex flex-col p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">Email Address</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{email}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${isVerified ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'}`}>
          {isVerified ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5" />
              Verification Required
            </>
          )}
        </div>
      </div>

      {!isVerified && (
        <div className="mt-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Verify your email to fully secure your account.
            </p>
            <button 
              onClick={handleResend}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Resend Email'}
            </button>
          </div>
          {message && (
            <p className={`text-sm mt-3 ${message.type === 'error' ? 'text-rose-500' : 'text-emerald-500'}`}>
              {message.text}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

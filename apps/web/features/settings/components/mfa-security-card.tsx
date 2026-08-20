"use client";

import { Smartphone, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { MfaSetupDialog } from './mfa-setup-dialog';

export function MfaSecurityCard({ isMfaEnabled: initialMfaEnabled }: { isMfaEnabled: boolean }) {
  const [isMfaEnabled, setIsMfaEnabled] = useState(initialMfaEnabled);
  const [showSetup, setShowSetup] = useState(false);

  const [isDisabling, setIsDisabling] = useState(false);

  const handleDisableMfa = async () => {
    setIsDisabling(true);
    try {
      const { supabase } = await import('@/lib/supabase/client');
      const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
      
      if (listError) throw listError;
      
      if (factors?.totp) {
        const verifiedFactors = factors.totp.filter((f: any) => f.status === 'verified');
        for (const factor of verifiedFactors) {
          await supabase.auth.mfa.unenroll({ factorId: factor.id });
        }
      }
      setIsMfaEnabled(false);
    } catch (error) {
      console.error("Failed to disable MFA:", error);
      alert("Failed to disable Two-Factor Authentication.");
    } finally {
      setIsDisabling(false);
    }
  };

  return (
    <div className="flex flex-col p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${isMfaEnabled ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500' : 'bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400'}`}>
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isMfaEnabled ? 'Authenticator App Enabled' : 'Additional authentication protection'}
            </p>
          </div>
        </div>
        {isMfaEnabled ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Enabled
            </div>
            <button 
              onClick={handleDisableMfa}
              disabled={isDisabling}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isDisabling ? 'Disabling...' : 'Disable'}
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowSetup(true)}
            className="px-4 py-1.5 bg-[#10b981] hover:bg-[#059669] text-white text-sm font-medium rounded-lg transition-colors"
          >
            Enable 2FA
          </button>
        )}
      </div>
      <div className="mt-2 pt-4 border-t border-slate-100 dark:border-slate-800">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {isMfaEnabled 
            ? "Your account is protected by an extra layer of security. You will be prompted for a code when signing in."
            : "Protect your account by requiring a 6-digit code from your authenticator app when signing in."}
        </p>
      </div>

      {showSetup && (
        <MfaSetupDialog 
          onClose={() => setShowSetup(false)} 
          onComplete={() => {
            setShowSetup(false);
            setIsMfaEnabled(true);
          }} 
        />
      )}
    </div>
  );
}

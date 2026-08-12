import { createClient } from '@/lib/supabase/server';
import { getSecurityScore } from '@/features/dashboard/services/security-score.service';
import { Check, AlertTriangle, Shield, ShieldAlert, Key, Smartphone, Monitor } from 'lucide-react';
import { AuthMethodsClient } from '@/features/settings/components/auth-methods-client';

export const metadata = {
  title: 'Security Settings | MySafeVault',
};

export default async function SecuritySettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  const securityData = await getSecurityScore(user.id);
  const isEmailVerified = !!user.email_confirmed_at;
  const isMfaEnabled = user.app_metadata?.providers?.includes('totp') || false; // Approximation depending on how MFA is set up in Supabase

  let scoreColor = 'text-green-600 dark:text-green-400';
  if (securityData.score < 50) scoreColor = 'text-red-600 dark:text-red-400';
  else if (securityData.score < 80) scoreColor = 'text-amber-600 dark:text-amber-400';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold font-outfit text-slate-900 dark:text-white">Security Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your account security and authentication methods.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        
        {/* Security Score */}
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center justify-center">
          <Shield className={`w-16 h-16 ${scoreColor} mb-4`} />
          <h3 className="text-4xl font-bold font-outfit text-slate-900 dark:text-white mb-2">{securityData.score}/100</h3>
          <p className={`font-semibold ${scoreColor} uppercase tracking-wider text-sm`}>{securityData.label}</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 max-w-[250px]">
            Your overall vault security score based on items and account settings.
          </p>
        </div>

        {/* Security Recommendations */}
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-amber-500" /> Recommendations
          </h3>
          <div className="space-y-4 text-sm">
            {isEmailVerified ? (
              <div className="flex gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-slate-600 dark:text-slate-300">Email verified</span>
              </div>
            ) : (
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-slate-600 dark:text-slate-300">Verify your email address</span>
              </div>
            )}
            
            {securityData.passes.map((pass, i) => (
              <div key={i} className="flex gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-slate-600 dark:text-slate-300">{pass}</span>
              </div>
            ))}
            {securityData.warnings.map((warning, i) => (
              <div key={i} className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-slate-600 dark:text-slate-300">{warning}</span>
              </div>
            ))}
            
            {!isMfaEnabled && (
               <div className="flex gap-3">
                 <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                 <span className="text-slate-600 dark:text-slate-300">Enable Two-Factor Authentication (2FA)</span>
               </div>
            )}
          </div>
        </div>

        {/* Authentication Methods */}
        <AuthMethodsClient isMfaEnabled={isMfaEnabled} />
      </div>
    </div>
  );
}

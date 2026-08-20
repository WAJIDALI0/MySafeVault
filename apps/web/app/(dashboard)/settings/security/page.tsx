import { createClient } from '@/lib/supabase/server';
import { getSecurityScore } from '@/features/dashboard/services/security-score.service';
import { Check, AlertTriangle, Shield, ShieldAlert, Key, Smartphone, Monitor } from 'lucide-react';
import { PasswordSecurityCard } from '@/features/settings/components/password-security-card';
import { MfaSecurityCard } from '@/features/settings/components/mfa-security-card';
import { BiometricsSecurityCard } from '@/features/settings/components/biometrics-security-card';
import { ActiveSessionsCard } from '@/features/settings/components/active-sessions-card';
import { EmailSecurityCard } from '@/features/settings/components/email-security-card';
import { SecurityActivityList } from '@/features/settings/components/security-activity-list';
import { prisma } from '@/lib/prisma/client';

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
  
  const { data: mfaData } = await supabase.auth.mfa.listFactors();
  const isMfaEnabled = mfaData?.totp?.some(factor => factor.status === 'verified') || false;
  
  const biometricsCount = await prisma.webAuthnCredential.count({
    where: { profile_id: user.id }
  });
  const hasBiometrics = biometricsCount > 0;

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
        
        {/* Unified Premium Security Status Header */}
        <div className="md:col-span-2 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Circular Score */}
          <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
             <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" fill="none" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="12" />
                <circle 
                  cx="80" cy="80" r="70" fill="none" 
                  stroke="currentColor" 
                  strokeWidth="12" 
                  strokeDasharray="440" 
                  strokeDashoffset={440 * (1 - (securityData.score / 100))} 
                  strokeLinecap="round" 
                  className={`transition-all duration-1000 ease-out ${scoreColor}`} 
                />
             </svg>
             <div className="text-center flex flex-col items-center">
               <span className="text-5xl font-bold font-outfit text-slate-900 dark:text-white leading-none mt-2">{securityData.score}</span>
               <span className="text-xs text-slate-500 font-medium mt-1">/100</span>
             </div>
             <div className={`absolute -bottom-3 bg-white dark:bg-slate-950 px-4 py-1 rounded-full text-sm font-bold border border-slate-200 dark:border-slate-800 ${scoreColor}`}>
               {securityData.label}
             </div>
          </div>
          
          <div className="flex-1 w-full mt-4 md:mt-0">
            <h3 className="text-xl font-bold font-outfit text-slate-900 dark:text-white mb-2">
               {securityData.score === 100 ? "Excellent Security 🛡️" : "Security Improvements Available"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              {securityData.score === 100 
                ? "Your account meets all currently implemented security checks. Outstanding job." 
                : "Address the following recommendations to improve your vault's security posture."}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {isEmailVerified ? (
                <div className="flex gap-3 bg-white dark:bg-slate-950/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800/50 opacity-70">
                  <Check className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Email verified</span>
                </div>
              ) : (
                <div className="flex gap-3 bg-white dark:bg-slate-950/50 p-3 rounded-xl border border-amber-200 dark:border-amber-900/30">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-200 font-medium">Verify your email address</span>
                </div>
              )}
              
              {!isMfaEnabled && (
                <div className="flex gap-3 bg-white dark:bg-slate-950/50 p-3 rounded-xl border border-amber-200 dark:border-amber-900/30">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-200 font-medium">Enable Two-Factor Authentication</span>
                </div>
              )}

              {securityData.warnings.map((warning, i) => (
                <div key={`warn-${i}`} className="flex gap-3 bg-white dark:bg-slate-950/50 p-3 rounded-xl border border-amber-200 dark:border-amber-900/30">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-200 font-medium">{warning}</span>
                </div>
              ))}
              
              {securityData.score !== 100 && securityData.passes.map((pass, i) => (
                <div key={`pass-${i}`} className="flex gap-3 bg-white dark:bg-slate-950/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800/50 opacity-70">
                  <Check className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{pass}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Account Security Cards */}
        <div className="md:col-span-2 mt-4 space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-white">Account Security</h3>
          <EmailSecurityCard 
            email={user.email || ''} 
            isVerified={isEmailVerified} 
          />
          <PasswordSecurityCard />
          <BiometricsSecurityCard hasBiometrics={hasBiometrics} />
          <MfaSecurityCard isMfaEnabled={isMfaEnabled} />
          <ActiveSessionsCard />
        </div>

        {/* Security Activity List */}
        <div className="md:col-span-2 mt-4">
          <SecurityActivityList />
        </div>
      </div>
    </div>
  );
}

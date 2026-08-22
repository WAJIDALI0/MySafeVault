"use client";

import { Fingerprint, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { startRegistration } from '@simplewebauthn/browser';
import { getWebAuthnRegistrationOptions, verifyWebAuthnRegistration, disableWebAuthn } from '@/features/auth/actions/webauthn.actions';

export function BiometricsSecurityCard({ hasBiometrics }: { hasBiometrics: boolean }) {
  const [isRegistered, setIsRegistered] = useState(hasBiometrics);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setIsRegistering(true);
    setError(null);
    try {
      // 1. Get options from server
      const options = await getWebAuthnRegistrationOptions(window.location.origin);
      
      // 2. Pass options to the browser to trigger Face ID / Touch ID
      const authResponse = await startRegistration({ optionsJSON: options });
      
      // 3. Send the response back to the server to verify and save
      const verificationResp = await verifyWebAuthnRegistration(authResponse, window.location.origin);
      
      if (verificationResp.success) {
        setIsRegistered(true);
      } else {
        setError("Verification failed on the server.");
      }
    } catch (err: any) {
      console.error("Biometric Registration Error:", err);
      // Usually user cancelled or device not supported
      if (err.name === 'NotAllowedError') {
        setError("Registration cancelled by user.");
      } else {
        setError(err.message || "Failed to register biometrics.");
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDisable = async () => {
    setIsDisabling(true);
    try {
      await disableWebAuthn();
      setIsRegistered(false);
    } catch (err: any) {
      setError(err.message || "Failed to disable biometrics.");
    } finally {
      setIsDisabling(false);
    }
  };

  return (
    <div className="flex flex-col p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${isRegistered ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-500' : 'bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400'}`}>
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">Biometric Login</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isRegistered ? 'Face ID / Fingerprint enabled' : 'Sign in with your device'}
            </p>
          </div>
        </div>
        {isRegistered ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Enabled
            </div>
            <button 
              onClick={handleDisable}
              disabled={isDisabling}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isDisabling ? 'Disabling...' : 'Disable'}
            </button>
          </div>
        ) : (
          <button 
            onClick={handleRegister}
            disabled={isRegistering}
            className="flex items-center gap-2 px-4 py-1.5 bg-[#10b981] hover:bg-[#059669] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isRegistering ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register Device"
            )}
          </button>
        )}
      </div>
      
      {error && (
        <div className="mt-2 mb-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-800/30">
          {error}
        </div>
      )}

      <div className="mt-2 pt-4 border-t border-slate-100 dark:border-slate-800">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {isRegistered 
            ? "Your device is registered. You can now use Fingerprint, Face ID, or Windows Hello to sign in."
            : "Use your device's built-in Face ID, Touch ID, or Windows Hello for lightning-fast, secure sign-ins."}
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShieldCheck,
  Lock,
  Unlock,
  Fingerprint,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  ShieldAlert,
  Smartphone,
  Key,
  ScanFace,
} from "lucide-react";
import { ResetPasscodeDialog } from "./reset-passcode-dialog";


interface PrivateVaultLockScreenProps {
  isConfigured: boolean;
  isBiometricsAvailable: boolean;
  recoveryKey?: string | null;
  onUnlockPasscode: (passcode: string) => Promise<void>;
  onUnlockBiometrics: () => Promise<void>;
  onSetupPasscode: (passcode: string) => Promise<void>;
  onVerifyBiometrics?: () => Promise<boolean | void>;
  onResetWithBiometrics?: (newPasscode: string) => Promise<void>;
  onResetWithRecoveryKey?: (recoveryKey: string, newPasscode: string) => Promise<void>;
  onEmergencyWipe?: () => Promise<void>;
}

export function PrivateVaultLockScreen({
  isConfigured,
  isBiometricsAvailable,
  recoveryKey,
  onUnlockPasscode,
  onUnlockBiometrics,
  onSetupPasscode,
  onVerifyBiometrics,
  onResetWithBiometrics,
  onResetWithRecoveryKey,
  onEmergencyWipe,
}: PrivateVaultLockScreenProps) {
  const [passcode, setPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInsecureContext, setIsInsecureContext] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isSecure =
        window.isSecureContext ||
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      const hasSubtle = Boolean(window.crypto?.subtle);
      if (!isSecure || !hasSubtle) {
        setIsInsecureContext(true);
      }
    }
  }, []);

  // First time setup handler
  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (passcode.length < 4) {
      setError("Master passcode must be at least 4 digits or characters.");
      return;
    }

    if (passcode !== confirmPasscode) {
      setError("Passcodes do not match. Please verify.");
      return;
    }

    try {
      setIsProcessing(true);
      await onSetupPasscode(passcode);
    } catch (err: any) {
      if (err?.message?.includes("crypto.subtle")) {
        setError(
          "Mobile browsers require HTTPS to enable hardware encryption and fingerprint biometrics. Please run 'pnpm dev:https'."
        );
      } else {
        setError(err.message || "Failed to set up Private Vault.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Unlock handler
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!passcode) {
      setError("Please enter your passcode.");
      return;
    }

    try {
      setIsProcessing(true);
      await onUnlockPasscode(passcode);
      setPasscode("");
    } catch (err: any) {
      setError(err.message || "Incorrect passcode.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Biometric unlock handler
  const handleBiometricClick = async () => {
    setError(null);
    try {
      setIsBiometricScanning(true);
      await onUnlockBiometrics();
    } catch (err: any) {
      setError(err.message || "Biometric unlock failed.");
    } finally {
      setIsBiometricScanning(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[520px] p-3 sm:p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Shield Header Icon */}
        <div className="flex flex-col items-center text-center mb-5 sm:mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 mb-3 sm:mb-4 animate-pulse">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Lock className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {isConfigured ? "Private Vault" : "Set Up Private Vault"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
            {isConfigured
              ? "End-to-end encrypted local folder. Locked with zero-knowledge security."
              : "Create a local master passcode to protect your most sensitive items offline."}
          </p>
          {isBiometricsAvailable && (
            <div className="inline-flex items-center gap-2 px-3 py-1 mt-2 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
              <div className="flex items-center gap-1">
                <ScanFace className="w-3.5 h-3.5" />
                <Fingerprint className="w-3.5 h-3.5" />
              </div>
              <span>Face ID & Fingerprint Supported</span>
            </div>
          )}
        </div>

        {isInsecureContext && (
          <div className="mb-4 p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 rounded-2xl text-amber-900 dark:text-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
              <Smartphone className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Mobile Phone HTTP Detected</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              Mobile browsers (Android/iOS) strictly disable <strong>Face ID & Fingerprint biometrics</strong> and{" "}
              <strong>WebCrypto hardware encryption</strong> on plain HTTP LAN IPs.
            </p>
            <div className="p-2.5 rounded-xl bg-amber-100/80 dark:bg-slate-800/90 font-mono text-[10px] text-amber-950 dark:text-amber-200 space-y-1">
              <div>
                1. In terminal run:{" "}
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  pnpm dev:https
                </span>
              </div>
              <div>
                2. On mobile open:{" "}
                <span className="font-bold text-blue-700 dark:text-blue-400">
                  https://{typeof window !== "undefined" ? window.location.hostname : "192.168.100.6"}:3001
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isConfigured ? (
          /* UNLOCK FORM */
          <form onSubmit={handleUnlock} className="space-y-4">
            {isBiometricsAvailable && (
              <button
                type="button"
                onClick={handleBiometricClick}
                disabled={isProcessing || isBiometricScanning}
                className="w-full relative group overflow-hidden rounded-2xl p-3.5 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 hover:from-emerald-900/80 hover:to-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 shadow-lg shadow-emerald-950/30 transition-all active:scale-[0.98] text-left flex items-center gap-3.5 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0 relative">
                  {isBiometricScanning ? (
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                  ) : (
                    <div className="relative flex items-center justify-center">
                      <ScanFace className="w-6 h-6 animate-pulse text-emerald-400" />
                      <Fingerprint className="w-3.5 h-3.5 text-emerald-300 absolute -bottom-1 -right-1" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>
                      {isBiometricScanning ? "Scanning Biometrics..." : "Unlock with Face ID / Fingerprint"}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-[11px] text-emerald-400/80 truncate">
                    {isBiometricScanning
                      ? "Verifying Face ID or fingerprint sensor..."
                      : "Face recognition, Windows Hello, or Fingerprint"}
                  </p>
                </div>
              </button>
            )}

            {isBiometricsAvailable && (
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                <span className="flex-shrink mx-3 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  or use passcode
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Master Passcode
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter vault passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  autoFocus
                  className="pr-10 h-11 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isProcessing || !passcode}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Decrypting Vault...
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  Unlock Vault
                </>
              )}
            </Button>

            {/* Forgot Passcode / Reset with Face or Fingerprint Link */}
            <div className="pt-2 flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => setResetDialogOpen(true)}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-emerald-500/10 cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  <ScanFace className="w-3.5 h-3.5" />
                  <Fingerprint className="w-3.5 h-3.5" />
                </div>
                <span>Forgot Passcode? Reset with Face / Fingerprint</span>
              </button>
            </div>
          </form>
        ) : (
          /* INITIAL SETUP FORM */
          <form onSubmit={handleSetup} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Create Master Passcode

              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 4 characters or PIN"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="pr-10 h-11 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Confirm Master Passcode
              </Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Repeat master passcode"
                value={confirmPasscode}
                onChange={(e) => setConfirmPasscode(e.target.value)}
                className="h-11 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl"
              />
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Items stored in your Private Vault are encrypted locally with this passcode using
                AES-256-GCM. An Emergency Recovery Key will also be created to recover access if you
                ever forget it.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isProcessing || !passcode || passcode !== confirmPasscode}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Initializing Security...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Activate Private Vault
                </>
              )}
            </Button>
          </form>
        )}
      </div>

      {/* Reset Passcode Modal */}
      <ResetPasscodeDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        isBiometricsAvailable={isBiometricsAvailable}
        onVerifyBiometrics={onVerifyBiometrics}
        onResetWithBiometrics={onResetWithBiometrics || (async () => {})}
        onResetWithRecoveryKey={onResetWithRecoveryKey || (async () => {})}
        onEmergencyWipe={onEmergencyWipe || (async () => {})}
      />
    </div>
  );
}


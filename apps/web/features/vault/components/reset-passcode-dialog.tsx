"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Fingerprint,
  Key,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Trash2,
  Sparkles,
  ScanFace,
} from "lucide-react";


interface ResetPasscodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isBiometricsAvailable: boolean;
  onVerifyBiometrics?: () => Promise<boolean | void>;
  onResetWithBiometrics: (newPasscode: string) => Promise<void>;
  onResetWithRecoveryKey: (recoveryKey: string, newPasscode: string) => Promise<void>;
  onEmergencyWipe: () => Promise<void>;
}

export function ResetPasscodeDialog({
  open,
  onOpenChange,
  isBiometricsAvailable,
  onVerifyBiometrics,
  onResetWithBiometrics,
  onResetWithRecoveryKey,
  onEmergencyWipe,
}: ResetPasscodeDialogProps) {
  const [activeTab, setActiveTab] = useState<"biometric" | "recovery" | "wipe">("biometric");
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [recoveryKey, setRecoveryKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isVerifyingBio, setIsVerifyingBio] = useState(false);
  const [isBioVerified, setIsBioVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetState = () => {
    setNewPasscode("");
    setConfirmPasscode("");
    setRecoveryKey("");
    setIsVerifyingBio(false);
    setIsBioVerified(false);
    setIsSubmitting(false);
    setError(null);
    setSuccess(false);
  };

  const handleModalClose = (isOpen: boolean) => {
    if (!isOpen) resetState();
    onOpenChange(isOpen);
  };

  // 1. Verify Biometrics
  const handleVerifyBiometrics = async () => {
    setError(null);
    try {
      setIsVerifyingBio(true);
      if (onVerifyBiometrics) {
        await onVerifyBiometrics();
      }
      setIsBioVerified(true);
    } catch (err: any) {
      setError(err?.message || "Biometric verification failed.");
      setIsBioVerified(false);
    } finally {
      setIsVerifyingBio(false);
    }
  };


  // 2. Submit New Passcode via Biometrics
  const handleSubmitBiometricReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPasscode.length < 4) {
      setError("Passcode must be at least 4 digits or characters.");
      return;
    }
    if (newPasscode !== confirmPasscode) {
      setError("Passcodes do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onResetWithBiometrics(newPasscode);
      setSuccess(true);
      setTimeout(() => {
        handleModalClose(false);
      }, 1200);
    } catch (err: any) {
      setError(err?.message || "Failed to reset passcode via biometrics.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Submit New Passcode via Recovery Key
  const handleSubmitRecoveryReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!recoveryKey.trim()) {
      setError("Please enter your emergency recovery key.");
      return;
    }
    if (newPasscode.length < 4) {
      setError("Passcode must be at least 4 digits or characters.");
      return;
    }
    if (newPasscode !== confirmPasscode) {
      setError("Passcodes do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onResetWithRecoveryKey(recoveryKey.trim(), newPasscode);
      setSuccess(true);
      setTimeout(() => {
        handleModalClose(false);
      }, 1200);
    } catch (err: any) {
      setError(err?.message || "Invalid recovery key.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Emergency Vault Wipe
  const handleWipeVault = async () => {
    if (!confirm("Are you sure? This will delete all local private vault items on this device. This action cannot be undone.")) {
      return;
    }
    try {
      setIsSubmitting(true);
      await onEmergencyWipe();
      handleModalClose(false);
    } catch (err: any) {
      setError(err?.message || "Failed to reset vault.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-md p-6 bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl">
        <DialogHeader className="text-center sm:text-left">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
              <Lock className="w-4 h-4" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
              Reset Master Passcode
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            Recover access to your Private Vault using platform biometrics or your emergency recovery key.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Selection */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl my-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setActiveTab("biometric"); setError(null); }}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "biometric"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <div className="flex items-center gap-1">
              <ScanFace className="w-3.5 h-3.5" />
              <Fingerprint className="w-3.5 h-3.5" />
            </div>
            <span>Face / Fingerprint</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("recovery"); setError(null); }}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "recovery"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Recovery Key</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("wipe"); setError(null); }}
            className={`py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
              activeTab === "wipe"
                ? "bg-red-500/10 text-red-600 dark:text-red-400 shadow-xs font-bold"
                : "text-slate-400 hover:text-red-500"
            }`}
            title="Emergency Reset"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Passcode successfully reset! Opening vault...</span>
          </div>
        )}

        {/* TAB 1: BIOMETRIC RESET (FACE / FINGERPRINT) */}
        {activeTab === "biometric" && (
          <div className="space-y-4 pt-1">
            {!isBioVerified ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10 relative">
                  <ScanFace className="w-7 h-7 animate-pulse" />
                  <Fingerprint className="w-4 h-4 text-emerald-400 absolute -bottom-1 -right-1" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Scan Face or Fingerprint to Authorize
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-xs mx-auto">
                    Verify biometric identity using your device sensor (Face ID, Windows Hello, or Fingerprint) to unlock and set a new master passcode.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={handleVerifyBiometrics}
                  disabled={isVerifyingBio}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  {isVerifyingBio ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Scanning Biometrics...
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5">
                        <ScanFace className="w-4 h-4" />
                        <span>Verify Face ID / Fingerprint</span>
                      </div>
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmitBiometricReset} className="space-y-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Biometric Identity Verified. Enter your new master passcode below.</span>
                </div>


                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    New Master Passcode
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 4 characters or PIN"
                      value={newPasscode}
                      onChange={(e) => setNewPasscode(e.target.value)}
                      autoFocus
                      className="pr-10 h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Confirm New Passcode
                  </Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat new master passcode"
                    value={confirmPasscode}
                    onChange={(e) => setConfirmPasscode(e.target.value)}
                    className="h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !newPasscode || newPasscode !== confirmPasscode}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl gap-2 shadow-md shadow-emerald-600/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating Security...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Save New Passcode & Unlock
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: RECOVERY KEY RESET */}
        {activeTab === "recovery" && (
          <form onSubmit={handleSubmitRecoveryReset} className="space-y-3.5 pt-1">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                16-Character Emergency Recovery Key
              </Label>
              <Input
                type="text"
                placeholder="MSV-XXXX-XXXX-XXXX-XXXX"
                value={recoveryKey}
                onChange={(e) => setRecoveryKey(e.target.value)}
                autoFocus
                className="h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs font-mono tracking-wider rounded-xl uppercase"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                New Master Passcode
              </Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 4 characters or PIN"
                value={newPasscode}
                onChange={(e) => setNewPasscode(e.target.value)}
                className="h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Confirm New Passcode
              </Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Repeat new master passcode"
                value={confirmPasscode}
                onChange={(e) => setConfirmPasscode(e.target.value)}
                className="h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs rounded-xl"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !recoveryKey || !newPasscode || newPasscode !== confirmPasscode}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl gap-2 shadow-md shadow-emerald-600/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Recovery Key...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  Verify & Reset Passcode
                </>
              )}
            </Button>
          </form>
        )}

        {/* TAB 3: EMERGENCY WIPE */}
        {activeTab === "wipe" && (
          <div className="space-y-3.5 pt-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Emergency Vault Re-initialization
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                If you have forgotten your master passcode and do not have access to biometric verification or your recovery key, you can reset your local vault. All current offline items will be permanently erased.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleWipeVault}
              disabled={isSubmitting}
              className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl gap-2 shadow-sm cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Wipe Vault & Reinitialize
            </Button>

          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

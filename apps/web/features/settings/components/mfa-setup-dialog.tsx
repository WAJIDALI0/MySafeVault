"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/lib/supabase/client";
import { X, Smartphone, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function MfaSetupDialog({ onClose, onComplete }: { onClose: () => void, onComplete: () => void }) {
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    async function setupMfa() {
      try {
        // Clean up any stale unverified factors from previous attempts
        const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
        if (listError) throw listError;

        if (factors?.totp) {
          const unverifiedFactors = factors.totp.filter((f: any) => f.status === 'unverified');
          for (const factor of unverifiedFactors) {
            const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId: factor.id });
            if (unenrollError) {
              console.error("Failed to unenroll stale factor:", unenrollError);
              // We don't throw here, just log, in case Supabase prevents unenrolling for some reason
            }
          }
        }

        const { data, error } = await supabase.auth.mfa.enroll({
          factorType: "totp",
          issuer: "MySafeVault",
          friendlyName: `MySafeVault-${Date.now()}`
        });
        
        if (error) {
          console.error("Enrollment error details:", error);
          throw error;
        }
        
        setFactorId(data.id);
        // Supabase returns an SVG string in qr_code, and the actual URI in uri.
        // Since we are using qrcode.react, we must pass the URI, not the SVG string!
        setQrCode(data.totp.uri);
      } catch (err: any) {
        setError(err.message || "Failed to setup MFA");
      } finally {
        setLoading(false);
      }
    }
    
    setupMfa();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId || code.length !== 6) return;
    
    setVerifying(true);
    setError(null);
    
    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) throw challenge.error;
      
      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code
      });
      
      if (verify.error) throw verify.error;
      
      onComplete();
    } catch (err: any) {
      setError(err.message || "Invalid code. Please try again.");
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-6">
          <div className="w-12 h-12 bg-[#10b981]/10 rounded-xl flex items-center justify-center mb-4">
            <Smartphone className="w-6 h-6 text-[#10b981]" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2 font-outfit">Enable Two-Factor Authentication</h2>
          <p className="text-sm text-slate-400 mb-6">
            Use an authenticator app like Google Authenticator or Authy to scan the QR code below.
          </p>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="text-sm">Generating secure QR code...</p>
            </div>
          ) : error && !factorId ? (
            <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-500 text-sm flex gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-xl mb-6">
                {qrCode && <QRCodeSVG value={qrCode} size={180} />}
              </div>
              
              <form onSubmit={handleVerify} className="w-full">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Enter the 6-digit code from your app
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white text-center text-lg tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 focus:border-transparent placeholder:tracking-normal"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={verifying || code.length !== 6}
                    className="bg-[#10b981] hover:bg-[#059669] text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {verifying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify'}
                  </button>
                </div>
                {error && (
                  <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

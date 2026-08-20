"use client";

import { useTransition, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";

export function MfaVerifyForm() {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const nextPath = searchParams.get('next') || '/dashboard';
  
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);

  useEffect(() => {
    async function loadFactors() {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) {
        setError(error.message);
        return;
      }
      
      const totpFactor = data.totp[0];
      if (!totpFactor) {
        setError("No TOTP factor found on this account.");
        return;
      }
      
      setFactorId(totpFactor.id);
    }
    
    loadFactors();
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId) return;
    
    startTransition(async () => {
      try {
        const challenge = await supabase.auth.mfa.challenge({ factorId });
        if (challenge.error) throw challenge.error;
        
        const verify = await supabase.auth.mfa.verify({
          factorId,
          challengeId: challenge.data.id,
          code
        });
        
        if (verify.error) throw verify.error;
        
        router.push(nextPath);
      } catch (err: any) {
        setError(err.message || "Invalid 2FA code.");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="code">Authenticator Code</Label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-slate-900 dark:text-white text-center text-xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 focus:border-transparent placeholder:tracking-normal"
          autoFocus
          disabled={!factorId}
        />
      </div>

      <Button type="submit" disabled={isPending || code.length !== 6 || !factorId} className="w-full">
        {isPending ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null}
        Verify & Continue
      </Button>
    </form>
  );
}

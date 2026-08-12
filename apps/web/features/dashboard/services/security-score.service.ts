import { prisma } from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";

export async function getSecurityScore(userId: string) {
  let score = 0;
  const warnings: string[] = [];
  const passes: string[] = [];
  
  // 1. Check Email Verification
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user?.email_confirmed_at) {
    score += 40;
    passes.push("Email is verified");
  } else {
    warnings.push("Email is not verified");
  }

  // 2. Check 2FA (Placeholder for Future Implementation)
  // For now, we'll assign some points if they have recent activity or MFA factors if Supabase exposes it.
  const { data: factors } = await supabase.auth.mfa.listFactors();
  const has2FA = factors && factors.all.length > 0;
  
  if (has2FA) {
    score += 20;
    passes.push("Two-factor authentication enabled");
  } else {
    warnings.push("Two-factor authentication is disabled");
  }

  // 3. Password Strength (Based on metadata if available)
  // We'll query passwords that have metadata indicating weakness
  const allPasswords = await prisma.vaultItem.findMany({
    where: { profile_id: userId, type: 'PASSWORD' },
    select: { metadata: true }
  });

  let weakCount = 0;
  
  if (allPasswords.length > 0) {
    allPasswords.forEach(p => {
      const meta = p.metadata as any;
      if (meta && meta.isWeak === true) {
        weakCount++;
      }
    });

    if (weakCount === 0) {
      score += 40;
      passes.push("No weak passwords detected");
    } else {
      // Partial credit
      score += Math.max(0, 40 - (weakCount * 10));
      warnings.push(`${weakCount} weak password(s) detected`);
    }
  } else {
    // If no passwords, grant the points by default to not penalize them
    score += 40;
    passes.push("No weak passwords detected");
  }

  return {
    score,
    warnings,
    passes,
    label: score >= 80 ? "Strong" : score >= 50 ? "Fair" : "Weak"
  };
}

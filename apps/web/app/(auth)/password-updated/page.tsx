"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PasswordUpdatedPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown <= 0) {
      router.push("/login");
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, router]);

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mb-2 animate-in zoom-in duration-300">
        <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-outfit text-slate-900 dark:text-white">
          Password updated!
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-sm">
          Your password has been changed successfully. Redirecting you to login...
        </p>
      </div>

      <div className="w-16 h-16 rounded-full border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center text-2xl font-bold text-slate-700 dark:text-slate-300">
        {countdown}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-500 mt-8">
        If you are not redirected, <Link href="/login" className="text-[#10B981] hover:underline">click here</Link>.
      </p>
    </div>
  );
}

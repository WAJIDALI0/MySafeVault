"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema } from "../schemas/auth.schema";
import { z } from "zod";
import { forgotPassword } from "../actions/auth.actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export function ForgotForm() {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, setError, formState: { errors } } = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = (data: z.infer<typeof ForgotPasswordSchema>) => {
    startTransition(async () => {
      const result = await forgotPassword(data);
      if (result?.error) {
        let errorMsg = typeof result.error === 'string' ? result.error : JSON.stringify(result.error);
        if (errorMsg === "{}" || errorMsg.trim() === "") {
          errorMsg = "Failed to send email. Please check your Supabase SMTP settings and rate limits.";
        }
        setError("root", { message: errorMsg });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errors.root && (
        <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
          {errors.root.message}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="you@example.com" 
          {...register("email")}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null}
        Send reset link
      </Button>

      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981]">
            ✓
          </div>
          <span className="text-sm font-medium">Remember your password?</span>
        </div>
        <Link href="/login" className="text-sm text-[#10B981] hover:underline flex items-center gap-1">
          Login to your account <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </form>
  );
}

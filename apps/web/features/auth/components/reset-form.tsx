"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "../schemas/auth.schema";
import { z } from "zod";
import { resetPassword } from "../actions/auth.actions";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";

export function ResetForm() {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, watch, setError, formState: { errors } } = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const password = watch("password", "");

  const onSubmit = (data: z.infer<typeof ResetPasswordSchema>) => {
    startTransition(async () => {
      const result = await resetPassword(data);
      if (result?.error) {
        setError("root", { message: result.error || "An unknown error occurred. Please try again." });
      }
    });
  };

  const hasLength = password.length >= 8;
  const hasNumber = /[0-9]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errors.root && (
        <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
          {errors.root.message}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <PasswordInput 
          id="password" 
          placeholder="••••••••••••" 
          {...register("password")}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <div className="text-sm space-y-2">
        <div className={`flex items-center gap-2 ${hasLength ? 'text-[#10B981]' : 'text-slate-400'}`}>
          <CheckCircle2 className="w-4 h-4" /> At least 8 characters
        </div>
        <div className={`flex items-center gap-2 ${hasNumber ? 'text-[#10B981]' : 'text-slate-400'}`}>
          <CheckCircle2 className="w-4 h-4" /> Include a number
        </div>
        <div className={`flex items-center gap-2 ${hasUpper ? 'text-[#10B981]' : 'text-slate-400'}`}>
          <CheckCircle2 className="w-4 h-4" /> Include an uppercase letter
        </div>
        <div className={`flex items-center gap-2 ${hasSpecial ? 'text-[#10B981]' : 'text-slate-400'}`}>
          <CheckCircle2 className="w-4 h-4" /> Include a special character
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <PasswordInput 
          id="confirmPassword" 
          placeholder="••••••••••••" 
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null}
        Reset password
      </Button>

      <div className="text-center">
        <Link href="/login" className="text-sm text-[#10B981] hover:underline">
          &larr; Back to login
        </Link>
      </div>
    </form>
  );
}

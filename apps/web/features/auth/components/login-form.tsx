"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../schemas/auth.schema";
import { z } from "zod";
import { login } from "../actions/auth.actions";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, setError, formState: { errors } } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    startTransition(async () => {
      const result = await login(data);
      if (result?.error) {
        let msg = result.error;
        if (msg === "Invalid login credentials") {
          msg = "Your email or password is incorrect. If you haven't registered yet, please sign up first.";
        }
        setError("root", { message: msg || "An unknown error occurred. Please try again." });
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
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput 
          id="password" 
          placeholder="••••••••••••" 
          {...register("password")}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="remember" className="rounded border-slate-300 text-[#10B981] focus:ring-[#10B981]" {...register("rememberMe")} />
          <Label htmlFor="remember" className="font-normal cursor-pointer text-slate-600 dark:text-slate-400">Remember me</Label>
        </div>
        <Link href="/forgot-password" className="text-sm text-[#10B981] hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null}
        Login
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-slate-950 px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button">
          Google
        </Button>
        <Button variant="outline" type="button">
          GitHub
        </Button>
      </div>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        Don't have an account? <Link href="/register" className="text-[#10B981] hover:underline">Sign up</Link>
      </p>
    </form>
  );
}

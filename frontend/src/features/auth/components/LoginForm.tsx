"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { Form } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLoginMutation } from "@/features/auth";
import { getAuthRedirect, getSafeRedirectPath } from "@/lib/auth-navigation";

import { AuthShell } from "./AuthShell";

/**
 * Login form with redirect-after-login support.
 * Uses `getSafeRedirectPath` to prevent open-redirect attacks.
 */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { success, error: showError } = useToast();
  const loginMutation = useLoginMutation();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      success("Logged in successfully!");
      
      const safeRedirect = getSafeRedirectPath(redirect);
      const target = safeRedirect || getAuthRedirect(response.user);

      router.push(target);
    } catch (err: unknown) {
      showError((err as Error).message || "Invalid email or password.");
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to your account"
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/register">Create one</Link>
        </p>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Form.Input
          control={form.control}
          name="email"
          label="Email address"
          type="email"
          placeholder="name@example.com"
          disabled={loginMutation.isPending}
        />
        
        <div className="space-y-2">
          <Form.Password
            control={form.control}
            name="password"
            label="Password"
            placeholder="••••••••"
            disabled={loginMutation.isPending}
          />
          <div className="flex justify-end">
            <Link 
              href="/forgot-password" 
              className="text-[9px] uppercase tracking-widest font-bold text-gray-400 hover:text-black transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 bg-black hover:bg-gray-900 text-white rounded-none text-[10px] uppercase tracking-[0.2em] font-bold transition-all disabled:opacity-50" 
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </AuthShell>
  );
}

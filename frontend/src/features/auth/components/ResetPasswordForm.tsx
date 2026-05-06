"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordInput } from "@/lib/validations/auth";
import { Form } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, CheckCircle, AlertCircle } from "lucide-react";
import { useResetPasswordMutation } from "@/features/auth";
import { AuthShell } from "./AuthShell";

/**
 * Reset password form with token validation and multi-state UI.
 * Handles: invalid token, form input, and success confirmation.
 */
export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const { success, error: showError } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (token) {
      form.setValue("token", token);
    }
  }, [token, form]);

  const resetPasswordMutation = useResetPasswordMutation();

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      showError("Invalid or missing reset token.");
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({ token: data.token, newPassword: data.newPassword });
      setSubmitted(true);
      success("Password reset successfully!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      showError((err as Error).message || "Failed to reset password.");
    }
  };

  // State: No Token
  if (!token) {
    return (
      <AuthShell
        title="Invalid Link"
        description="This reset link is invalid or has expired."
        icon={AlertCircle}
        footer={
          <Link href="/forgot-password">Request a new link</Link>
        }
      >
        <div className="bg-gray-50 p-4 border border-gray-100 text-sm text-gray-500 font-light tracking-wider">
          Password reset links are one-time use and expire after 1 hour.
        </div>
      </AuthShell>
    );
  }

  // State: Success
  if (submitted) {
    return (
      <AuthShell
        title="Password Reset"
        description="Your password has been updated. Redirecting to login..."
        icon={CheckCircle}
        footer={
          <Link href="/login">Go to sign in</Link>
        }
      >
        <div className="flex justify-center py-6">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-black"></div>
        </div>
      </AuthShell>
    );
  }

  // State: Form
  return (
    <AuthShell
      title="New Password"
      description="Choose a strong password for your account"
      icon={KeyRound}
      footer={
        <Link href="/login">Back to sign in</Link>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <input type="hidden" {...form.register("token")} />

        <Form.Password
          control={form.control}
          name="newPassword"
          label="New password"
          placeholder="••••••••"
          disabled={resetPasswordMutation.isPending}
        />
        
        <div className="bg-gray-50 p-4 border border-gray-100">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Requirements</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-[9px] text-gray-500 uppercase tracking-widest">
            <li className="flex items-center gap-1.5"><div className="size-1 bg-black rounded-full" /> 8+ Characters</li>
            <li className="flex items-center gap-1.5"><div className="size-1 bg-black rounded-full" /> Uppercase</li>
            <li className="flex items-center gap-1.5"><div className="size-1 bg-black rounded-full" /> Lowercase</li>
            <li className="flex items-center gap-1.5"><div className="size-1 bg-black rounded-full" /> Number</li>
          </ul>
        </div>

        <Form.Password
          control={form.control}
          name="confirmPassword"
          label="Confirm password"
          placeholder="••••••••"
          disabled={resetPasswordMutation.isPending}
        />

        <Button 
          type="submit" 
          className="w-full h-12 bg-black hover:bg-gray-900 text-white rounded-none text-[10px] uppercase tracking-[0.2em] font-bold transition-all disabled:opacity-50" 
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </AuthShell>
  );
}

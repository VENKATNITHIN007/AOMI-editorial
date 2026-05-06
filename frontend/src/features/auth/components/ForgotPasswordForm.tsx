"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/validations/auth";
import { Form } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForgotPasswordMutation } from "@/features/auth";
import { Mail, CheckCircle } from "lucide-react";
import { AuthShell } from "./AuthShell";

/**
 * Forgot password form with success state.
 * Shows a generic success message to prevent email enumeration attacks.
 */
export function ForgotPasswordForm() {
  const { success } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useForgotPasswordMutation();

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      await forgotPasswordMutation.mutateAsync(data.email);
      setSubmitted(true);
      success("Instructions sent!");
    } catch {
      // Generic success to prevent email enumeration
      setSubmitted(true);
    } finally {
      forgotPasswordMutation.reset();
    }
  };

  if (submitted) {
    return (
      <AuthShell
        title="Check your email"
        description="If an account exists with this email, you will receive reset instructions shortly."
        icon={CheckCircle}
        footer={
          <Link href="/login">Back to sign in</Link>
        }
      >
        <p className="text-center text-sm text-gray-400 font-light tracking-wider">
          Still don&apos;t see it? Check your spam folder or try another email.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset Password"
      description="Enter your email and we'll send you instructions"
      icon={Mail}
      footer={
        <Link href="/login">Back to sign in</Link>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Form.Input
          control={form.control}
          name="email"
          label="Email address"
          type="email"
          placeholder="name@example.com"
          disabled={forgotPasswordMutation.isPending}
        />
        <Button 
          type="submit" 
          className="w-full h-12 bg-black hover:bg-gray-900 text-white rounded-none text-[10px] uppercase tracking-[0.2em] font-bold transition-all disabled:opacity-50" 
          disabled={forgotPasswordMutation.isPending}
        >
          {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </AuthShell>
  );
}

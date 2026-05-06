"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { Form } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRegisterMutation, getAuthRedirect } from "@/features/auth";
import { AxiosError } from "axios";

import { AuthShell } from "./AuthShell";
import Link from "next/link";

/**
 * Registration form.
 * Creates a new user account and redirects to email verification.
 */
export function RegisterForm() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const registerMutation = useRegisterMutation();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const response = await registerMutation.mutateAsync({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      
      const target = getAuthRedirect(response.user);
      router.push(target);
      
      success("Account created. Please verify your email.");
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        showError(err.response.data.message);
      } else {
        showError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <AuthShell
      title="Create account"
      description="Join Photophile and showcase your portfolio"
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login">Sign in</Link>
        </p>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Form.Input
          control={form.control}
          name="fullName"
          label="Full Name"
          placeholder="John Doe"
          disabled={registerMutation.isPending}
        />
        <Form.Input
          control={form.control}
          name="email"
          label="Email address"
          type="email"
          placeholder="name@example.com"
          disabled={registerMutation.isPending}
        />
        <Form.Password
          control={form.control}
          name="password"
          label="Password"
          placeholder="••••••••"
          disabled={registerMutation.isPending}
        />
        <Form.Password
          control={form.control}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="••••••••"
          disabled={registerMutation.isPending}
        />
        <Button 
          type="submit" 
          className="w-full h-12 bg-black hover:bg-gray-900 text-white rounded-none text-[10px] uppercase tracking-[0.2em] font-bold transition-all disabled:opacity-50" 
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </AuthShell>
  );
}

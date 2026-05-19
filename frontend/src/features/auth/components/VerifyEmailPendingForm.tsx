"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, RefreshCw } from "lucide-react";
import { useAuth, useCurrentUserQuery, useSendVerificationEmailMutation } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AuthShell } from "./AuthShell";
import { getErrorMessage } from "@/lib/error-utils";

/**
 * Verification pending screen.
 * Shows the user's email and provides resend + manual check options.
 */
export function VerifyEmailPendingForm() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const { user, loading, isEmailVerified } = useAuth();
  const resendMutation = useSendVerificationEmailMutation();
  const { refetch, isFetching } = useCurrentUserQuery(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (!loading && user && isEmailVerified) {
      router.push("/profile");
    }
  }, [loading, user, isEmailVerified, router]);

  const handleResend = async () => {
    if (!user?.email) return;
    try {
      await resendMutation.mutateAsync(user.email);
      success("Verification email sent!");
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Failed to resend."));
    }
  };

  const handleCheckAgain = async () => {
    try {
      setChecking(true);
      const result = await refetch();
      if (result.data?.isEmailVerified) {
        success("Email verified!");
        router.push("/profile");
        return;
      }
      showError("Still unverified. Please click the link in your email.");
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Failed to refresh."));
    } finally {
      setChecking(false);
    }
  };

  if (loading || !user) {
    return (
      <AuthShell title="Loading" icon={RefreshCw}>
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-black"></div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Verify Email"
      description={`We sent a verification link to ${user.email}`}
      icon={Mail}
      footer={<Link href="/login">Back to sign in</Link>}
    >
      <div className="space-y-6">
        <p className="text-center text-sm text-gray-400 font-light tracking-wider">
          You must verify your email before accessing your studio.
        </p>

        <div className="p-4 border border-dashed border-gray-200 bg-gray-50/30 text-center rounded-none space-y-1">
          <p className="text-[9px] uppercase tracking-[0.15em] font-black text-black">
            Didn't receive the email?
          </p>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            Please check your <strong>Spam or Junk folder</strong>. Verification emails sent from sandbox servers are sometimes filtered there.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button 
            className="w-full h-12 bg-black hover:bg-gray-900 text-white rounded-none text-[10px] uppercase tracking-[0.2em] font-bold disabled:opacity-50" 
            onClick={handleResend} 
            disabled={resendMutation.isPending}
          >
            {resendMutation.isPending ? "Sending..." : "Resend Verification Email"}
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 rounded-none text-[10px] uppercase tracking-[0.2em] font-bold border-gray-200 disabled:opacity-50"
            onClick={handleCheckAgain}
            disabled={checking || isFetching}
          >
            <RefreshCw className={`mr-2 size-3 ${checking || isFetching ? "animate-spin" : ""}`} />
            I Have Verified My Email
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}

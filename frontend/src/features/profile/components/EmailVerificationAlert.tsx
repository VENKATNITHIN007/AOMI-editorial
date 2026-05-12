"use client";

import { useState } from "react";
import { AlertTriangle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useSendVerificationEmailMutation } from "@/features/auth";
import { useToast } from "@/hooks/use-toast";

export function EmailVerificationAlert() {
  const { user, isEmailVerified } = useAuth();
  const sendVerificationEmailMutation = useSendVerificationEmailMutation();
  const { success: showSuccess, error: showError } = useToast();
  const [resendingEmail, setResendingEmail] = useState(false);

  if (isEmailVerified || !user) return null;

  const handleResendVerification = async () => {
    try {
      setResendingEmail(true);
      if (!user.email) throw new Error("User email not available");
      await sendVerificationEmailMutation.mutateAsync(user.email);
      showSuccess("Verification email sent", "Check your inbox for the verification link");
    } catch {
      showError("Failed to send verification email", "Please try again later");
    } finally {
      setResendingEmail(false);
    }
  };

  return (
    <div className="border border-amber-200 bg-amber-50/50 p-5 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-900">Email Not Verified</p>
            <p className="text-xs text-amber-700 mt-1.5 leading-relaxed">Please verify your email address to unlock premium studio features.</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResendVerification}
          disabled={resendingEmail}
          className="shrink-0 border-amber-200 text-amber-700 hover:bg-amber-100 hover:text-amber-800 text-[10px] uppercase tracking-[0.15em] font-bold h-11 px-6 rounded-none w-full sm:w-auto transition-all"
        >
          {resendingEmail ? (
            <><Mail className="mr-2 h-3.5 w-3.5 animate-pulse" />Sending...</>
          ) : (
            <><Mail className="mr-2 h-3.5 w-3.5" />Resend Verification</>
          )}
        </Button>
      </div>
    </div>
  );
}

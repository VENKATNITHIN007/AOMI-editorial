"use client";

import { useState } from "react";
import { useAuth, useSendVerificationEmailMutation } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProfileForm } from "./ProfileForm";
import { BecomePhotographerCTA } from "./BecomePhotographerCTA";

export function ProfilePage() {
  const { user, isEmailVerified } = useAuth();
  const sendVerificationEmailMutation = useSendVerificationEmailMutation();
  const { success: showSuccess, error: showError } = useToast();
  const [resendingEmail, setResendingEmail] = useState(false);

  const handleResendVerification = async () => {
    try {
      setResendingEmail(true);
      if (!user?.email) throw new Error("User email not available");
      await sendVerificationEmailMutation.mutateAsync(user.email);
      showSuccess("Verification email sent", "Check your inbox for the verification link");
    } catch {
      showError("Failed to send verification email", "Please try again later");
    } finally {
      setResendingEmail(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full space-y-8">
      <div>
        <h1 className="text-3xl font-light uppercase tracking-[0.15em] text-black">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-gray-400 font-light tracking-wider">
          Manage your personal details and communication preferences.
        </p>
      </div>

      {!isEmailVerified && (
        <div className="border border-amber-200 bg-amber-50/50 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-start gap-3 flex-1">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-900">Email Not Verified</p>
                <p className="text-xs text-amber-700 mt-1">Please verify your email address to unlock all features.</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendVerification}
              disabled={resendingEmail}
              className="shrink-0 border-amber-200 text-amber-700 hover:bg-amber-100 hover:text-amber-800 text-[10px] uppercase tracking-[0.15em] font-bold h-10 px-5"
            >
              {resendingEmail ? (
                <><Mail className="mr-2 h-3 w-3 animate-pulse" />Sending...</>
              ) : (
                <><Mail className="mr-2 h-3 w-3" />Resend</>
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="border border-gray-100 bg-white p-8 sm:p-10">
        <div className="border-b border-gray-50 pb-6 mb-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Profile Details</h2>
        </div>

        <ProfileForm />

        {user?.role === "user" && (
          <div className="pt-8 border-t border-gray-50 mt-8">
            <BecomePhotographerCTA />
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useVerifyEmailMutation } from "@/features/auth";
import { getErrorMessage } from "@/lib/error-utils";
import { AuthShell } from "./AuthShell";
import { Button } from "@/components/ui/button";

/**
 * Handles the email verification callback.
 * Automatically verifies the token from the URL and shows the result.
 */
export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const { mutateAsync } = useVerifyEmailMutation();

  const [status, setStatus] = useState<"loading" | "success" | "error" | "invalid">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      setMessage("Invalid or missing verification token.");
      return;
    }

    const verifyEmail = async () => {
      try {
        await mutateAsync(token);
        setStatus("success");
        setMessage("Your email has been verified successfully!");
        setTimeout(() => router.push("/profile"), 2000);
      } catch (err: unknown) {
        setStatus("error");
        setMessage(getErrorMessage(err, "Failed to verify email."));
      }
    };

    verifyEmail();
  }, [token, mutateAsync, router]);

  if (status === "loading") {
    return (
      <AuthShell title="Verifying" description="Please wait while we verify your account" icon={Loader2}>
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-black"></div>
        </div>
      </AuthShell>
    );
  }

  if (status === "invalid" || status === "error") {
    return (
      <AuthShell 
        title="Verification Failed" 
        description={message} 
        icon={AlertCircle}
        footer={<Link href="/login">Back to sign in</Link>}
      >
        <Button asChild className="w-full h-12 bg-black hover:bg-gray-900 text-white rounded-none text-[10px] uppercase tracking-[0.2em] font-bold">
          <Link href="/login">Back to Sign In</Link>
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell 
      title="Verified" 
      description={message} 
      icon={CheckCircle}
      footer={<Link href="/profile">Go to profile</Link>}
    >
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-black"></div>
        <p className="text-sm text-gray-400 font-light tracking-wider">
          Redirecting...
        </p>
      </div>
    </AuthShell>
  );
}

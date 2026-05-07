"use client";

import { useState } from "react";
import { useAuth, useSendVerificationEmailMutation } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Mail, Edit2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProfileForm } from "./ProfileForm";
import { BecomePhotographerCTA } from "./BecomePhotographerCTA";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ProfilePage() {
  const { user, isEmailVerified } = useAuth();
  const sendVerificationEmailMutation = useSendVerificationEmailMutation();
  const { success: showSuccess, error: showError } = useToast();
  const [resendingEmail, setResendingEmail] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
    <div className="max-w-3xl mx-auto w-full space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-light uppercase tracking-[0.1em] text-black">
          Account Settings
        </h1>
        <p className="mt-2 text-sm text-gray-400 font-light tracking-wider">
          Manage your personal details and communication preferences.
        </p>
      </div>

      {!isEmailVerified && (
        <div className="border border-amber-200 bg-amber-50/50 p-5">
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
              className="shrink-0 border-amber-200 text-amber-700 hover:bg-amber-100 hover:text-amber-800 text-[10px] uppercase tracking-[0.15em] font-bold h-11 px-6 rounded-none w-full sm:w-auto"
            >
              {resendingEmail ? (
                <><Mail className="mr-2 h-3.5 w-3.5 animate-pulse" />Sending...</>
              ) : (
                <><Mail className="mr-2 h-3.5 w-3.5" />Resend Verification</>
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="border border-gray-100 bg-white">
        <div className="p-6 sm:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-50 gap-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Profile Details</h2>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-10 px-6 rounded-none text-[10px] uppercase tracking-[0.15em] font-bold border-gray-200 hover:bg-gray-50 w-full sm:w-auto">
                <Edit2 className="mr-2 h-3 w-3" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader className="mb-6">
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your personal details and public avatar.
                </DialogDescription>
              </DialogHeader>
              <ProfileForm onSuccess={() => setIsEditDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Read Mode View */}
        <div className="p-6 sm:p-10 space-y-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
            <div className="shrink-0 size-28 sm:size-32 border border-black bg-gray-50 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name || "User avatar"} className="w-full h-full object-cover" />
              ) : (
                <User className="size-10 text-gray-300" strokeWidth={1} />
              )}
            </div>
            <div className="space-y-2 pt-2">
              <h3 className="text-2xl sm:text-3xl font-light tracking-wide text-black">{user?.name || "No Name Set"}</h3>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12 pt-10 border-t border-gray-50">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Phone Number</p>
              <p className="text-sm sm:text-base font-light text-black tracking-wide">{user?.phoneNumber || "Not provided"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Account Role</p>
              <p className="text-sm sm:text-base font-light text-black tracking-wide capitalize">{user?.role || "User"}</p>
            </div>
          </div>
        </div>
      </div>

      {user?.role === "user" && (
        <BecomePhotographerCTA />
      )}
    </div>
  );
}

"use client";

import { useAuth } from "@/features/auth";
import { ProfileInfoCard } from "./components/ProfileInfoCard";
import { EmailVerificationAlert } from "./components/EmailVerificationAlert";
import { StudioCTA } from "@/components/StudioCTA";

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto w-full space-y-10 animate-in fade-in duration-500 pt-6">
      {/* Minimal Title */}
      <div className="px-2">
        <h1 className="text-2xl font-bold tracking-tight text-black uppercase">
          Profile Settings
        </h1>
      </div>

      {/* Verification Notification */}
      <EmailVerificationAlert />

      {/* INTEGRATED CARD */}
      <ProfileInfoCard />

      {/* Studio CTA */}
      {user?.role === "user" && (
        <div className="pt-4">
          <StudioCTA />
        </div>
      )}
    </div>
  );
}

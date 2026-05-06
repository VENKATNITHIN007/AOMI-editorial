"use client";

import { RoleGate } from "@/components/guards/RoleGate";
import { OnboardPage } from "@/features/onboarding";

export default function PhotographerOnboardingPage() {
  return (
    <RoleGate allowedRoles={["user"]} redirectTo="/photographer/dashboard">
      <OnboardPage />
    </RoleGate>
  );
}

"use client";

import { RoleGate } from "@/components/guards/RoleGate";
import { Onboarding } from "@/features/onboarding/Onboarding";

export default function PhotographerOnboardingPage() {
  return (
    <RoleGate allowedRoles={["user", "photographer"]} redirectTo="/photographer/dashboard">
      <Onboarding />
    </RoleGate>
  );
}

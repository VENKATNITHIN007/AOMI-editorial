"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryKeys } from "@/lib/query/keys";
import { useCreateProfileMutation } from "@/features/photographer-studio/studio.queries";
import type { PhotographerOnboardingInput } from "@/lib/validations/photographer";

/**
 * Simplified Onboarding Hook.
 * Handles the single-step profile creation and role update.
 */
export function useOnboarding() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  const createProfileMutation = useCreateProfileMutation();

  const handleDetailsSubmit = async (data: PhotographerOnboardingInput) => {
    try {
      await createProfileMutation.mutateAsync({
        username: data.username,
        location: data.location,
        specialties: data.specialties,
        priceFrom: data.priceFrom ? Number(data.priceFrom) : undefined,
        bio: data.bio || undefined,
        instagram: data.instagram || undefined,
      });

      // Invalidate session to reflect the NEW ROLE (photographer)
      await queryClient.invalidateQueries({ queryKey: queryKeys.session() });
      
      success("Welcome to the Studio! Your profile is live.");
      
      // Redirect to the dashboard
      router.replace("/photographer/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to launch studio";
      showError(message);
    }
  };

  return {
    isSavingDetails: createProfileMutation.isPending,
    handleDetailsSubmit,
  };
}

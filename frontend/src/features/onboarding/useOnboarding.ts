"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryKeys } from "@/lib/query/keys";
import { 
  useCreateProfileMutation, 
  useUploadPortfolioImageMutation 
} from "@/features/photographer-studio/studio.queries";
import type { PhotographerOnboardingInput } from "@/lib/validations/photographer";

export type OnboardingStep = 1 | 2 | 3;

export function useOnboarding() {
  const [step, setStep] = useState<OnboardingStep>(1);
  const [isUploading, setIsUploading] = useState(false);
  
  const router = useRouter();
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  const createProfileMutation = useCreateProfileMutation();
  const uploadMutation = useUploadPortfolioImageMutation();

  const handleNext = () => setStep((prev) => (prev + 1) as OnboardingStep);

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
      handleNext();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create profile";
      showError(message);
    }
  };

  const handlePortfolioComplete = async (selectedFiles: File[]) => {
    try {
      if (selectedFiles.length === 0) {
        await finalizeOnboarding("Studio created! You can add photos later.");
        return;
      }

      setIsUploading(true);
      
      // Upload each file using the unified mutation (which uploads to Cloudinary + creates record)
      const uploadPromises = selectedFiles.map(file => 
        uploadMutation.mutateAsync({ file, purpose: "gallery" })
      );
      
      await Promise.all(uploadPromises);
      
      await finalizeOnboarding("Studio created with initial portfolio!");
      
    } catch {
      showError("Setup completed with some upload issues. You can fix them in your dashboard.");
      await finalizeOnboarding();
    } finally {
      setIsUploading(false);
    }
  };

  const finalizeOnboarding = async (message?: string) => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.session() });
    if (message) success(message);
    router.replace("/photographer/dashboard");
  };

  return {
    step,
    isUploading,
    isSavingDetails: createProfileMutation.isPending,
    handleNext,
    handleDetailsSubmit,
    handlePortfolioComplete,
  };
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryKeys } from "@/lib/query/keys";
import { 
  useCreateProfileMutation, 
  useAddMultiplePortfolioItemsMutation, 
  useUploadFileMutation 
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
  const addPortfolioMutation = useAddMultiplePortfolioItemsMutation();
  const uploadMutation = useUploadFileMutation();

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
    } catch (err: any) {
      showError(err.message || "Failed to create profile");
    }
  };

  const handlePortfolioComplete = async (selectedFiles: File[]) => {
    try {
      if (selectedFiles.length === 0) {
        await finalizeOnboarding("Studio created! You can add photos later.");
        return;
      }

      setIsUploading(true);
      
      const uploadPromises = selectedFiles.map(file => 
        uploadMutation.mutateAsync({ file, folder: "portfolio" })
      );
      const uploadedResults = await Promise.all(uploadPromises);
      
      const items = uploadedResults.map(res => ({
        mediaUrl: res.url,
        mediaType: "image" as const,
      }));
      
      await addPortfolioMutation.mutateAsync({ items });
      await finalizeOnboarding("Studio created with initial portfolio!");
      
    } catch (err: any) {
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

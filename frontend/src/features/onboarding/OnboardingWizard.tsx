"use client";

import { useOnboarding } from "./useOnboarding";
import { OnboardingProgress } from "./OnboardingProgress";
import { OnboardingIntro } from "./OnboardingIntro";
import { OnboardingDetailsForm } from "./OnboardingDetailsForm";
import { OnboardingPortfolioUpload } from "./OnboardingPortfolioUpload";

/**
 * Onboarding Wizard Component.
 * Orchestrates the multi-step onboarding flow.
 */
export function OnboardingWizard() {
  const { 
    step, 
    isUploading, 
    isSavingDetails, 
    handleNext, 
    handleDetailsSubmit, 
    handlePortfolioComplete 
  } = useOnboarding();

  return (
    <div className="space-y-12">
      <OnboardingProgress step={step} />

      <div className="mt-8">
        {step === 1 && (
          <OnboardingIntro onNext={handleNext} />
        )}
        
        {step === 2 && (
          <OnboardingDetailsForm 
            onSubmit={handleDetailsSubmit} 
            isPending={isSavingDetails} 
          />
        )}

        {step === 3 && (
          <OnboardingPortfolioUpload 
            onComplete={handlePortfolioComplete} 
            isUploading={isUploading} 
          />
        )}
      </div>
    </div>
  );
}

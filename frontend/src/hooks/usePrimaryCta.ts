import { useAuth } from "@/features/auth";
import { NAV_PATHS, STUDIO_CTA } from "@/lib/constants/nav";

/**
 * Hook to determine the primary Call-To-Action (CTA) for the user.
 * 
 * Logic:
 * - Guest: Send to Register ("Start Studio")
 * - Logged-in User: Send to Onboarding ("Complete Studio Setup")
 * - Photographer: Send to Dashboard ("Studio Dashboard")
 */
export function usePrimaryCta() {
  const { user, loading } = useAuth();

  // Handle loading state
  if (loading) {
    return { 
      label: "...", 
      path: "#", 
      isLoading: true 
    };
  }

  // Case 1: Guest (Not logged in)
  if (!user) {
    return { 
      label: STUDIO_CTA.LABEL, 
      path: NAV_PATHS.REGISTER,
      isLoading: false 
    };
  }

  // Case 2: Photographer (Onboarding complete)
  if (user.role === "photographer") {
    return { 
      label: "Go to Dashboard", 
      path: NAV_PATHS.DASHBOARD,
      isLoading: false 
    };
  }

  // Case 3: Registered User (Needs to onboard)
  return { 
    label: "Complete Studio Setup", 
    path: NAV_PATHS.ONBOARDING,
    isLoading: false 
  };
}

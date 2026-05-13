import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPhotographerProfile,
  updatePhotographerProfile,
  uploadAndCreatePortfolioImage,
  setPortfolioItemPurpose,
  deletePortfolioItems,
  getMyPhotographerProfile,
} from "./studio.api";
import { queryKeys } from "@/lib/query/keys";

// ── Profile Queries & Mutations ────────────────────────────────────────────

/** Fetch the current photographer's own profile (dashboard). */
export function useMyProfileQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.myPhotographerProfile(),
    queryFn: getMyPhotographerProfile,
    enabled: options?.enabled,
    retry: false, // Don't retry if profile is missing
  });
}


/** Onboarding – create a new photographer profile. */
export function useCreateProfileMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPhotographerProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.myPhotographerProfile() });
      // Role may change after becoming a photographer
      qc.invalidateQueries({ queryKey: queryKeys.session() });
    },
  });
}

/** Update the current photographer's profile (bio, location, price). */
export function useUpdateStudioProfileMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updatePhotographerProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.myPhotographerProfile() });
    },
  });
}

// ── Portfolio Queries & Mutations ──────────────────────────────────────────

/** Upload and create a portfolio image in "One Trip". */
export function useUploadPortfolioImageMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, purpose }: { file: File; purpose?: string }) =>
      uploadAndCreatePortfolioImage(file, purpose),
    onSuccess: () => {
      // Refresh the entire profile package because it includes the images
      qc.invalidateQueries({ queryKey: queryKeys.myPhotographerProfile() });
    },
  });
}

/** Set a portfolio item's purpose (Promote to Hero/About). */
export function useSetPortfolioItemPurposeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, purpose }: { itemId: string; purpose: string }) =>
      setPortfolioItemPurpose(itemId, purpose),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.myPhotographerProfile() });
    },
  });
}

/** Delete portfolio items (Single or Batch). */
export function useDeletePortfolioItemsMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemIds: string[]) => deletePortfolioItems(itemIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.myPhotographerProfile() });
    },
  });
}

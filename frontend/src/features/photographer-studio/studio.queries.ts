import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPhotographerProfile,
  updatePhotographerProfile,
  uploadPortfolioImage,
  deletePortfolioItems,
  getMyPhotographerProfile,
  type UploadPortfolioImagePayload,
} from "./studio.api";
import { queryKeys } from "@/lib/query/keys";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Invalidate the full profile package (profile + images). */
const useRefreshProfile = () => {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: queryKeys.myPhotographerProfile() });
};

// ── Profile ───────────────────────────────────────────────────────────────────

/** Fetch the authenticated photographer's own studio profile. */
export function useMyProfileQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.myPhotographerProfile(),
    queryFn: getMyPhotographerProfile,
    enabled: options?.enabled,
    retry: false,
  });
}

/** Create a new photographer profile (onboarding). */
export function useCreateProfileMutation() {
  const refreshProfile = useRefreshProfile();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPhotographerProfile,
    onSuccess: () => {
      refreshProfile();
      // Role may change after becoming a photographer
      qc.invalidateQueries({ queryKey: queryKeys.session() });
    },
  });
}

/** Update profile metadata (bio, location, price, tagline…). */
export function useUpdateStudioProfileMutation() {
  const refreshProfile = useRefreshProfile();
  return useMutation({
    mutationFn: updatePhotographerProfile,
    onSuccess: refreshProfile,
  });
}

// ── Portfolio ─────────────────────────────────────────────────────────────────

/** Upload a portfolio image (hero / about / thumbnail / gallery slot). */
export function useUploadPortfolioImageMutation() {
  const refreshProfile = useRefreshProfile();
  return useMutation({
    mutationFn: (payload: UploadPortfolioImagePayload) => uploadPortfolioImage(payload),
    onSuccess: refreshProfile,
  });
}

/** Delete one or more portfolio items by ID. */
export function useDeletePortfolioItemsMutation() {
  const refreshProfile = useRefreshProfile();
  return useMutation({
    mutationFn: (itemIds: string[]) => deletePortfolioItems(itemIds),
    onSuccess: refreshProfile,
  });
}

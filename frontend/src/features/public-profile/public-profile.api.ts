import { apiClient } from "@/lib/api-client";
import type { PhotographerFullData } from "@/lib/types/photographer";

/** 
 * getPhotographerProfile - Fetch the complete public photographer package.
 * Returns profile, identity, and the entire gallery.
 */
export async function getPhotographerProfile(username: string) {
  const response = await apiClient.get(`/photographers/${username}`);
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to fetch photographer profile");
  }
  return response.data.data as PhotographerFullData;
}

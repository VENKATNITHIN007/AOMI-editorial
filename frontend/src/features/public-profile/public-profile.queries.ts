import { useSuspenseQuery } from "@tanstack/react-query";
import {
  getPhotographerProfile,
} from "./public-profile.api";
import { queryKeys } from "@/lib/query/keys";

/** 
 * usePhotographerProfileSuspenseQuery - Fetch a single photographer's public profile by username.
 * This includes the portfolio gallery in the payload.
 */
export function usePhotographerProfileSuspenseQuery(username: string) {
  return useSuspenseQuery({
    queryKey: queryKeys.photographerProfile(username),
    queryFn: () => getPhotographerProfile(username),
    retry: 3,
  });
}

import { useSuspenseQuery } from "@tanstack/react-query";
import { browsePhotographers, type BrowsePhotographersParams } from "./photographers.api";
import { queryKeys } from "@/lib/query/keys";

/** 
 * useSuspensePhotographersQuery - Browse the public photographer directory.
 * Explicitly named to indicate it triggers Suspense boundaries.
 */
export function useSuspensePhotographersQuery(params: BrowsePhotographersParams) {
  return useSuspenseQuery({
    queryKey: queryKeys.photographersList(params),
    queryFn: () => browsePhotographers(params),
    retry: false,
  });
}

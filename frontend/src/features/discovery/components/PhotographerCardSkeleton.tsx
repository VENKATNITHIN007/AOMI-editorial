import { Page } from "@/components/Page";

/** 
 * PhotographerCardSkeleton - Mirrors the new 4:5 editorial card design.
 * Provides a clean shimmer effect for the discovery grid.
 */
export function PhotographerCardSkeleton() {
  return (
    <div className="bg-white border border-black/[0.05] animate-pulse">
      {/* 4:5 Portrait Shimmer */}
      <div className="relative aspect-[4/5] bg-neutral-200" />

      {/* Identity Footer Shimmer */}
      <div className="p-4 pt-4">
        <Page.Stack className="gap-3">
          <Page.Row className="gap-2 items-center">
            {/* Avatar Circle */}
            <div className="size-8 rounded-full bg-neutral-200 shrink-0" />
            
            <Page.Stack className="min-w-0 flex-1 gap-1.5">
              {/* Name Line */}
              <div className="h-3 w-3/4 bg-neutral-200 rounded" />
              {/* Location Line */}
              <div className="h-2 w-1/2 bg-neutral-200 rounded" />
            </Page.Stack>
          </Page.Row>

          {/* Price Row Shimmer */}
          <div className="pt-2 border-t border-black/[0.03] flex justify-end">
            <div className="h-4 w-16 bg-neutral-200 rounded" />
          </div>
        </Page.Stack>
      </div>
    </div>
  );
}

/** Grid of skeleton cards matching the real PhotographerGrid layout. */
export function PhotographerGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PhotographerCardSkeleton key={i} />
      ))}
    </div>
  );
}

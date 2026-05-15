import { Page } from "@/components/Page";

/** 
 * StudioSkeleton - Mirrors the StudioDashboard layout with shimmer effects.
 * Provides a smooth transition for the high-end management suite.
 */
export function StudioSkeleton() {
  return (
    <Page.Stack className="animate-pulse">
      {/* Skeleton Progress Header */}
      <div className="sticky top-0 z-20 w-full bg-white/80 backdrop-blur-md border-b border-black/[0.03] py-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <div className="h-3 w-32 bg-neutral-200 rounded" />
          <div className="h-2 w-48 bg-neutral-200 rounded-full" />
        </div>
      </div>

      <Page.Body className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 mb-32">
        <Page.Stack className="gap-12">
          {/* Repeat Skeleton Cards */}
          {[1, 2, 3, 4].map((i) => (
            <Page.Stack key={i} className="gap-12">
              <div className="space-y-6">
                {/* Card Header area */}
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-neutral-200 rounded" />
                    <div className="h-3 w-64 bg-neutral-200 rounded" />
                  </div>
                  <div className="size-6 bg-neutral-200 rounded-full" />
                </div>
                
                {/* Card Content area */}
                <div className="h-48 w-full bg-neutral-200/50 rounded-xl" />
              </div>

              {/* Separator */}
              {i < 4 && (
                <div className="pt-2">
                  <div className="h-px w-full bg-black/[0.03]" />
                </div>
              )}
            </Page.Stack>
          ))}
        </Page.Stack>
      </Page.Body>
    </Page.Stack>
  );
}

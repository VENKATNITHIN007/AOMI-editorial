
/**
 * ProfileSkeleton - Cinematic shimmer for the high-end editorial profile.
 * Covers Hero, Gallery (Bento), and About sections.
 */
export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-black animate-pulse">
      {/* 1. Hero Skeleton */}
      <section className="relative h-screen w-full flex items-end bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
        <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 sm:px-12 pb-16 space-y-6">
          <div className="size-12 rounded-full bg-white/10" />
          <div className="space-y-4">
            <div className="h-16 w-1/2 bg-white/5 rounded" />
            <div className="h-4 w-1/4 bg-white/5 rounded" />
          </div>
        </div>
      </section>

      {/* 2. Gallery Skeleton (Bento style) */}
      <section className="bg-white py-24 px-6 sm:px-12">
        <div className="max-w-[1400px] mx-auto space-y-12">
          <div className="space-y-2 text-center">
            <div className="mx-auto h-4 w-32 bg-neutral-200 rounded" />
            <div className="mx-auto h-8 w-64 bg-neutral-200 rounded" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[1200px]">
            <div className="md:col-span-8 bg-neutral-200 rounded-xl" />
            <div className="md:col-span-4 bg-neutral-200 rounded-xl" />
            <div className="md:col-span-4 bg-neutral-200 rounded-xl" />
            <div className="md:col-span-8 bg-neutral-200 rounded-xl" />
          </div>
        </div>
      </section>

      {/* 3. About Skeleton */}
      <section className="bg-black py-24 px-6 sm:px-12">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="h-[600px] bg-neutral-900 rounded-xl" />
          <div className="space-y-8 py-10">
            <div className="h-12 w-3/4 bg-neutral-800 rounded" />
            <div className="space-y-4">
              <div className="h-4 w-full bg-neutral-800 rounded" />
              <div className="h-4 w-full bg-neutral-800 rounded" />
              <div className="h-4 w-2/3 bg-neutral-800 rounded" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

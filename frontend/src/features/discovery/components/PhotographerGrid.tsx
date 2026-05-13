import type { PhotographerListItem } from "@/lib/types/photographer";
import { PhotographerCard } from "./PhotographerCard";

interface PhotographerGridProps {
  photographers: PhotographerListItem[];
}

/**
 * PhotographerGrid - High Density Marketplace Grid.
 * Displays 4 columns on large screens and 2 columns on mobile.
 */
export function PhotographerGrid({ photographers }: PhotographerGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {photographers.map((photographer) => (
        <PhotographerCard key={photographer._id} photographer={photographer} />
      ))}
    </div>
  );
}

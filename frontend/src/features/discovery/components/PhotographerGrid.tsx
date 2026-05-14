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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 w-full">
      {photographers.map((photographer) => (
        <PhotographerCard key={photographer._id} photographer={photographer} />
      ))}
    </div>
  );
}

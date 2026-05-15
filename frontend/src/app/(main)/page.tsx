import { Hero } from "@/features/landing/Hero";
import { CategoryGrid } from "@/features/landing/CategoryGrid";
import { StudioCTA } from "@/components/StudioCTA";

/**
 * Premium Landing Page (Minimalist & High-Impact).
 */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <StudioCTA variant="section" />
    </>
  );
}

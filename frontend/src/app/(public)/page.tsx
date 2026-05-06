import { Hero } from "@/features/landing/Hero";
import { CategoryGrid } from "@/features/landing/CategoryGrid";
import { StudioCTA } from "@/features/landing/StudioCTA";

/**
 * Premium Landing Page (Minimalist & High-Impact).
 * 1. Hero (Premium Gradient + depth)
 * 2. CategoryGrid (Visual Image Cards)
 * 3. OnboardingCTA (The Bridge with 2 key points)
 */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <StudioCTA />
    </>
  );
}

"use client";

import { useMemo } from "react";
import { Page } from "@/components/Page";
import type { PhotographerFullData } from "@/lib/types/photographer";
import { IdentityCard } from "./components/IdentityCard";
import { HeroCard } from "./components/HeroCard";
import { AboutCard } from "./components/AboutCard";
import { ThumbnailCard } from "./components/ThumbnailCard";
import { PortfolioGridCard } from "./components/PortfolioGridCard";
import { StudioProgressHeader } from "./components/StudioProgressHeader";

interface StudioDashboardProps {
  profile: PhotographerFullData;
}

/**
 * StudioDashboard - The Orchestrator for the Photographer Management Suite.
 * Refactored using Page primitives for clean, editorial-grade structure.
 */
export function StudioDashboard({ profile }: StudioDashboardProps) {
  const steps = useMemo(() => {
    const s = [
      {
        id: 1,
        title: "Profile Details",
        isComplete: !!(profile.profile.location && profile.profile.priceFrom && profile.profile.specialties.length > 0),
      },
      {
        id: 2,
        title: "Cover Photo",
        isComplete: !!profile.hero && !!profile.profile.heroTagline,
      },
      {
        id: 3,
        title: "About Section",
        isComplete: !!profile.aboutImage && !!profile.profile.bio,
      },
      {
        id: 4,
        title: "Card Photo",
        isComplete: !!profile.thumbnail,
      },
      {
        id: 5,
        title: "Portfolio Grid",
        isComplete: profile.gallery.length >= 5,
      },
    ];

    const completedCount = s.filter(step => step.isComplete).length;

    return {
      items: s,
      completedCount,
      totalCount: s.length,
    };
  }, [profile]);

  return (
    <Page.Stack className="animate-in fade-in duration-700">
      {/* Sticky Progress Tracker */}
      <StudioProgressHeader
        completedSteps={steps.completedCount}
        totalSteps={steps.totalCount}
      />

      {/* Main Card Stack */}
      <Page.Body className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 mb-32">
        <Page.Stack className="gap-12">
          {steps.items.map((step, idx) => {
            return (
              <Page.Stack key={step.id} className="gap-12">
                {step.id === 1 && <IdentityCard profile={profile.profile} step={step.id} isComplete={step.isComplete} />}
                {step.id === 2 && <HeroCard profile={profile.profile} currentHero={profile.hero} step={step.id} isComplete={step.isComplete} />}
                {step.id === 3 && <AboutCard profile={profile.profile} currentAbout={profile.aboutImage} step={step.id} isComplete={step.isComplete} />}
                {step.id === 4 && <ThumbnailCard currentThumbnail={profile.thumbnail} step={step.id} isComplete={step.isComplete} />}
                {step.id === 5 && <PortfolioGridCard items={profile.gallery} step={step.id} isComplete={step.isComplete} />}
                
                {/* Light Separator Line */}
                {idx < steps.items.length - 1 && (
                  <div className="pt-2">
                    <div className="h-px w-full bg-black/[0.03]" />
                  </div>
                )}
              </Page.Stack>
            );
          })}
        </Page.Stack>
      </Page.Body>
    </Page.Stack>
  );
}

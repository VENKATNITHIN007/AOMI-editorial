"use client";

import React, { useMemo, Suspense } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { QueryErrorBoundary } from "@/components/QueryErrorBoundary";
import { useMyProfileSuspenseQuery } from "./studio.queries";
import { IdentityCard } from "./components/IdentityCard";
import { HeroCard } from "./components/HeroCard";
import { AboutCard } from "./components/AboutCard";
import { ThumbnailCard } from "./components/ThumbnailCard";
import { PortfolioGridCard } from "./components/PortfolioGridCard";
import { StudioProgressHeader } from "./components/StudioProgressHeader";
import { StudioSkeleton } from "./components/StudioSkeleton";

/**
 * StudioDashboardContent - The core UI that depends on profile data.
 */
function StudioPageContent() {
  const { data: profile } = useMyProfileSuspenseQuery();

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
    <>
      {/* Editorial Heading — Localized inside Content to handle data-dependent button */}
      <div className="max-w-4xl mx-auto w-full pt-12 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-black">
            Studio Management
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            Curate your professional presence and portfolio exhibition.
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          className="h-11 px-8 rounded-none border-black hover:bg-black hover:text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 shrink-0"
        >
          <Link href={`/photographers/${profile.profile.username}`} target="_blank" className="flex items-center gap-2">
            Visit Profile
            <ExternalLink className="size-3.5" />
          </Link>
        </Button>
      </div>

      <Page.Body className="max-w-4xl pt-10 pb-24 mx-auto animate-in fade-in duration-700">
        <Page.Stack className="gap-6">
          {/* Sticky Progress Tracker */}
          <StudioProgressHeader
            completedSteps={steps.completedCount}
            totalSteps={steps.totalCount}
          />

          {/* Main Card Stack */}
          <Page.Stack className="gap-12 mt-6">
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
        </Page.Stack>
      </Page.Body>
    </>
  );
}

/**
 * StudioPage - Orchestrator for the photographer studio dashboard.
 * Unified Pattern: Boundaries (ErrorBoundary/Suspense) wrap the data-dependent Content.
 */
export function StudioPage() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<StudioSkeleton />}>
        <StudioPageContent />
      </Suspense>
    </QueryErrorBoundary>
  );
}

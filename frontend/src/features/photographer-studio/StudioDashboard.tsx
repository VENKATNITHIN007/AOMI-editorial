"use client";

import type { PhotographerFullData } from "@/lib/types/photographer";
import { IdentityCard } from "./components/IdentityCard";
import { HeroCard } from "./components/HeroCard";
import { AboutCard } from "./components/AboutCard";
import { ThumbnailCard } from "./components/ThumbnailCard";
import { GalleryCard } from "./components/GalleryCard";
import { StudioHeader } from "./components/StudioHeader";

interface StudioDashboardProps {
  profile: PhotographerFullData;
}

/**
 * StudioDashboard - The Orchestrator for the Photographer Management Suite.
 * Handles the layout and composition of the 5-card management stack.
 */
export function StudioDashboard({ profile }: StudioDashboardProps) {
  return (
    <div className="animate-in fade-in duration-700">
      {/* Sticky Command Bar */}
      <StudioHeader username={profile.profile.username} />

      <div className="space-y-12 px-4 sm:px-6">
        {/* 01: Professional Identity */}
        <IdentityCard profile={profile.profile} />
        
        {/* 02: Exhibition Narrative */}
        <HeroCard 
          profile={profile.profile} 
          gallery={profile.gallery} 
          currentHero={profile.hero} 
        />
        
        {/* 03: Brand Narrative */}
        <AboutCard 
          profile={profile.profile} 
          gallery={profile.gallery} 
          currentAbout={profile.aboutImage} 
        />
        
        {/* 04: Discovery Appearance */}
        <ThumbnailCard 
          gallery={profile.gallery} 
          currentThumbnail={profile.thumbnail} 
        />
        
        {/* 05: Asset Management */}
        <GalleryCard items={profile.gallery} />
      </div>
    </div>
  );
}

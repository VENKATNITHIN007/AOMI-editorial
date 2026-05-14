"use client";

import React from "react";
import { Page } from "@/components/Page";
import { DataState } from "@/components/DataState";
import { usePhotographerProfileQuery } from "./public-profile.queries";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileHero } from "./components/ProfileHero";
import { ProfileGallery } from "./components/ProfileGallery";
import { ProfileAbout } from "./components/ProfileAbout";
import { ProfileFooter } from "./components/ProfileFooter";

interface PublicProfilePageProps {
  username: string;
}

/**
 * PublicProfilePage - Main entry for the high-end editorial photographer portfolio.
 * Orchestrates the hero, gallery, about, and footer sections with intelligent fallbacks.
 */
export function PublicProfilePage({ username }: PublicProfilePageProps) {
  const { 
    data: fullData, 
    isLoading, 
    error, 
  } = usePhotographerProfileQuery(username);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-[10px] uppercase tracking-[0.5em] text-white/40">Loading Portfolio</span>
        </div>
      </div>
    );
  }

  // Error/Empty State
  if (error || !fullData) {
    return (
      <Page className="bg-black text-white">
        <Page.Body className="flex items-center justify-center min-h-[80vh]">
          <DataState.Empty 
            title="Photographer Not Found"
            description="The profile you are looking for does not exist or has been moved."
          />
        </Page.Body>
      </Page>
    );
  }

  const { profile, hero, aboutImage: aboutItem, gallery } = fullData;
  const name = profile.userId?.fullName || profile.username;
  
  // High-end default placeholders
  const DEFAULT_HERO = "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop";
  const DEFAULT_ABOUT = "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=2070&auto=format&fit=crop";

  const heroImage = hero?.mediaUrl || DEFAULT_HERO;
  const aboutImage = aboutItem?.mediaUrl || DEFAULT_ABOUT;

  return (
    <Page className="min-h-screen bg-black text-[#f5f5f5] selection:bg-white selection:text-black">
      <ProfileHeader name={name} />
      
      <ProfileHero 
        name={name} 
        heroImage={heroImage} 
        tagline={profile.heroTagline ?? undefined}
        avatar={profile.userId?.avatar ?? undefined}
        email={profile.userId?.email ?? undefined}
        instagram={profile.instagram}
      />

      {/* Gallery with light background for visual distinction */}
      <ProfileGallery portfolio={gallery} />

      <ProfileAbout 
        name={name}
        bio={profile.bio ?? undefined}
        aboutImage={aboutImage}
        email={profile.userId?.email ?? undefined}
        instagram={profile.instagram}
        specialties={profile.specialties}
        location={profile.location ?? undefined}
        priceFrom={profile.priceFrom?.toString()}
      />

      <ProfileFooter />
    </Page>
  );
}

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
  
  const heroImage = hero?.mediaUrl || gallery[0]?.mediaUrl;
  const aboutImage = aboutItem?.mediaUrl || gallery[1]?.mediaUrl || gallery[0]?.mediaUrl;

  return (
    <Page className="min-h-screen bg-black text-[#f5f5f5] selection:bg-white selection:text-black">
      <ProfileHeader name={name} />
      
      <ProfileHero 
        name={name} 
        heroImage={heroImage} 
        tagline={profile.heroTagline}
      />

      {gallery.length > 0 && (
        <ProfileGallery portfolio={gallery} />
      )}

      <ProfileAbout 
        name={name}
        bio={profile.bio}
        aboutImage={aboutImage}
        priceFrom={profile.priceFrom?.toString()}
        specialties={profile.specialties}
        email={profile.userId?.email}
      />

      <ProfileFooter />
    </Page>
  );
}

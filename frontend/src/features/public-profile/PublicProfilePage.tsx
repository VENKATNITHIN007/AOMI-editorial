"use client";

import React, { Suspense } from "react";
import { Page } from "@/components/Page";
import { DataState } from "@/components/DataState";
import { QueryErrorBoundary } from "@/components/QueryErrorBoundary";
import { usePhotographerProfileSuspenseQuery } from "./public-profile.queries";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileHero } from "./components/ProfileHero";
import { ProfileGallery } from "./components/ProfileGallery";
import { ProfileAbout } from "./components/ProfileAbout";
import { ProfileFooter } from "./components/ProfileFooter";
import { ProfileSkeleton } from "./components/ProfileSkeleton";

interface PublicProfilePageProps {
  username: string;
}

/**
 * ProfileContent - The part that actually fetches and displays the photographer data.
 * Assumes data is available thanks to useSuspenseQuery.
 */
function ProfileContent({ username }: { username: string }) {
  const { data: fullData } = usePhotographerProfileSuspenseQuery(username);

  // Error/Empty State handled locally if data is null (rare with Suspense but safe)
  if (!fullData) {
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

/**
 * PublicProfilePage - Entry for the editorial photographer portfolio.
 * Refactored to use the modern "Precision" pattern:
 * Boundary (ErrorBoundary) → Fallback (Suspense/Skeleton) → Content (SuspenseQuery).
 */
export function PublicProfilePage({ username }: PublicProfilePageProps) {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent username={username} />
      </Suspense>
    </QueryErrorBoundary>
  );
}

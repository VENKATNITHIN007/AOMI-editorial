"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Page } from "@/components/Page";
import { DataState } from "@/components/DataState";
import { RoleGate } from "@/components/guards/RoleGate";
import { Button } from "@/components/ui/button";
import { useMyProfileQuery } from "@/features/photographer-studio/studio.queries";
import { StudioDashboard } from "@/features/photographer-studio/StudioDashboard";

/**
 * Photographer Studio Dashboard.
 * Thin page layer for role guarding and data orchestration.
 */
export default function PhotographerDashboard() {
  const { data: profile, isLoading, error } = useMyProfileQuery();

  return (
    <RoleGate allowedRoles={["photographer"]}>
      <Page>
        {/* Editorial Heading */}
        <div className="max-w-4xl mx-auto w-full pt-12 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-black">
              Studio Management
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Curate your professional presence and portfolio exhibition.
            </p>
          </div>

          {!isLoading && profile && (
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
          )}
        </div>

        <Page.Body className="max-w-4xl pt-10 pb-24 mx-auto">
          {isLoading ? (
            <DataState.Loading />
          ) : error || !profile ? (
            <DataState.Error 
              message={
                error?.message?.includes("404")
                  ? "It looks like your studio profile hasn't been created yet."
                  : "We couldn't retrieve your studio profile."
              }
              actionLabel={
                error?.message?.includes("404")
                  ? "Start Studio Setup"
                  : "Reload Dashboard"
              }
              onRetry={() => {
                if (error?.message?.includes("404")) {
                  window.location.href = "/photographer/onboard";
                } else {
                  window.location.reload();
                }
              }}
            />
          ) : (
            <StudioDashboard profile={profile} />
          )}
        </Page.Body>
      </Page>
    </RoleGate>
  );
}

"use client";

import { Page } from "@/components/Page";
import { DataState } from "@/components/DataState";
import { RoleGate } from "@/components/guards/RoleGate";
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
        <div className="max-w-4xl mx-auto w-full pt-12 px-4 sm:px-6">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-black">
            Studio Management
          </h1>
          <p className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            Curate your professional presence and portfolio exhibition.
          </p>
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

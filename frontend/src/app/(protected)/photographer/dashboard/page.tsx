"use client";

import { useState } from "react";
import { Page } from "@/components/Page";
import { DataState } from "@/components/DataState";
import { RoleGate } from "@/components/guards/RoleGate";
import { useMyProfileQuery } from "@/features/photographer-studio/studio.queries";
import { StudioHeader } from "@/features/photographer-studio/components/StudioHeader";
import { PortfolioManager } from "@/features/photographer-studio/components/PortfolioManager";
import { StudioDetailsForm } from "@/features/photographer-studio/components/StudioDetailsForm";

/**
 * Photographer Studio Dashboard.
 * Orchestrates portfolio management and studio settings.
 */
export default function PhotographerDashboard() {
  const { data: profile, isLoading, error } = useMyProfileQuery();
  const [activeTab, setActiveTab] = useState<"portfolio" | "settings">("portfolio");

  return (
    <RoleGate allowedRoles={["photographer"]}>
      <Page>
        <Page.Body className="max-w-6xl pt-10 sm:pt-16 pb-24">
          {isLoading ? (
            <DataState.Loading />
          ) : error || !profile ? (
            <DataState.Error 
              message={
                (error as any)?.message?.includes("404") || (error as any)?.message?.includes("not found")
                  ? "It looks like your studio profile hasn't been created yet. You need to complete your setup to access the dashboard."
                  : "We couldn't retrieve your studio profile. Please ensure your account is correctly set up."
              }
              actionLabel={
                (error as any)?.message?.includes("404") || (error as any)?.message?.includes("not found")
                  ? "Start Studio Setup"
                  : "Reload Dashboard"
              }
              onRetry={() => {
                if ((error as any)?.message?.includes("404") || (error as any)?.message?.includes("not found")) {
                  window.location.href = "/photographer/onboard";
                } else {
                  window.location.reload();
                }
              }}
            />
          ) : (
            <div className="animate-in fade-in duration-700">
              <StudioHeader 
                username={profile.username} 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />

              <div className="min-h-[500px]">
                {activeTab === "portfolio" && <PortfolioManager />}
                {activeTab === "settings" && <StudioDetailsForm profile={profile} />}
              </div>
            </div>
          )}
        </Page.Body>
      </Page>
    </RoleGate>
  );
}

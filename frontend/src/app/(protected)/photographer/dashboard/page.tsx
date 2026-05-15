"use client";

import React from "react";
import { Page } from "@/components/Page";
import { RoleGate } from "@/components/guards/RoleGate";
import { StudioPage } from "@/features/photographer-studio/StudioPage";

/**
 * Photographer Dashboard Route.
 * "Thin Page" implementation - delegates data fetching and boundaries to the StudioPage feature.
 */
export default function PhotographerDashboard() {
  return (
    <RoleGate allowedRoles={["photographer"]}>
      <Page>
        <StudioPage />
      </Page>
    </RoleGate>
  );
}

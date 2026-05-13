import type { Metadata } from "next";
import { Page } from "@/components/Page";
import { DiscoveryDashboard } from "@/features/discovery/DiscoveryDashboard";

export const metadata: Metadata = {
  title: "Browse Photographers | Photophile",
  description: "Discover professional photographers by specialty, location, and budget.",
};

/**
 * Photographers Discovery Page.
 * "Thin Page" implementation - delegates all logic to DiscoveryDashboard.
 */
export default function PhotographersRoutePage() {
  return (
    <Page className="bg-white">
      <DiscoveryDashboard />
    </Page>
  );
}

"use client";

import React, { Suspense } from "react";
import { Page } from "@/components/Page";
import { QueryErrorBoundary } from "@/components/QueryErrorBoundary";
import { DiscoveryFilters, DiscoveryMobileFilters } from "./components/DiscoveryFilters";
import { DiscoverySearch } from "./components/DiscoverySearch";
import { DiscoveryResults } from "./components/DiscoveryResults";
import { PhotographerGridSkeleton } from "./components/PhotographerCardSkeleton";
import { ActiveFiltersSummary } from "./components/ActiveFiltersSummary";

export function DiscoveryDashboard() {
  return (
    <Page.Body className="max-w-[1600px] mx-auto px-6 sm:px-12 pt-4 pb-32">
      <Page.Row className="w-full gap-8 flex-col lg:flex-row items-start">
        
        {/* Left Sidebar: Filters (Desktop) */}
        <DiscoveryFilters />

        {/* Right Content: Header, Search, Grid */}
        <div className="flex-1 w-full">
          <Page.Stack className="gap-6">
            
            {/* Ultra-Condensed Header */}
            <Page.Stack className="gap-1">
              <h1 className="text-2xl font-black text-black uppercase tracking-tighter leading-none">
                Photographers
              </h1>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Connect with professionals instantly.
              </p>
            </Page.Stack>

            {/* Search & Sort Area */}
            <Page.Stack className="gap-4">
              <DiscoverySearch />
              <ActiveFiltersSummary />
              <div className="hidden lg:block border-b border-black/[0.03]" />
            </Page.Stack>

            {/* Grid Results */}
            <QueryErrorBoundary>
              <Suspense fallback={<PhotographerGridSkeleton />}>
                <DiscoveryResults />
              </Suspense>
            </QueryErrorBoundary>
            
          </Page.Stack>
        </div>

      </Page.Row>

      {/* Mobile Floating Filters */}
      <DiscoveryMobileFilters />
    </Page.Body>
  );
}

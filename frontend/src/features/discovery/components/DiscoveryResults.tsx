"use client";

import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataState } from "@/components/DataState";
import { Page } from "@/components/Page";
import { PhotographerGrid } from "./PhotographerGrid";
import { PaginationControls } from "./PaginationControls";
import { useSuspensePhotographersQuery } from "../photographers.queries";
import { usePhotographerFilters } from "../photographers.store";
import type { BrowsePhotographersParams } from "../photographers.api";

// ── Helpers ────────────────────────────────────────────────────────

function sanitizePrice(raw: string | null): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const num = Number(trimmed);
  if (!Number.isFinite(num) || num < 0) return undefined;
  return trimmed;
}

// ── Component ──────────────────────────────────────────────────────

export function DiscoveryResults() {
  const searchParams = useSearchParams();
  const { reset, hydrateFromURL } = usePhotographerFilters();

  // 1. Sync Store UI with URL
  useEffect(() => {
    hydrateFromURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Scroll to top on page change
  const urlPageStr = searchParams.get("page");
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [urlPageStr]);

  // 3. Derive Query Params
  const queryParams: BrowsePhotographersParams = useMemo(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    
    return {
      search: searchParams.get("search") || undefined,
      location: searchParams.get("location") !== "all" ? (searchParams.get("location") || undefined) : undefined,
      specialty: searchParams.get("specialty") || undefined,
      minPrice: sanitizePrice(searchParams.get("minPrice")),
      maxPrice: sanitizePrice(searchParams.get("maxPrice")),
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
      page: !Number.isNaN(page) && page >= 1 ? page : 1,
      limit: 12,
    };
  }, [searchParams]);

  // 4. Execute Query
  const { data } = useSuspensePhotographersQuery(queryParams);
  const photographers = data?.photographers || [];
  const pagination = data?.pagination || null;

  // ── Render ────────────────────────────────────────────────────────

  if (photographers.length === 0) {
    return (
      <div className="pt-20">
        <DataState.Empty
          title="No photographers found"
          description="Try changing your filters or search query."
          action={<Button variant="outline" onClick={reset} className="rounded-none border-black uppercase font-black text-[10px] tracking-widest px-8 h-12">Clear filters</Button>}
        />
      </div>
    );
  }

  return (
    <Page.Stack className="gap-12 animate-in fade-in duration-700">
      {/* Mobile Results Count */}
      <div className="lg:hidden">
        <Page.Row className="justify-between pb-4 border-b border-black/5 items-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-black/40">
            {pagination?.totalCount || 0} photographers found
          </p>
        </Page.Row>
      </div>

      <PhotographerGrid photographers={photographers} />
      
      {pagination && pagination.totalPages > 1 && (
        <div className="pt-12 border-t border-black/5">
          <PaginationControls 
            pagination={pagination} 
            page={queryParams.page || 1} 
            onPageChange={(p) => {
              usePhotographerFilters.getState().setPage(p);
            }} 
          />
        </div>
      )}
    </Page.Stack>
  );
}

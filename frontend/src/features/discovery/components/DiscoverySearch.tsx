"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Page } from "@/components/Page";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { usePhotographerFilters } from "../photographers.store";

/**
 * DiscoverySearch - High Density Search Bar.
 * Condensed sort UI and streamlined layout.
 */
export function DiscoverySearch() {
  const { setSearch, setSortBy, setSortOrder } = usePhotographerFilters();

  const handleSortChange = (value: string) => {
    if (value === "popular") {
      setSortBy("createdAt");
      setSortOrder("desc");
    } else if (value === "price_asc") {
      setSortBy("priceFrom");
      setSortOrder("asc");
    } else if (value === "price_desc") {
      setSortBy("priceFrom");
      setSortOrder("desc");
    } else if (value === "newest") {
      setSortBy("createdAt");
      setSortOrder("desc");
    }
  };

  return (
    <Page.Row className="gap-4 w-full items-center">
      {/* Universal Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-black/20" />
        <Input
          type="text"
          placeholder="Search Talent..."
          className="h-10 pl-10 pr-4 rounded-none border-black/[0.05] bg-neutral-50 shadow-none focus-visible:ring-0 text-xs font-bold uppercase tracking-widest placeholder:text-neutral-300"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Condensed Sorting */}
      <Select defaultValue="popular" onValueChange={handleSortChange}>
        <SelectTrigger className="w-28 md:w-32 h-10 rounded-none border-black/[0.05] bg-neutral-50 text-[9px] font-black uppercase tracking-widest focus:ring-0">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent className="rounded-none border-black/5 shadow-2xl">
          <SelectItem value="popular" className="text-[9px] uppercase font-black">Popular</SelectItem>
          <SelectItem value="newest" className="text-[9px] uppercase font-black">Newest</SelectItem>
          <SelectItem value="price_asc" className="text-[9px] uppercase font-black">Price: Low</SelectItem>
          <SelectItem value="price_desc" className="text-[9px] uppercase font-black">Price: High</SelectItem>
        </SelectContent>
      </Select>
    </Page.Row>
  );
}

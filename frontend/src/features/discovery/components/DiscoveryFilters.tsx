"use client";

import React, { useState } from "react";
import { Filter, MapPin, Camera, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Page } from "@/components/Page";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { usePhotographerFilters } from "../photographers.store";
import { COMMON_LOCATIONS, COMMON_SPECIALTIES } from "@/lib/constants/photographer";
import { cn } from "@/lib/utils";

function FilterForm() {
  const { 
    drafts,
    setDraftLocation,
    toggleDraftSpecialty,
    setDraftMinPrice,
    setDraftMaxPrice,
    applyFilters
  } = usePhotographerFilters();

  const [showAllSpecialties, setShowAllSpecialties] = useState(false);
  const displayedSpecialties = showAllSpecialties ? COMMON_SPECIALTIES : COMMON_SPECIALTIES.slice(0, 6);

  const PRICE_RANGES = [
    { label: "Any", min: "", max: "" },
    { label: "< ₹2k", min: "0", max: "2000" },
    { label: "₹2k-5k", min: "2000", max: "5000" },
    { label: "₹5k-10k", min: "5000", max: "10000" },
    { label: "₹10k+", min: "10000", max: "999999" },
  ];

  const isRangeActive = (min: string, max: string) => 
    drafts.minPrice === min && drafts.maxPrice === max;

  return (
    <Page.Stack className="gap-8">
      {/* Location */}
      <Page.Stack className="gap-3">
        <Page.Row className="gap-2 text-black/40">
          <MapPin className="size-3" />
          <Label className="text-[9px] font-black uppercase tracking-widest cursor-default">Location</Label>
        </Page.Row>
        <Select value={drafts.location} onValueChange={setDraftLocation}>
          <SelectTrigger className="rounded-none border-black/5 bg-neutral-50 h-10 text-[10px] font-bold uppercase tracking-widest focus:ring-0">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-black/5">
            <SelectItem value="all" className="text-[10px] uppercase font-bold">Any Location</SelectItem>
            {COMMON_LOCATIONS.map((loc: string) => (
              <SelectItem key={loc} value={loc} className="text-[10px] uppercase font-bold">{loc}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Page.Stack>

      {/* Specialty */}
      <Page.Stack className="gap-3">
        <Page.Row className="gap-2 text-black/40">
          <Camera className="size-3" />
          <Label className="text-[9px] font-black uppercase tracking-widest cursor-default">Specialty</Label>
        </Page.Row>
        <Page.Stack className="gap-2.5 pl-0.5">
          {displayedSpecialties.map((spec: string) => (
            <Page.Row key={spec} className="gap-2.5 items-center">
              <Checkbox 
                id={`spec-${spec}`} 
                checked={drafts.specialties.includes(spec)}
                onCheckedChange={() => toggleDraftSpecialty(spec)}
                className="size-3.5 rounded-none border-black/10 data-[state=checked]:bg-black data-[state=checked]:border-black"
              />
              <label htmlFor={`spec-${spec}`} className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest cursor-pointer hover:text-black">
                {spec}
              </label>
            </Page.Row>
          ))}
          <button onClick={() => setShowAllSpecialties(!showAllSpecialties)} className="text-[8px] font-black text-blue-600 uppercase tracking-widest pt-1">
            {showAllSpecialties ? "Show Less" : "Show More"}
          </button>
        </Page.Stack>
      </Page.Stack>

      {/* Segmented Price Selector */}
      <Page.Stack className="gap-3">
        <Page.Row className="gap-2 text-black/40">
          <Banknote className="size-3" />
          <Label className="text-[9px] font-black uppercase tracking-widest cursor-default">Budget Range</Label>
        </Page.Row>
        <div className="grid grid-cols-2 gap-2">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.label}
              onClick={() => {
                setDraftMinPrice(range.min);
                setDraftMaxPrice(range.max);
              }}
              className={cn(
                "h-9 border text-[9px] font-black uppercase tracking-widest transition-all",
                isRangeActive(range.min, range.max)
                  ? "bg-black text-white border-black"
                  : "bg-white text-neutral-400 border-black/5 hover:border-black/20"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </Page.Stack>

      {/* Primary Apply Action */}
      <Button 
        onClick={applyFilters}
        className="w-full h-11 rounded-none bg-black text-white text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-neutral-800 transition-transform active:scale-[0.98]"
      >
        Apply Filters
      </Button>
    </Page.Stack>
  );
}

export function DiscoveryFilters() {
  const { hasActiveFilters, reset } = usePhotographerFilters();
  return (
    <aside className="hidden lg:block w-64 shrink-0 border-r border-black/[0.03] pr-8">
      <div className="sticky top-28 space-y-6">
        <Page.Row className="justify-between items-center border-b border-black/[0.03] pb-4">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-black">Filters</h2>
          {hasActiveFilters && (
            <button onClick={reset} className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Reset</button>
          )}
        </Page.Row>
        <FilterForm />
      </div>
    </aside>
  );
}

export function DiscoveryMobileFilters() {
  const { hasActiveFilters, reset } = usePhotographerFilters();
  return (
    <div className="fixed bottom-6 right-6 z-50 lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="size-14 rounded-full shadow-2xl bg-black flex flex-col items-center justify-center gap-0.5">
            <Filter className="size-4 text-white" />
            <span className="text-[7px] font-black uppercase text-white">Refine</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <div className="p-6 border-b border-black/5 flex items-center justify-between">
            <span className="text-sm font-black uppercase tracking-widest">Refine</span>
            {hasActiveFilters && <button onClick={reset} className="text-[9px] font-black text-blue-600 uppercase">Reset</button>}
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-100px)]">
            <FilterForm />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

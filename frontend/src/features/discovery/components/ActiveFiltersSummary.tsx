"use client";

import React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePhotographerFilters, writeFiltersToURL } from "../photographers.store";

/**
 * ActiveFiltersSummary - Professional search chips.
 * Shows all active filters and allows quick removals.
 */
export function ActiveFiltersSummary() {
  const store = usePhotographerFilters();
  const { 
    location, 
    specialties, 
    minPrice, 
    maxPrice, 
    hasActiveFilters,
    reset 
  } = store;

  if (!hasActiveFilters) return null;

  const filters: { id: string; label: string; onRemove: () => void }[] = [];
  
  // 1. Location Chip
  if (location !== "all") {
    filters.push({ 
      id: "loc", 
      label: `Loc: ${location}`, 
      onRemove: () => {
        usePhotographerFilters.setState({ location: "all", page: 1 });
        writeFiltersToURL(usePhotographerFilters.getState());
      } 
    });
  }
  
  // 2. Specialty Chips
  specialties.forEach((spec) => {
    filters.push({ 
      id: `spec-${spec}`, 
      label: spec, 
      onRemove: () => {
        const next = specialties.filter(s => s !== spec);
        usePhotographerFilters.setState({ specialties: next, page: 1 });
        writeFiltersToURL(usePhotographerFilters.getState());
      } 
    });
  });

  // 3. Consolidated Budget Chip
  if (minPrice || maxPrice) {
    let budgetLabel = "";
    if (minPrice && maxPrice) {
      if (maxPrice === "999999") budgetLabel = `Budget: ₹${parseInt(minPrice)/1000}k+`;
      else budgetLabel = `Budget: ₹${parseInt(minPrice)/1000}k-${parseInt(maxPrice)/1000}k`;
    } else if (minPrice) {
      budgetLabel = `Budget: Min ₹${parseInt(minPrice)/1000}k`;
    } else if (maxPrice) {
      budgetLabel = `Budget: Max ₹${parseInt(maxPrice)/1000}k`;
    }

    filters.push({ 
      id: "budget", 
      label: budgetLabel, 
      onRemove: () => {
        usePhotographerFilters.setState({ minPrice: "", maxPrice: "", page: 1 });
        writeFiltersToURL(usePhotographerFilters.getState());
      } 
    });
  }

  const handleReset = () => {
    reset();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 py-1">
      <span className="text-[10px] font-black uppercase tracking-widest text-black/30 mr-1">Active:</span>
      {filters.map((f) => (
        <Badge 
          key={f.id} 
          className="rounded-none bg-neutral-50 hover:bg-neutral-100 text-black border-black/5 px-2 py-1 gap-2 uppercase text-[9px] font-black tracking-widest transition-all"
        >
          {f.label}
          <button 
            onClick={f.onRemove} 
            className="hover:text-red-500 transition-colors"
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      <button 
        onClick={handleReset} 
        className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:opacity-70 transition-opacity ml-2"
      >
        Clear All
      </button>
    </div>
  );
}

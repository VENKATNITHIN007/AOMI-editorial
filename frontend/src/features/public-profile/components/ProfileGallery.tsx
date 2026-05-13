"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getOptimizedImageUrl } from "@/lib/cloudinary-utils";
import type { PortfolioItem } from "@/lib/types/photographer";

interface ProfileGalleryProps {
  portfolio: PortfolioItem[];
}

export function ProfileGallery({ portfolio }: ProfileGalleryProps) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  
  // Create 8 slots, using placeholders for missing images
  const slots = Array.from({ length: 8 }).map((_, i) => portfolio[i] || null);

  // Helper to get grid classes based on index for the editorial layout
  const getGridClasses = (index: number) => {
    switch (index) {
      case 0: return "md:col-span-1 md:row-span-2 min-h-[400px]"; // Tall Portrait
      case 1: return "md:col-span-2 md:row-span-2 min-h-[400px]"; // Large Feature
      case 2: return "md:col-span-1 md:row-span-1 min-h-[200px]"; // Small Top Right
      case 3: return "md:col-span-1 md:row-span-1 min-h-[200px]"; // Small Bottom Right
      default: return "md:col-span-1 md:row-span-1 min-h-[200px]"; // Standard bottom row
    }
  };

  return (
    <section className="py-24 bg-black">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12">
        <div className="mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-light text-white italic tracking-tighter">
            Selected Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-fr">
          {slots.map((item, index) => {
            if (!item) {
              return (
                <div 
                  key={`placeholder-${index}`}
                  className={cn(
                    "bg-neutral-900 flex items-center justify-center opacity-20 border border-white/5",
                    getGridClasses(index)
                  )}
                >
                  <div className="w-8 h-px bg-white/20" />
                </div>
              );
            }

            const purpose = index === 1 ? "gallery" : "thumbnail"; 
            const thumb = getOptimizedImageUrl(item.mediaUrl, purpose);
            const full = getOptimizedImageUrl(item.mediaUrl, "lightbox");

            return (
              <div 
                key={item._id} 
                className={cn(
                  "group relative overflow-hidden bg-neutral-900 cursor-zoom-in",
                  getGridClasses(index)
                )}
                onClick={() => setSelectedImg(full)}
              >
                <img 
                  src={thumb} 
                  alt="Portfolio Work" 
                  className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out" 
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox - Fixed sizes */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-8 cursor-pointer animate-in fade-in duration-300"
          onClick={() => setSelectedImg(null)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={selectedImg} 
              alt="Full size view" 
              className="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in-95 duration-500" 
            />
          </div>
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
            <X className="size-8" />
          </button>
        </div>
      )}
    </section>
  );
}

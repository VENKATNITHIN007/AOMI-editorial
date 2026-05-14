"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getOptimizedImageUrl } from "@/lib/cloudinary-utils";
import type { PortfolioItem } from "@/lib/types/photographer";

// ── Bento Configuration (Matches Studio) ───────────────────────────────────────

type BentoPurpose = "bento_square" | "bento_portrait" | "bento_landscape";

interface BentoSlot {
  id: number;
  gridClass: string;
  aspectClass: string;
  purpose: BentoPurpose;
  defaultImage: string;
}

const BENTO_SLOTS: BentoSlot[] = [
  { 
    id: 0, 
    gridClass: "col-span-2 row-span-2", 
    aspectClass: "aspect-square",  
    purpose: "bento_square",
    defaultImage: "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?q=80&w=2058&auto=format&fit=crop"
  },
  { 
    id: 1, 
    gridClass: "col-span-1 row-span-1", 
    aspectClass: "aspect-[4/5]",   
    purpose: "bento_portrait",
    defaultImage: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop"
  },
  { 
    id: 2, 
    gridClass: "col-span-1 row-span-1", 
    aspectClass: "aspect-[4/5]",   
    purpose: "bento_portrait",
    defaultImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop"
  },
  { 
    id: 3, 
    gridClass: "col-span-1 row-span-1", 
    aspectClass: "aspect-[16/9]",  
    purpose: "bento_landscape",
    defaultImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
  },
  { 
    id: 4, 
    gridClass: "col-span-1 row-span-1", 
    aspectClass: "aspect-[16/9]",  
    purpose: "bento_landscape",
    defaultImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1948&auto=format&fit=crop"
  },
];

interface ProfileGalleryProps {
  portfolio: PortfolioItem[];
}

/**
 * ProfileGallery — A professional Bento Grid with a light, clean background.
 * Now simplified to focus strictly on the visual grid without filters.
 */
export function ProfileGallery({ portfolio }: ProfileGalleryProps) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const getItemForSlot = (position: number) => portfolio.find((i) => i.position === position);

  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {/* Gallery Header */}
        <div className="mb-14 space-y-3">
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-black/25">Portfolio</span>
          <h2 className="text-3xl sm:text-5xl font-serif font-light text-black tracking-tight leading-none">
            Selected Works
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {BENTO_SLOTS.map((slot) => {
            const item = getItemForSlot(slot.id);
            
            // Use user image or fall back to high-end default
            const imageUrl = item ? item.mediaUrl : slot.defaultImage;
            const thumb = getOptimizedImageUrl(imageUrl, slot.purpose);
            const full = getOptimizedImageUrl(imageUrl, "lightbox");

            return (
              <div 
                key={slot.id} 
                className={cn(
                  "group relative overflow-hidden bg-neutral-100 cursor-zoom-in transition-all duration-700",
                  slot.gridClass,
                  slot.aspectClass,
                  !item && "opacity-40 grayscale hover:opacity-80 hover:grayscale-0"
                )}
                onClick={() => setSelectedImg(full)}
              >
                <Image 
                  src={thumb} 
                  alt="Portfolio Work" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-all duration-[1.5s] ease-out group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Overlay */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-[100] bg-white/98 backdrop-blur-3xl flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-500"
          onClick={() => setSelectedImg(null)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <Image 
              src={selectedImg} 
              alt="Full size view" 
              fill
              className="object-contain shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-500 ease-out" 
            />
          </div>
          <button className="absolute top-8 right-8 text-black/20 hover:text-black transition-colors">
            <X className="size-10" />
          </button>
        </div>
      )}
    </section>
  );
}

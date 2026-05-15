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
}

const BENTO_SLOTS: BentoSlot[] = [
  {
    id: 0,
    gridClass: "col-span-2 row-span-2",
    aspectClass: "aspect-square",
    purpose: "bento_square",
  },
  {
    id: 1,
    gridClass: "col-span-1 row-span-1",
    aspectClass: "aspect-[4/5]",
    purpose: "bento_portrait",
  },
  {
    id: 2,
    gridClass: "col-span-1 row-span-1",
    aspectClass: "aspect-[4/5]",
    purpose: "bento_portrait",
  },
  {
    id: 3,
    gridClass: "col-span-1 row-span-1",
    aspectClass: "aspect-[16/9]",
    purpose: "bento_landscape",
  },
  {
    id: 4,
    gridClass: "col-span-1 row-span-1",
    aspectClass: "aspect-[16/9]",
    purpose: "bento_landscape",
  },
];

interface ProfileGalleryProps {
  portfolio: PortfolioItem[];
}

/**
 * ProfileGallery — Professional Bento Grid.
 * Real photos only. Subtle rounded corners.
 */
export function ProfileGallery({ portfolio = [] }: ProfileGalleryProps) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const getItemForSlot = (position: number) => portfolio.find((i) => i.position === position);

  return (
    <section className="py-24 bg-white selection:bg-black selection:text-white">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        
        {/* Gallery Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-20 border-b border-black/5 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-[1px] bg-black/20" />
              <span className="text-[10px] uppercase tracking-[0.5em] font-black text-black/30">The Collection</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-serif font-light text-black tracking-tighter">
              Gallery
            </h2>
          </div>
        </div>

        {/* Bento Grid — Real Photos Only */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
          {BENTO_SLOTS.map((slot) => {
            const item = getItemForSlot(slot.id);
            
            return (
              <div
                key={slot.id}
                className={cn(
                  "group relative overflow-hidden bg-neutral-100 border border-black/[0.03] rounded-xl transition-all duration-700",
                  slot.gridClass,
                  slot.aspectClass,
                  item ? "cursor-zoom-in hover:shadow-2xl" : "opacity-100"
                )}
                onClick={() => item && setSelectedImg(getOptimizedImageUrl(item.mediaUrl, "lightbox"))}
              >
                {item && (
                  <Image
                    src={getOptimizedImageUrl(item.mediaUrl, slot.purpose)}
                    alt="Gallery Image"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-all duration-1000 group-hover:scale-110"
                  />
                )}

                {/* Subtle Overlay */}
                {item && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-opacity duration-500" />
                )}
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

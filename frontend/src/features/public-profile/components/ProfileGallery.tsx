"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getOptimizedImageUrl } from "@/lib/cloudinary-utils";
import type { PortfolioItem } from "@/lib/types/photographer";

interface ProfileGalleryProps {
  portfolio: PortfolioItem[];
}

export function ProfileGallery({ portfolio }: ProfileGalleryProps) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  
  // Create 8 slots for desktop (placeholder logic)
  const desktopSlots = Array.from({ length: 8 }).map((_, i) => portfolio[i] || null);
  
  // For mobile slideshow, we only show what actually exists
  const mobileSlides = portfolio;

  const getGridClasses = (index: number) => {
    switch (index) {
      case 0: return "md:col-span-1 md:row-span-2 md:min-h-[400px]"; 
      case 1: return "md:col-span-2 md:row-span-2 md:min-h-[400px]"; 
      case 2: return "md:col-span-1 md:row-span-1 md:min-h-[200px]"; 
      case 3: return "md:col-span-1 md:row-span-1 md:min-h-[200px]"; 
      default: return "md:col-span-1 md:row-span-1 md:min-h-[200px]"; 
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-black overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12">
        <div className="mb-16 flex justify-between items-end">
          <h2 className="text-4xl sm:text-5xl font-serif font-light text-white italic tracking-tighter">
            Selected Works
          </h2>
          
          {/* Mobile Arrows (Only if multiple images) */}
          {portfolio.length > 1 && (
            <div className="flex gap-2 md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                onClick={() => scroll("left")}
              >
                <ChevronLeft className="size-5 text-white/40" /> 
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                onClick={() => scroll("right")}
              >
                <ChevronRight className="size-5 text-white/40" />
              </Button>
            </div>
          )}
        </div>

        <div className="relative group/gallery">
          {/* Mobile Overlay Arrows */}
          {portfolio.length > 1 && (
            <>
              <div className="absolute inset-y-0 left-2 z-10 flex items-center md:hidden pointer-events-none">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white pointer-events-auto active:scale-95 transition-all"
                  onClick={() => scroll("left")}
                >
                  <ChevronLeft className="size-5" />
                </Button>
              </div>
              <div className="absolute inset-y-0 right-2 z-10 flex items-center md:hidden pointer-events-none">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white pointer-events-auto active:scale-95 transition-all"
                  onClick={() => scroll("right")}
                >
                  <ChevronRight className="size-5" />
                </Button>
              </div>
            </>
          )}

          {/* Desktop View (Fixed 8-slot Grid) */}
          <div className="hidden md:grid md:grid-cols-4 gap-4 auto-rows-fr">
            {desktopSlots.map((item, index) => {
              if (!item) {
                return (
                  <div 
                    key={`desktop-placeholder-${index}`}
                    className={cn(
                      "bg-neutral-900 flex items-center justify-center opacity-20 border border-white/5",
                      getGridClasses(index)
                    )}
                  >
                    <div className="w-8 h-px bg-white/20" />
                  </div>
                );
              }

              const thumb = getOptimizedImageUrl(item.mediaUrl, index === 1 ? "gallery" : "thumbnail");
              const full = getOptimizedImageUrl(item.mediaUrl, "lightbox");

              return (
                <div 
                  key={`desktop-${item._id}`} 
                  className={cn(
                    "group relative overflow-hidden bg-neutral-900 cursor-zoom-in",
                    getGridClasses(index)
                  )}
                  onClick={() => setSelectedImg(full)}
                >
                  <Image 
                    src={thumb} 
                    alt="Portfolio Work" 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out" 
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              );
            })}
          </div>

          {/* Mobile View (Dynamic Slideshow) */}
          <div 
            ref={scrollRef}
            className="flex md:hidden gap-0 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8"
          >
            {mobileSlides.map((item) => {
              const thumb = getOptimizedImageUrl(item.mediaUrl, "thumbnail");
              const full = getOptimizedImageUrl(item.mediaUrl, "lightbox");

              return (
                <div 
                  key={`mobile-${item._id}`} 
                  className="w-full h-[450px] shrink-0 snap-center relative overflow-hidden bg-neutral-900 cursor-zoom-in"
                  onClick={() => setSelectedImg(full)}
                >
                  <Image 
                    src={thumb} 
                    alt="Portfolio Work" 
                    fill 
                    sizes="100vw"
                    className="object-cover" 
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-300"
          onClick={() => setSelectedImg(null)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <Image 
              src={selectedImg} 
              alt="Full size view" 
              fill
              className="object-contain shadow-2xl animate-in zoom-in-95 duration-500" 
            />
          </div>
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
            <X className="size-8" />
          </button>
        </div>
      )}
    </section>
  );
}

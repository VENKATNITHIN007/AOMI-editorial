"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Section } from "@/components/Section";
import { NAV_PATHS } from "@/lib/constants/nav";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  {
    name: "Wedding",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80",
    href: `${NAV_PATHS.DISCOVERY}?specialty=wedding`,
  },
  {
    name: "Portrait",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80",
    href: `${NAV_PATHS.DISCOVERY}?specialty=portrait`,
  },
  {
    name: "Fashion",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80",
    href: `${NAV_PATHS.DISCOVERY}?specialty=fashion`,
  },
  {
    name: "Commercial",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80",
    href: `${NAV_PATHS.DISCOVERY}?specialty=commercial`,
  },
];

export function CategoryGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <Section variant="default" spacing="compact" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 mb-12">
        <Section.Header
          title="Specialties"
          align="left"
          className="m-0 font-light tracking-[0.5em] uppercase text-[10px] text-gray-400"
        />
      </div>

      <div className="relative group/slider">
        {/* Navigation Arrows - Overlay Style */}
        <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-4 md:hidden pointer-events-none">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white shadow-2xl pointer-events-auto hover:bg-white/40 active:scale-95 transition-all"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="absolute inset-y-0 right-0 z-10 flex items-center pr-4 md:hidden pointer-events-none">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white shadow-2xl pointer-events-auto hover:bg-white/40 active:scale-95 transition-all"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Categories Container */}
        <div 
          ref={scrollRef}
          className="flex md:grid md:grid-cols-4 gap-1 overflow-x-auto md:overflow-x-visible scrollbar-hide snap-x snap-mandatory px-4 md:px-0"
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative min-w-[85vw] sm:min-w-[45vw] md:min-w-0 h-[500px] sm:h-[600px] md:h-[650px] overflow-hidden bg-gray-100 snap-center shrink-0 md:shrink"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 md:group-hover:bg-black/40 transition-colors duration-500" />

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl sm:text-4xl font-serif font-light text-white tracking-widest uppercase md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}

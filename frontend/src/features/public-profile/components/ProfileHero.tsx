"use client";

import React from "react";
import Image from "next/image";
import { getOptimizedImageUrl } from "@/lib/cloudinary-utils";

interface ProfileHeroProps {
  name: string;
  heroImage?: string;
  tagline?: string;
}

export function ProfileHero({ name, heroImage, tagline }: ProfileHeroProps) {
  const desktopHero = getOptimizedImageUrl(heroImage, "hero"); // 1920x1080 (16:9)
  const mobileHero = getOptimizedImageUrl(heroImage, "portrait"); // 800x1000 (4:5)

  return (
    <section className="relative h-[85vh] md:h-screen w-full flex items-end pb-24 md:pb-32 overflow-hidden bg-neutral-950">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {heroImage ? (
          <picture>
            <source media="(max-width: 767px)" srcSet={mobileHero} />
            <source media="(min-width: 768px)" srcSet={desktopHero} />
            <Image 
              src={desktopHero || ""}
              alt={name}
              fill
              priority
              className="object-cover transition-transform duration-[2s] ease-out hover:scale-105"
            />
          </picture>
        ) : (
          <div className="w-full h-full bg-neutral-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-12">
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl sm:text-7xl lg:text-[7.5rem] leading-[1] font-serif font-light text-white tracking-tighter">
            {name}
          </h1>
          {tagline && (
            <div className="flex items-center gap-6 mt-2">
              <span className="h-px w-12 bg-white/40" />
              <h2 className="text-[10px] uppercase tracking-[0.6em] font-black text-white/60">
                {tagline}
              </h2>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

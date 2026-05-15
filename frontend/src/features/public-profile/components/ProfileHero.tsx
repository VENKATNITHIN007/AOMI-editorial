"use client";

import React from "react";
import Image from "next/image";
import { Instagram, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getOptimizedImageUrl } from "@/lib/cloudinary-utils";
import { Button } from "@/components/ui/button";

interface ProfileHeroProps {
  name: string;
  heroImage?: string;
  tagline?: string;
  avatar?: string;
  email?: string;
  instagram?: string;
}

/**
 * ProfileHero — Clean identity over a cinematic backdrop.
 * Avatar → Name → Category in a tight vertical stack, contact in a separate row.
 */
export function ProfileHero({
  name,
  heroImage,
  tagline,
  avatar,
  email,
  instagram,
}: ProfileHeroProps) {
  const desktopHero = getOptimizedImageUrl(heroImage, "hero");
  const mobileHero = getOptimizedImageUrl(heroImage, "portrait");
  const optimizedAvatar = avatar ? getOptimizedImageUrl(avatar, "avatar") : undefined;

  return (
    <section className="relative h-screen md:h-screen w-full flex items-end overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        {heroImage ? (
          <picture>
            <source media="(max-width: 767px)" srcSet={mobileHero} />
            <source media="(min-width: 768px)" srcSet={desktopHero} />
            <Image
              src={desktopHero || ""}
              alt={name}
              fill
              priority
              className="object-cover"
            />
          </picture>
        ) : (
          <div className="w-full h-full bg-neutral-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
      </div>

      {/* Content Layer — Minimalist Caption Style */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-12 pb-10 sm:pb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        {/* Identity */}
        <div className="space-y-4">
          <div className="relative inline-block">
            <Avatar className="size-10 sm:size-12 border border-white/20 shadow-2xl">
              <AvatarImage src={optimizedAvatar} className="object-cover" />
              <AvatarFallback className="bg-neutral-800 text-white text-[10px] font-serif">
                {name[0]}
              </AvatarFallback>
            </Avatar>
            <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 size-4 text-blue-500 fill-blue-500 stroke-black" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light text-white tracking-tighter leading-none">
              {name}
            </h1>
            {tagline && (
              <p className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-[0.6em] font-black max-w-sm leading-relaxed">
                {tagline}
              </p>
            )}
          </div>
        </div>

        {/* Action row — Compacted */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-8 pt-6 border-t border-white/5">
          <div className="flex items-center gap-6">
            {instagram && (
              <a
                href={`https://instagram.com/${instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-white/20 hover:text-white transition-all duration-500"
              >
                <Instagram className="size-3.5" />
                <span className="text-[8px] font-black uppercase tracking-[0.4em]">
                  {instagram}
                </span>
              </a>
            )}
          </div>

          <div className="sm:ml-auto">
            {email && (
              <Button
                asChild
                className="h-10 px-8 rounded-full bg-white text-black hover:bg-black hover:text-white border border-white transition-all duration-500 text-[8px] font-black uppercase tracking-[0.3em] shadow-xl"
              >
                <a href={`mailto:${email}`}>Book Studio</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

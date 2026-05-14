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
    <section className="relative h-[85vh] md:h-screen w-full flex items-end overflow-hidden bg-black">
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

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-12 pb-16 sm:pb-20">
        {/* Identity */}
        <div className="mb-10">
          <div className="relative inline-block mb-6">
            <Avatar className="size-16 sm:size-20 border-2 border-white/15">
              <AvatarImage src={optimizedAvatar} className="object-cover" />
              <AvatarFallback className="bg-neutral-800 text-white text-lg font-serif">
                {name[0]}
              </AvatarFallback>
            </Avatar>
            <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 size-5 sm:size-6 text-blue-500 fill-blue-500 stroke-black" />
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-light text-white tracking-tight leading-[0.95]">
            {name}
          </h1>
        </div>

        {/* Action row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-8 border-t border-white/10">
          {tagline && (
            <p className="text-sm text-white/30 font-light max-w-xs leading-relaxed">
              {tagline}
            </p>
          )}

          <div className="flex items-center gap-6 sm:ml-auto">
            {instagram && (
              <a
                href={`https://instagram.com/${instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-white/35 hover:text-white transition-colors"
              >
                <Instagram className="size-[18px]" />
                <span className="text-[11px] font-medium tracking-wide">
                  {instagram}
                </span>
              </a>
            )}
            {email && (
              <Button
                asChild
                className="h-11 px-8 rounded-none bg-white text-black hover:bg-white/90 text-[11px] font-semibold tracking-wide transition-colors"
              >
                <a href={`mailto:${email}`}>Contact</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

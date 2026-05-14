"use client";

import React from "react";
import Image from "next/image";
import { Mail, Instagram, MapPin, Camera, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOptimizedImageUrl as getCloudinaryUrl } from "@/lib/cloudinary-utils";

interface ProfileAboutProps {
  name: string;
  bio?: string;
  aboutImage?: string;
  email?: string;
  instagram?: string;
  specialties?: string[];
  location?: string;
  priceFrom?: string;
}

/**
 * ProfileAbout — A compact, airy editorial section.
 * Optimized for whitespace and vertical efficiency.
 */
export function ProfileAbout({
  name,
  bio,
  aboutImage,
  email,
  instagram,
  specialties,
  location,
  priceFrom,
}: ProfileAboutProps) {
  const optimizedAbout = aboutImage
    ? getCloudinaryUrl(aboutImage, "thumbnail")
    : undefined;

  return (
    <section className="py-20 sm:py-24 bg-neutral-100 border-t border-black/[0.03]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-32 items-center">
          
          {/* Visual Anchor — Small & High Impact */}
          <div className="lg:col-span-3">
            <div className="relative aspect-square bg-neutral-50 overflow-hidden shadow-sm">
              {optimizedAbout ? (
                <Image
                  src={optimizedAbout}
                  alt={name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 300px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-neutral-100" />
              )}
            </div>
          </div>

          {/* Narrative Content — Airy & Compact */}
          <div className="lg:col-span-9 space-y-12">
            <div className="space-y-6">
              <span className="text-[10px] uppercase tracking-[0.5em] font-black text-black/20 block">The Story</span>
              <p className="text-2xl sm:text-4xl font-serif font-light text-black tracking-tight leading-relaxed max-w-3xl italic opacity-80">
                {bio || "A visual storyteller who believes every moment deserves to be remembered forever."}
              </p>
            </div>

            {/* Metadata Row — Horizontal & Clean */}
            <div className="flex flex-wrap items-start gap-x-16 gap-y-10 pt-10 border-t border-black/[0.05]">
              
              {location && (
                <div className="space-y-3">
                  <span className="text-[9px] uppercase tracking-[0.4em] font-black text-black/20 block">Location</span>
                  <div className="flex items-center gap-2 text-black/60">
                    <MapPin className="size-3.5" />
                    <span className="text-xs font-black uppercase tracking-widest">{location}</span>
                  </div>
                </div>
              )}

              {specialties && specialties.length > 0 && (
                <div className="space-y-3">
                  <span className="text-[9px] uppercase tracking-[0.4em] font-black text-black/20 block">Focus</span>
                  <div className="flex items-center gap-2 text-black/60">
                    <Camera className="size-3.5" />
                    <span className="text-xs font-black uppercase tracking-widest">{specialties[0]}</span>
                  </div>
                </div>
              )}

              {priceFrom && (
                <div className="space-y-3">
                  <span className="text-[9px] uppercase tracking-[0.4em] font-black text-black/20 block">Rates</span>
                  <p className="text-xs font-black uppercase tracking-widest text-black/60">From ₹{priceFrom}</p>
                </div>
              )}

              {instagram && (
                <div className="space-y-3">
                  <span className="text-[9px] uppercase tracking-[0.4em] font-black text-black/20 block">Social</span>
                  <a
                    href={`https://instagram.com/${instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-black/40 hover:text-black transition-colors"
                  >
                    <Instagram className="size-3.5" />
                    <span className="text-xs font-black uppercase tracking-widest">{instagram}</span>
                  </a>
                </div>
              )}

              {/* Action Button Integrated into Row */}
              {email && (
                <div className="sm:ml-auto">
                   <Button asChild className="h-14 px-10 rounded-none bg-black text-white hover:bg-neutral-900 text-[10px] uppercase tracking-[0.4em] font-black transition-all">
                    <a href={`mailto:${email}`} className="flex items-center gap-4">
                      Contact Studio <ArrowRight className="size-4" />
                    </a>
                  </Button>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

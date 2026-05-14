"use client";

import React from "react";
import Image from "next/image";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOptimizedImageUrl as getCloudinaryUrl } from "@/lib/cloudinary-utils";

interface ProfileAboutProps {
  name: string;
  bio?: string;
  aboutImage?: string;
  priceFrom?: string;
  specialties?: string[];
  email?: string;
}

export function ProfileAbout({ 
  name, 
  bio, 
  aboutImage, 
  priceFrom, 
  specialties, 
  email 
}: ProfileAboutProps) {
  const optimizedAbout = aboutImage ? getCloudinaryUrl(aboutImage, "thumbnail") : undefined;

  return (
    <section className="py-16 sm:py-24 bg-black border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          <div className="flex justify-center lg:justify-start">
            <div className="relative aspect-[4/5] w-full max-w-[260px] sm:max-w-[320px] bg-neutral-900 group overflow-hidden">
              {optimizedAbout ? (
                <Image 
                  src={optimizedAbout} 
                  alt={`About ${name}`} 
                  fill
                  className="object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" 
                />
              ) : (
                <div className="w-full h-full bg-neutral-800" />
              )}
            </div>
          </div>

          {/* Content Column */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4 sm:gap-6">
              <h2 className="text-3xl sm:text-6xl font-serif font-light text-white tracking-tighter leading-tight">
                {name}
              </h2>
              <p className="text-sm sm:text-lg text-white/50 font-serif italic leading-relaxed max-w-lg">
                {bio || "Capturing the moments that define a lifetime."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 border-y border-white/5 py-10 sm:py-12">
              <div className="flex flex-col gap-2 sm:gap-3">
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.4em] font-black text-white/30">Investment</span>
                <span className="text-base sm:text-lg font-serif text-white">From ₹{priceFrom || "5,000"}</span>
              </div>
              
              <div className="flex flex-col gap-2 sm:gap-3">
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.4em] font-black text-white/30">Specialties</span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-white/60 leading-loose">
                  {specialties?.length ? specialties.join(" • ") : "Portraits • Lifestyle • Events"}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {email && (
                <Button asChild className="w-full sm:w-auto rounded-none bg-white text-black hover:bg-neutral-200 px-12 h-14 text-[10px] uppercase tracking-[0.4em] font-black shadow-2xl">
                  <a href={`mailto:${email}`}>
                    <Mail className="size-4 mr-3" /> Contact Photographer
                  </a>
                </Button>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOptimizedImageUrl } from "@/lib/cloudinary-utils";

interface ProfileAboutProps {
  name: string;
  bio?: string;
  aboutImage?: string;
  priceFrom?: string;
  specialties?: string[];
  instagram?: string;
  email?: string;
}

export function ProfileAbout({ 
  name, 
  bio, 
  aboutImage, 
  priceFrom, 
  specialties, 
  instagram, 
  email 
}: ProfileAboutProps) {
  const optimizedAbout = getOptimizedImageUrl(aboutImage, "thumbnail");

  return (
    <section className="py-24 bg-black border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div className="flex justify-center lg:justify-start">
            <div className="relative aspect-[4/5] w-full max-w-[320px] bg-neutral-900 group overflow-hidden">
              {aboutImage ? (
                <img 
                  src={optimizedAbout} 
                  alt={`About ${name}`} 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" 
                />
              ) : (
                <div className="w-full h-full bg-neutral-800" />
              )}
            </div>
          </div>

          {/* Content Column */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6">
              <h2 className="text-5xl sm:text-6xl font-serif font-light text-white tracking-tighter leading-tight">
                {name}
              </h2>
              <p className="text-lg text-white/50 font-serif italic leading-relaxed max-w-lg">
                {bio || "Capturing the moments that define a lifetime."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 border-y border-white/5 py-12">
              <div className="flex flex-col gap-3">
                <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white/30">Investment</span>
                <span className="text-lg font-serif text-white">From ₹{priceFrom || "5,000"}</span>
              </div>
              
              <div className="flex flex-col gap-3">
                <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white/30">Specialties</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60 leading-loose">
                  {specialties?.length ? specialties.join(" • ") : "Portraits • Lifestyle • Events"}
                </span>
              </div>
            </div>

            <div className="flex flex-row items-center gap-4">
              {instagram && (
                <Button asChild className="rounded-none bg-white text-black hover:bg-neutral-200 px-8 h-12 text-[10px] uppercase tracking-[0.3em] font-black">
                  <a href={instagram} target="_blank" rel="noreferrer">
                    <Instagram className="size-4 mr-2" /> Instagram
                  </a>
                </Button>
              )}
              {email && (
                <Button asChild variant="outline" className="rounded-none border-white/20 text-white hover:bg-white/5 px-8 h-12 text-[10px] uppercase tracking-[0.3em] font-black">
                  <a href={`mailto:${email}`}>
                    <Mail className="size-4 mr-2" /> Contact
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

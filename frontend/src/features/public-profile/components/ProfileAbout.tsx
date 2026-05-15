"use client";

import React from "react";
import Image from "next/image";
import { Mail, Instagram, MapPin, Camera } from "lucide-react";
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
 * ProfileAbout — A premium editorial profile section.
 * Featuring a dual-tone background, rich typography, and smooth entrance animations.
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
    <section className="py-12 sm:py-24 lg:py-32 bg-[#0a0a0a] border-t border-white/[0.03] overflow-hidden text-white">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-24 items-start">
          
          {/* Left: Cinematic Portrait with Animation */}
          <div className="lg:col-span-4 group animate-in fade-in slide-in-from-left-8 duration-1000 ease-out">
            <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] bg-neutral-900 overflow-hidden shadow-2xl max-w-[280px] sm:max-w-none mx-auto lg:mx-0">
              {optimizedAbout ? (
                <Image
                  src={optimizedAbout}
                  alt={name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-neutral-800" />
              )}
              <div className="absolute inset-0 ring-1 ring-white/5 ring-inset" />
            </div>
            
            {/* Signature detail — hidden on tiny screens to save space */}
            <div className="mt-6 hidden sm:flex items-center gap-4 opacity-20">
              <div className="h-[1px] w-12 bg-white" />
              <span className="text-[8px] uppercase tracking-[0.4em] font-black">{name} &copy; STUDIO</span>
            </div>
          </div>

          {/* Right: Narrative & Metadata with Animation */}
          <div className="lg:col-span-8 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 ease-out">
            <div className="space-y-6 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <div className="w-8 h-[1px] bg-white/10" />
                <span className="text-[10px] uppercase tracking-[0.5em] font-black text-white/20">The Visionary</span>
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-white tracking-tight leading-[1.1]">{name}</h2>
              <p className="text-lg sm:text-2xl lg:text-3xl font-serif font-light text-white/60 tracking-tight leading-relaxed max-w-3xl">
                {bio || "A visual storyteller who believes every moment deserves to be remembered forever through a lens of authenticity and elegance."}
              </p>
            </div>

            {/* Detailed Info Grid — 2 columns on mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-10 pt-10 border-t border-white/5">
              
              {/* Column 1: Professional Details */}
              <div className="col-span-2 sm:col-span-1 space-y-10">
                {specialties && specialties.length > 0 && (
                  <div className="space-y-4">
                    <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20 block">Expertise</span>
                    <div className="flex flex-wrap gap-2">
                      {specialties.map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 text-[8px] font-black uppercase tracking-widest text-white/50 rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Responsive sub-grid for Location/Rates to stay side-by-side */}
              <div className="col-span-2 sm:col-span-1 grid grid-cols-2 gap-8">
                {location && (
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20 block">Based In</span>
                    <div className="flex items-center gap-2 text-white/80">
                      <MapPin className="size-3" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{location}</span>
                    </div>
                  </div>
                )}
                
                {priceFrom && (
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20 block">Rates</span>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">₹{priceFrom}+</p>
                  </div>
                )}
              </div>

              {/* Column 2: Simplified Engagement — More horizontal on mobile */}
              <div className="col-span-2 space-y-10 lg:pl-12 lg:border-l lg:border-white/5 pt-10 lg:pt-0 border-t lg:border-t-0 border-white/5">
                <div className="space-y-6">
                  <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20 block">Contact</span>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-12">
                    {email && (
                      <Button 
                        asChild
                        className="h-11 px-8 rounded-full bg-white text-black hover:bg-neutral-200 transition-all text-[9px] uppercase tracking-[0.3em] font-black w-full sm:w-fit shadow-xl"
                      >
                        <a href={`mailto:${email}`}>
                          Send Inquiry
                        </a>
                      </Button>
                    )}

                    {instagram && (
                      <Button 
                        asChild
                        variant="outline"
                        className="h-11 px-8 rounded-full border-white/20 text-white hover:bg-white hover:text-black transition-all text-[9px] uppercase tracking-[0.3em] font-black w-full sm:w-fit"
                      >
                        <a 
                          href={`https://instagram.com/${instagram.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Instagram className="size-3.5" />
                          Instagram
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <p className="text-[8px] text-white/20 uppercase tracking-[0.3em] font-black leading-relaxed">
                    Available for commissions &bull; Response within 24h
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

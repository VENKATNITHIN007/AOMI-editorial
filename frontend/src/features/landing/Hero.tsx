"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/Section";
import { NAV_PATHS } from "@/lib/constants/nav";
import { usePrimaryCta } from "@/features/auth/hooks/usePrimaryCta";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const { label: ctaLabel, path: ctaPath } = usePrimaryCta();

  return (
    <Section
      variant="default"
      className="relative h-[90vh] flex items-center overflow-hidden bg-black text-white p-0"
    >
      <div className="absolute inset-0 z-0 opacity-60">
        <Image
          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80"
          alt="Premium photography background"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8">
        <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] mix-blend-difference">
              The Art of <br />
              <span className="italic font-light opacity-80">Discovery.</span>
            </h1>
          </div>

          <p className="max-w-xl text-base sm:text-lg md:text-xl font-light text-gray-300 leading-relaxed uppercase tracking-widest mix-blend-difference">
            Connect with the world&apos;s most elite photographers. A curated platform for visual excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 pt-6 items-start sm:items-center">
            <Link href={NAV_PATHS.DISCOVERY}>
              <Button size="lg" className="h-14 sm:h-16 px-10 sm:px-12 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-black bg-white text-black hover:bg-gray-200 rounded-none shadow-2xl transition-all hover:scale-105">
                Explore Gallery
              </Button>
            </Link>

            <Link
              href={ctaPath}
              className="flex items-center gap-3 group text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold text-white hover:text-gray-300 transition-colors"
            >
              {ctaLabel}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

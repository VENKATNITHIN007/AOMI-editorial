"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/Section";
import { NAV_PATHS } from "@/lib/constants/nav";
import { usePrimaryCta } from "@/hooks/usePrimaryCta";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const { label: ctaLabel, path: ctaPath } = usePrimaryCta();

  return (
    <Section
      variant="default"
      className="relative h-screen flex items-center overflow-hidden bg-black text-white p-0"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-white/40 block mb-6">Established 2026</span>
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.8] mix-blend-difference">
              The Art of <br />
              <span className="italic font-light opacity-80">Discovery.</span>
            </h1>
          </div>

          <p className="max-w-xl text-xs sm:text-base md:text-xl font-light text-gray-300 leading-relaxed uppercase tracking-[0.25em] mix-blend-difference opacity-80">
            Connect with the world&apos;s most elite photographers.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 pt-6 items-center md:items-start w-full sm:w-auto">
            <Link href={NAV_PATHS.DISCOVERY} className="w-full sm:w-auto">
              <Button size="lg" className="h-16 px-12 text-[11px] uppercase tracking-[0.4em] font-black bg-white text-black hover:bg-neutral-100 rounded-none shadow-2xl transition-all hover:scale-[1.02] w-full sm:w-auto">
                Explore Photographers
              </Button>
            </Link>

            <Link
              href={ctaPath}
              className="flex items-center gap-3 group text-[11px] uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold text-white hover:text-gray-300 transition-colors py-4 px-2"
            >
              <span className="whitespace-nowrap">{ctaLabel}</span>
              <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

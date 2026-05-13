"use client";

import React from "react";
import Link from "next/link";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { usePrimaryCta } from "@/hooks/usePrimaryCta";
import { ArrowRight } from "lucide-react";

export function StudioCTA() {
  const { label, path } = usePrimaryCta();

  return (
    <Section variant="default" className="py-24 sm:py-48 bg-zinc-950 text-white overflow-hidden">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 sm:gap-24 px-6 sm:px-8">
        <div className="space-y-10 sm:space-y-12 flex-1">
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.8] uppercase italic">
            Own Your <br />
            <span className="not-italic text-white">Creative.</span>
          </h2>

          <div className="flex flex-col gap-5 font-medium text-[9px] tracking-[0.5em] uppercase text-gray-500">
            <div className="flex items-center gap-5 border-b border-white/5 pb-5 md:border-none md:pb-0">
              <span className="w-1.5 h-1.5 bg-white rotate-45 shrink-0" />
              <span>Claim your unique professional handle</span>
            </div>
            <div className="flex items-center gap-5">
              <span className="w-1.5 h-1.5 bg-white rotate-45 shrink-0" />
              <span>Direct client connection, zero commission</span>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <Link href={path}>
            <Button size="lg" className="w-full h-16 sm:h-20 px-10 sm:px-16 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[0.6em] bg-white hover:bg-neutral-100 text-black rounded-none shadow-2xl transition-all hover:scale-[1.02]">
              <span className="whitespace-nowrap">{label}</span>
              <ArrowRight className="ml-4 size-4 shrink-0" />
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}

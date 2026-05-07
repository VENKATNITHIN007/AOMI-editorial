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
    <Section variant="default" className="py-32 sm:py-48 bg-zinc-900 text-white">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 sm:gap-24 px-8">
        <div className="space-y-8 sm:space-y-12 flex-1">
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic opacity-90">
            Own Your <br />
            <span className="not-italic text-white">Creative.</span>
          </h2>

          <div className="flex flex-col gap-4 sm:gap-6 font-medium text-[10px] tracking-[0.3em] uppercase text-gray-400">
            <div className="flex items-center gap-6">
              <span className="w-2 h-2 bg-white rotate-45 shrink-0" />
              <span>Claim your unique professional handle</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="w-2 h-2 bg-white rotate-45 shrink-0" />
              <span>Direct client connection, zero commission</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 w-full md:w-auto">
          <Link href={path}>
            <Button size="lg" className="w-full h-16 sm:h-20 px-12 sm:px-16 text-xs font-black uppercase tracking-[0.4em] bg-white hover:bg-gray-200 text-black rounded-none shadow-2xl transition-all hover:scale-[1.02]">
              {label}
              <ArrowRight className="ml-4 size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}

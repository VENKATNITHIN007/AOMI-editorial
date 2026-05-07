"use client";

import Link from "next/link";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_PATHS, STUDIO_CTA } from "@/lib/constants/nav";

export function BecomePhotographerCTA() {
  return (
    <div className="bg-black text-white p-8 sm:p-12 relative overflow-hidden group shadow-2xl">
      {/* Abstract background element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/5 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-150" />
      
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
        <div className="space-y-4 max-w-lg">
          <h3 className="text-2xl sm:text-3xl font-light uppercase tracking-widest text-white">
            Own Your <span className="italic font-normal text-gray-300">Creative</span>
          </h3>
          <p className="text-xs sm:text-sm font-light tracking-widest text-gray-400 leading-relaxed uppercase">
            Join Photophile's exclusive network. Showcase your portfolio to clients directly.
          </p>
        </div>
        
        <Link href={NAV_PATHS.ONBOARDING} className="shrink-0">
          <Button className="h-14 px-8 bg-white text-black hover:bg-gray-200 hover:scale-105 rounded-none text-[10px] uppercase tracking-[0.25em] font-bold transition-all flex items-center shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            <Camera className="mr-3 h-4 w-4" />
            {STUDIO_CTA.LABEL}
          </Button>
        </Link>
      </div>
    </div>
  );
}

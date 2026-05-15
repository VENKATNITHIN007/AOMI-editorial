import React from "react";
import Link from "next/link";
import { Camera, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_PATHS, STUDIO_CTA } from "@/lib/constants/nav";
import { cn } from "@/lib/utils";

interface StudioCTAProps {
  className?: string;
  variant?: "card" | "section";
}

/**
 * Unified Studio CTA.
 * Used in both Profile Settings (card) and Landing Page (section).
 */
export function StudioCTA({ className, variant = "card" }: StudioCTAProps) {
  const isSection = variant === "section";

  return (
    <div 
      className={cn(
        "relative bg-black text-white overflow-hidden group shadow-2xl",
        isSection ? "py-24 sm:py-32 px-6 sm:px-12" : "p-10 sm:p-16 rounded-[2.5rem]",
        className
      )}
    >
      {/* Decorative Light Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/[0.03] rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
      <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-gray-500/[0.05] rounded-full blur-[40px]" />
      
      <div className={cn(
        "relative z-10 flex flex-col gap-12",
        isSection ? "max-w-7xl mx-auto md:flex-row md:items-center md:justify-between" : "lg:flex-row lg:items-center lg:justify-between"
      )}>
        <div className="space-y-6 max-w-lg text-left">
          <div className="flex items-center gap-3">
             <div className="h-px w-8 bg-white/20" />
             <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Exclusive Opportunity</p>
          </div>
          <h3 className={cn(
            "font-thin uppercase tracking-tighter text-white leading-tight",
            isSection ? "text-5xl sm:text-7xl" : "text-3xl sm:text-5xl"
          )}>
            Launch Your <span className="italic font-serif text-gray-400">Studio</span>
          </h3>
          <p className="text-xs font-light tracking-[0.2em] text-gray-500 leading-relaxed uppercase">
            Join a curated network of elite photographers. Showcase your portfolio to clients in a premium, high-end environment.
          </p>
        </div>
        
        <Link href={NAV_PATHS.ONBOARDING} className="shrink-0 group/btn">
          <Button className="h-16 px-10 bg-white text-black hover:bg-gray-100 rounded-full text-[10px] uppercase tracking-[0.3em] font-black transition-all flex items-center shadow-2xl hover:-translate-y-1">
            <Camera className="mr-4 h-4 w-4" />
            {STUDIO_CTA.LABEL}
            <ArrowRight className="ml-0 w-0 h-4 opacity-0 transition-all duration-500 group-hover/btn:ml-4 group-hover/btn:w-4 group-hover/btn:opacity-100" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

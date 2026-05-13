import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "minimal";
  showSubtitle?: boolean;
}

/**
 * ΛOMI Logo - Enhanced brand hierarchy
 * ΛOMI (Primary) + Editorial (Sophisticated Subtitle)
 */
export function Logo({ className, variant = "default", showSubtitle = true }: LogoProps) {
  return (
    <div className={cn("inline-flex flex-col items-start gap-1", className)}>
      <span className={cn(
        "font-black uppercase tracking-[0.4em] inline-flex items-center text-current leading-none",
      )}>
        <span className="relative flex items-center justify-center">
          <span className="text-[1.1em] translate-y-[-1px] font-light">Λ</span>
          <span className="opacity-0 absolute">A</span>
        </span>
        <span className="ml-[-0.05em]">OMI</span>
      </span>
      
      {showSubtitle && variant !== "minimal" && (
        <span className="text-[0.6em] uppercase tracking-[0.5em] font-medium text-gray-400 ml-[0.2em] leading-none">
          Editorial
        </span>
      )}
    </div>
  );
}

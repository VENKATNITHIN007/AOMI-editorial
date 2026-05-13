"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StudioCardProps {
  number: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  description?: string;
}

/**
 * StudioCard - Visual foundation for the Photographer Dashboard.
 * Implements the "Editorial" design: numbered headers and living borders.
 */
export function StudioCard({ 
  number, 
  title, 
  children, 
  className,
  description 
}: StudioCardProps) {
  return (
    <section className="group/card space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Editorial Number & Title */}
      <div className="flex items-baseline gap-3 px-2">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 group-hover/card:text-black transition-colors duration-500">
          {number} /
        </span>
        <div className="space-y-1">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover/card:text-black transition-colors duration-500">
            {title}
          </h2>
          {description && (
            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest leading-none">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Main Surface with Living Border */}
      <div className={cn(
        "bg-white border border-black/10 transition-all duration-500 relative",
        "group-hover/card:border-black/30 group-hover/card:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)]",
        className
      )}>
        {children}
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudioProgressHeaderProps {
  completedSteps: number;
  totalSteps: number;
}

const STEP_LABELS = ["Details", "Cover", "About", "Card", "Grid"];

/**
 * StudioProgressHeader — Ultra-compact sticky tracker.
 * Only shows the progress line and step indicators.
 */
export function StudioProgressHeader({ completedSteps, totalSteps }: StudioProgressHeaderProps) {
  const percentage = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-black/5 shadow-sm overflow-hidden">
      {/* Progress Bar (Top Edge) */}
      <div className="h-[2px] bg-gray-100 w-full relative">
        <div
          className="absolute inset-y-0 left-0 bg-black transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 sm:gap-0 w-full justify-between">
          {STEP_LABELS.map((label, idx) => {
            const isDone = idx < completedSteps;
            const isCurrent = idx === completedSteps;
            
            return (
              <React.Fragment key={label}>
                <div className="flex items-center gap-1.5 shrink-0 group">
                  <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-500",
                    isDone 
                      ? "bg-green-50 border-green-200 text-green-700" 
                      : isCurrent 
                        ? "border-black bg-black text-white" 
                        : "border-gray-100 text-gray-300"
                  )}>
                    {isDone ? (
                      <CheckCircle2 className="size-3" />
                    ) : (
                      <Circle className={cn("size-2.5", isCurrent ? "fill-white" : "")} />
                    )}
                    <span className="text-[8px] font-black uppercase tracking-widest hidden sm:inline">
                      {label}
                    </span>
                    <span className="text-[8px] font-black sm:hidden">
                      {idx + 1}
                    </span>
                  </div>
                </div>

                {idx < STEP_LABELS.length - 1 && (
                  <div className={cn(
                    "hidden sm:block h-px flex-1 mx-4 transition-colors duration-500",
                    isDone ? "bg-green-300" : "bg-gray-100"
                  )} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        
        {/* Compact Percentage (Mobile Only) */}
        <div className="sm:hidden pl-4 border-l border-black/5 shrink-0">
          <span className="text-[10px] font-black text-black">
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
}

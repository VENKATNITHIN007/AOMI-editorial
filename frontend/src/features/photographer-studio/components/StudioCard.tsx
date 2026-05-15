"use client";

import React from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { Page } from "@/components/Page";
import { cn } from "@/lib/utils";

interface StudioCardProps {
  step: number;
  totalSteps?: number;
  title: string;
  isComplete?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * StudioCard — Wrapper for each studio setup step.
 * Shows a numbered header with completion status badge (icon + label).
 * Refactored using Page primitives for enhanced editorial structure.
 */
export function StudioCard({
  step,
  totalSteps = 5,
  title,
  isComplete = false,
  className,
  children,
}: StudioCardProps) {
  return (
    <Page.Stack className="group/card gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Step Header */}
      <Page.Row className="items-center justify-between px-2">
        {/* Number + Title */}
        <Page.Row className="items-baseline gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 group-hover/card:text-black transition-colors duration-500">
            {String(step).padStart(2, "0")}&nbsp;/&nbsp;{String(totalSteps).padStart(2, "0")}
          </span>
          <h2 className="text-[12px] font-black uppercase tracking-[0.25em] text-gray-800 group-hover/card:text-black transition-colors duration-500">
            {title}
          </h2>
        </Page.Row>

        {/* Status Badge */}
        <Page.Row
          className={cn(
            "items-center gap-1.5 px-3 py-1.5 border text-[8px] font-black uppercase tracking-widest transition-all duration-500",
            isComplete
              ? "border-green-500/25 bg-green-50 text-green-700"
              : "border-black/5 bg-gray-50 text-gray-400 group-hover/card:border-black/10"
          )}
        >
          {isComplete ? (
            <CheckCircle2 className="size-3 shrink-0" />
          ) : (
            <Clock className="size-3 shrink-0" />
          )}
          {isComplete ? "Completed" : "Pending"}
        </Page.Row>
      </Page.Row>

      {/* Card Surface */}
      <div
        className={cn(
          "bg-white border border-black/10 transition-all duration-500",
          "group-hover/card:border-black/25 group-hover/card:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.09)]",
          className
        )}
      >
        {children}
      </div>
    </Page.Stack>
  );
}

"use client";

import Link from "next/link";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_PATHS, STUDIO_CTA } from "@/lib/constants/nav";

export function BecomePhotographerCTA() {
  return (
    <div className="border border-black/5 bg-gray-50/50 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-black">Want to showcase your work?</p>
          <p className="text-xs text-gray-400 font-light tracking-wider">Join our community of professional photographers and start building your portfolio today.</p>
        </div>
        <Link href={NAV_PATHS.ONBOARDING}>
          <Button variant="outline" className="h-11 border-black text-black hover:bg-black hover:text-white text-[10px] uppercase tracking-[0.15em] font-bold px-6">
            <Camera className="mr-2 h-3 w-3" />
            {STUDIO_CTA.LABEL}
          </Button>
        </Link>
      </div>
    </div>
  );
}

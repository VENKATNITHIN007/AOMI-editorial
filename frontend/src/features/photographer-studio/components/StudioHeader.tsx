"use client";

import Link from "next/link";
import { ExternalLink, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudioHeaderProps {
  username: string;
}

/**
 * StudioHeader - A sticky command bar for quick access to the live profile.
 * Pins to the top of the Studio Dashboard for consistent navigation.
 */
export function StudioHeader({ username }: StudioHeaderProps) {
  return (
    <div className="w-full bg-white border-b border-black/5 mb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 min-h-20 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Handle Badge */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="size-10 bg-black flex items-center justify-center shadow-lg shrink-0">
            <UserIcon className="size-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black leading-none truncate">
              Studio Active
            </p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1.5 truncate">
              @{username}
            </p>
          </div>
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button 
            variant="outline" 
            asChild
            className="flex-1 sm:flex-none h-11 px-4 sm:px-6 rounded-none border-black/10 hover:border-black bg-transparent text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all"
          >
            <Link href="/photographers">
              Card
            </Link>
          </Button>

          <Button 
            asChild
            className="flex-[2] sm:flex-none h-11 px-6 sm:px-8 rounded-none bg-black hover:bg-neutral-800 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] shadow-xl transition-all active:scale-95"
          >
            <Link href={`/photographers/${username}`} target="_blank" className="flex items-center justify-center gap-2">
              Live Profile
              <ExternalLink className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

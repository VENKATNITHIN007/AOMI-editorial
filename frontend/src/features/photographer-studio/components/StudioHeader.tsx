"use client";

import Link from "next/link";
import { ExternalLink, Eye, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Handle Badge */}
        <div className="flex items-center gap-4">
          <div className="size-10 bg-black flex items-center justify-center shadow-lg">
            <UserIcon className="size-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black leading-none">
              Studio Active
            </p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">
              @{username}
            </p>
          </div>
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            asChild
            className="hidden sm:flex h-11 px-6 rounded-none border-black/10 hover:border-black bg-transparent text-[10px] font-black uppercase tracking-[0.2em] transition-all"
          >
            <Link href="/photographers">
              Check Your Card
            </Link>
          </Button>

          <Button 
            asChild
            className="h-11 px-8 rounded-none bg-black hover:bg-neutral-800 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95"
          >
            <Link href={`/photographers/${username}`} target="_blank" className="flex items-center gap-2">
              Visit Live Profile
              <ExternalLink className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

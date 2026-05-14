"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";
import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  name: string;
}

/**
 * ProfileHeader — A minimalist, sticky-top header with high-impact tracking.
 * Refined for a thin, professional editorial entry.
 */
export function ProfileHeader({ name }: ProfileHeaderProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${name} | Photophile`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard");
    }
  };

  return (
    <header className="absolute top-0 w-full z-50 px-6 sm:px-12 py-10">
      <Page.Row className="justify-between items-center mix-blend-difference">
        <Link 
          href="/photographers" 
          className="flex items-center text-[9px] uppercase tracking-[0.5em] font-black text-white hover:text-white/60 transition-all group"
        >
          <ArrowLeft className="size-3.5 mr-4 transition-transform group-hover:-translate-x-1" /> 
          Discover
        </Link>

        <Button 
          variant="ghost" 
          onClick={handleShare}
          className="text-white hover:bg-white/5 rounded-none h-11 px-6 flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] font-black"
        >
          <Share2 className="size-3.5" />
          Share
        </Button>
      </Page.Row>
    </header>
  );
}

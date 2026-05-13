"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";
import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  name: string;
}

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
    <header className="absolute top-0 w-full z-50 px-6 sm:px-12 py-8">
      <Page.Row className="justify-between items-center mix-blend-difference">
        <Link 
          href="/photographers" 
          className="flex items-center text-[10px] uppercase tracking-[0.4em] font-black text-white hover:text-white/70 transition-all group"
        >
          <ArrowLeft className="size-4 mr-3 transition-transform group-hover:-translate-x-1" /> 
          Back
        </Link>

        <Button 
          variant="ghost" 
          onClick={handleShare}
          className="text-white hover:bg-white/10 rounded-none h-10 px-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold"
        >
          <Share2 className="size-4" />
          Share
        </Button>
      </Page.Row>
    </header>
  );
}

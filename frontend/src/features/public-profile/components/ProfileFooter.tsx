"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function ProfileFooter() {
  return (
    <footer className="py-16 sm:py-24 bg-black border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 items-start">
          
          <div className="space-y-6 sm:space-y-8">
            <h3 className="text-[9px] uppercase tracking-[0.5em] font-black text-white/30">Next Steps</h3>
            <div className="flex flex-col gap-4 sm:gap-6">
              <Link 
                href="/photographers" 
                className="group flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4 hover:border-white transition-colors"
              >
                <span className="text-xl sm:text-2xl font-serif text-white italic">Explore More Talent</span>
                <ArrowUpRight className="size-5 sm:size-6 text-white/20 group-hover:text-white transition-colors" />
              </Link>
              <Link 
                href="/" 
                className="group flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4 hover:border-white transition-colors"
              >
                <span className="text-xl sm:text-2xl font-serif text-white italic">Back to Home</span>
                <ArrowUpRight className="size-5 sm:size-6 text-white/20 group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>

          <div className="md:text-right space-y-6 sm:space-y-8">
            <h3 className="text-[9px] uppercase tracking-[0.5em] font-black text-white/30">Your Turn</h3>
            <div className="flex flex-col gap-6 max-w-sm md:ml-auto">
              <Logo className="text-3xl sm:text-4xl text-white" />
              <p className="text-white/50 text-xs sm:text-sm font-light max-w-xs md:ml-auto">
                Are you a storyteller? Launch your own editorial studio in minutes.
              </p>
              <Link 
                href="/onboarding" 
                className="inline-block text-[10px] sm:text-[11px] uppercase tracking-[0.4em] font-black text-white border border-white/20 px-8 sm:px-10 py-4 sm:py-5 hover:bg-white hover:text-black transition-all"
              >
                Start Your Studio
              </Link>
            </div>
          </div>

        </div>

        <div className="mt-20 sm:mt-32 pt-8 sm:pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-8 opacity-60">
          <Logo className="text-white" showSubtitle={true} />
          <div className="flex gap-6 sm:gap-8">
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white">Terms</span>
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white">Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

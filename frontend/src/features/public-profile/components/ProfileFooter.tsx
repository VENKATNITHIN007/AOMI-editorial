"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

/**
 * ProfileFooter — A "thin", minimalist footer.
 * Stripped down to essential navigation and high-end branding.
 */
export function ProfileFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-black border-t border-white/[0.03]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-10">
          
          {/* Brand & Rights */}
          <div className="space-y-4">
            <Logo className="text-xl text-white" showSubtitle={false} />
            <p className="text-[9px] uppercase tracking-[0.4em] font-black text-white/10">
              Editorial Studio &copy; {currentYear}
            </p>
          </div>

          {/* Minimal Links */}
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <Link 
              href="/photographers" 
              className="group flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] font-black text-white/30 hover:text-white transition-colors"
            >
              Discover
              <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
            </Link>
            <Link 
              href="/onboarding" 
              className="group flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] font-black text-white/30 hover:text-white transition-colors"
            >
              Join Us
              <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
            </Link>
          </div>

          {/* Legal / Secondary */}
          <div className="hidden lg:flex items-center gap-8 border-l border-white/5 pl-8">
             <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-white/10 hover:text-white/30 cursor-pointer transition-colors">Privacy</span>
             <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-white/10 hover:text-white/30 cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

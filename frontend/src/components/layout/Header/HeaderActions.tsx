"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { usePrimaryCta } from "@/features/auth/hooks/usePrimaryCta";
import { ProfileMenu } from "./ProfileMenu";
import { NAV_PATHS } from "@/lib/constants/nav";

/**
 * Context-Aware Header Actions.
 * Dynamically displays the primary CTA and profile menu based on auth status.
 */
export function HeaderActions() {
  const { user, loading } = useAuth();
  const { label: ctaLabel, path: ctaPath } = usePrimaryCta();

  // Skeleton state while loading auth
  if (loading) {
    return (
      <div className="flex items-center gap-6">
        <div className="h-4 w-20 animate-pulse bg-gray-100" />
        <div className="size-10 animate-pulse bg-gray-100" />
      </div>
    );
  }

  // GUEST VIEW
  if (!user) {
    return (
      <div className="flex items-center gap-8">
        <Link 
          href={NAV_PATHS.LOGIN} 
          className="text-[10px] uppercase tracking-[0.25em] font-medium text-gray-400 hover:text-black transition-colors"
        >
          Sign In
        </Link>
        <Link href={ctaPath}>
          <Button 
            variant="default" 
            size="sm"
            className="rounded-none bg-black text-white hover:bg-gray-900 h-10 px-6 text-[10px] uppercase tracking-[0.25em] font-bold"
          >
            {ctaLabel}
          </Button>
        </Link>
      </div>
    );
  }

  // AUTHENTICATED VIEW
  return (
    <div className="flex items-center gap-8">
      {/* Primary Smart CTA (Hidden if already a photographer on desktop to keep it clean, or keep it as 'Studio') */}
      <Link 
        href={ctaPath}
        className="hidden md:inline-block text-[10px] uppercase tracking-[0.25em] font-bold text-black border-b border-black pb-0.5 hover:opacity-60 transition-opacity"
      >
        {ctaLabel}
      </Link>

      <ProfileMenu />
    </div>
  );
}

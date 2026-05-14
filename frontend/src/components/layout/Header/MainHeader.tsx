import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { NavLinks } from "./NavLinks";
import { HeaderActions } from "./HeaderActions";
import { MobileNav } from "./MobileNav";
import { NAV_PATHS } from "@/lib/constants/nav";

/**
 * Main Header (Server Component Shell).
 * Includes desktop navigation, auth actions, and a mobile hamburger menu.
 */
export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center px-6 sm:px-12">
        
        {/* Column 1: Logo (Left) */}
        <div className="flex-1 flex items-center">
          <Link href={NAV_PATHS.HOME} className="group transition-all hover:opacity-70">
            <Logo className="text-[14px] sm:text-[16px]" />
          </Link>
        </div>

        {/* Column 2: Navigation (Center - Desktop) */}
        <div className="hidden md:flex flex-1 justify-center">
          <NavLinks />
        </div>

        {/* Column 3: Actions (Right - Desktop) */}
        <div className="hidden md:flex flex-1 justify-end">
          <HeaderActions />
        </div>

        {/* Mobile Trigger (Right - Mobile) */}
        <div className="md:hidden flex flex-1 justify-end">
          <MobileNav />
        </div>

      </div>
    </header>
  );
}


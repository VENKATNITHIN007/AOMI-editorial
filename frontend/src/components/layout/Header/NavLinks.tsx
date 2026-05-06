"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MAIN_NAV_ITEMS } from "@/lib/constants/nav";


/**
 * Navigation Links for the Header.
 * Automatically handles the 'active' state based on the current URL.
 */
export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex items-center gap-10", className)}>
      {MAIN_NAV_ITEMS.map((item) => {
        const isActive = pathname === item.path;
        
        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "text-[11px] uppercase tracking-[0.2em] font-medium transition-all hover:text-black",
              isActive ? "text-black" : "text-gray-400"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>

  );
}

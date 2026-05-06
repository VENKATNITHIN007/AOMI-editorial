"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { usePrimaryCta } from "@/features/auth/hooks/usePrimaryCta";
import { MAIN_NAV_ITEMS, NAV_PATHS } from "@/lib/constants/nav";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

/**
 * Mobile Navigation Sheet.
 * Features an editorial-style vertical navigation with smart CTA integration.
 */
export function MobileNav() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const { label: ctaLabel, path: ctaPath } = usePrimaryCta();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full p-0 flex flex-col border-none shadow-2xl">
        <SheetHeader className="p-10 pb-6 text-left">
          <SheetTitle className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-300">Menu</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col flex-1 p-10 pt-4">
          <nav className="space-y-6">
            {MAIN_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.path;
              return (
                <SheetClose asChild key={item.path}>
                  <Link
                    href={item.path}
                    className={cn(
                      "flex items-center justify-between text-3xl font-light tracking-tighter transition-all",
                      isActive ? "text-black pl-2" : "text-gray-400 [@media(hover:hover)]:hover:text-black active:text-black"
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className={cn("size-6 transition-all", isActive ? "opacity-100 translate-x-0" : "opacity-30")} />
                  </Link>
                </SheetClose>
              );
            })}
            
            <SheetClose asChild>
              <Link
                href={ctaPath}
                className="flex items-center justify-between text-3xl font-bold tracking-tighter text-black border-t border-gray-100 pt-8"
              >
                <span>{ctaLabel}</span>
                <ChevronRight className="size-6 opacity-30" />
              </Link>
            </SheetClose>
          </nav>

          <div className="mt-auto pt-10 border-t border-gray-100 space-y-8">
            {loading ? (
              <div className="h-10 w-full animate-pulse bg-gray-50" />
            ) : user ? (
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                   <div className="size-12 border border-black flex items-center justify-center text-[10px] font-bold bg-gray-50 uppercase tracking-tighter">
                      {user.name?.[0].toUpperCase() || "U"}
                   </div>
                   <div className="overflow-hidden">
                     <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-black truncate">{user.name}</p>
                     <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                   </div>
                </div>
                
                <div className="space-y-4">
                  <SheetClose asChild>
                    <Link href={NAV_PATHS.PROFILE} className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                      Profile Settings
                    </Link>
                  </SheetClose>
                  <button 
                    onClick={() => logout()}
                    className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold text-red-500"
                  >
                    <LogOut className="size-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <SheetClose asChild>
                  <Link href={NAV_PATHS.LOGIN}>
                    <Button variant="default" className="w-full rounded-none h-14 bg-black text-white text-[10px] uppercase tracking-[0.3em] font-bold">
                      Sign In
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            )}
          </div>
        </div>

      </SheetContent>
    </Sheet>
  );
}

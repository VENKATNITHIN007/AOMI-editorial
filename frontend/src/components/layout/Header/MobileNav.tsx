"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut, User, Camera, ArrowRight } from "lucide-react";
import { useAuth } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { usePrimaryCta } from "@/hooks/usePrimaryCta";
import { MAIN_NAV_ITEMS, NAV_PATHS } from "@/lib/constants/nav";
import { Logo } from "@/components/ui/Logo";
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
 * Full-screen editorial navigation with clear visual hierarchy.
 */
export function MobileNav() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const { label: ctaLabel, path: ctaPath } = usePrimaryCta();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden size-10" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent 
        side="right" 
        showCloseButton={false}
        className="w-full sm:max-w-md p-0 flex flex-col border-none bg-white"
      >
        {/* Top Bar — Branding + Close */}
        <SheetHeader className="flex-row items-center justify-between px-6 py-5 border-b border-gray-100">
          <SheetTitle>
            <Logo className="text-[12px]" />
          </SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="size-9" aria-label="Close menu">
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </Button>
          </SheetClose>
        </SheetHeader>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col px-6 py-8">
          <div className="space-y-1">
            {MAIN_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.path;
              return (
                <SheetClose asChild key={item.path}>
                  <Link
                    href={item.path}
                    className={cn(
                      "flex items-center justify-between py-4 text-lg font-light tracking-wide transition-colors",
                      isActive 
                        ? "text-black font-medium" 
                        : "text-gray-400 active:text-black"
                    )}
                  >
                    <span>{item.label}</span>
                    {isActive && <div className="size-1.5 bg-black rounded-full" />}
                  </Link>
                </SheetClose>
              );
            })}
          </div>

          {/* Primary CTA */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <SheetClose asChild>
              <Link href={ctaPath}>
                <Button className="w-full h-14 bg-black hover:bg-gray-900 text-white rounded-none text-[10px] uppercase tracking-[0.25em] font-bold flex items-center justify-center gap-3">
                  <Camera className="size-4" />
                  {ctaLabel}
                  <ArrowRight className="size-3 ml-auto" />
                </Button>
              </Link>
            </SheetClose>
          </div>

          {/* Bottom Section — Auth */}
          <div className="mt-auto pt-8 border-t border-gray-100">
            {loading ? (
              <div className="space-y-3">
                <div className="h-12 w-full animate-pulse bg-gray-50" />
              </div>
            ) : user ? (
              <div className="space-y-6">
                {/* User Info */}
                <div className="flex items-center gap-4">
                  <div className="size-11 border border-black flex items-center justify-center text-[10px] font-bold bg-gray-50 uppercase">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>

                {/* User Links */}
                <div className="flex flex-col gap-1">
                  <SheetClose asChild>
                    <Link 
                      href={NAV_PATHS.PROFILE} 
                      className="flex items-center gap-3 py-3 text-sm text-gray-500 hover:text-black transition-colors"
                    >
                      <User className="size-4" />
                      Profile
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <button 
                      onClick={() => logout()}
                      className="flex items-center gap-3 py-3 text-sm text-red-500 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="size-4" />
                      Sign Out
                    </button>
                  </SheetClose>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <SheetClose asChild>
                  <Link href={NAV_PATHS.LOGIN}>
                    <Button className="w-full h-12 rounded-none bg-black text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gray-900">
                      Sign In
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href={NAV_PATHS.REGISTER}>
                    <Button variant="outline" className="w-full h-12 rounded-none border-gray-200 text-[10px] uppercase tracking-[0.2em] font-bold">
                      Create Account
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

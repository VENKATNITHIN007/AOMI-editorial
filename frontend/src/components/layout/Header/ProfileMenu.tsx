"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth";
import { useMyProfileQuery } from "@/features/photographer-studio/studio.queries";
import { NAV_PATHS, STUDIO_CTA } from "@/lib/constants/nav";
import { LogOut, ExternalLink, LayoutDashboard, UserCircle } from "lucide-react";

export function ProfileMenu() {
  const { user, logout } = useAuth();
  const isPhotographer = user?.role === "photographer";
  const { data: profile } = useMyProfileQuery({ enabled: isPhotographer });
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const menuItems = [
    ...(isPhotographer && profile?.username
      ? [
          {
            label: "Visit Public Profile",
            path: `/photographers/${profile.username}`,
            icon: ExternalLink,
          },
        ]
      : []),
    ...(isPhotographer
      ? [
          {
            label: "Studio Dashboard",
            path: NAV_PATHS.DASHBOARD,
            icon: LayoutDashboard,
          },
        ]
      : [
          {
            label: STUDIO_CTA.LABEL,
            path: NAV_PATHS.ONBOARDING,
            icon: LayoutDashboard,
          },
        ]),
    {
      label: "Account Settings",
      path: NAV_PATHS.PROFILE,
      icon: UserCircle,
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
      >
        <div className="size-10 border border-black font-light flex items-center justify-center text-[10px] tracking-tighter bg-white uppercase">
          {initials}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-black shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <p className="text-[11px] font-bold uppercase tracking-widest text-black truncate">{user.name}</p>
            <p className="text-[10px] text-gray-400 truncate mt-0.5">{user.email}</p>
          </div>

          <div className="py-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-gray-500 hover:text-black hover:bg-gray-50 transition-colors group"
              >
                <item.icon className="size-3 transition-transform group-hover:scale-110" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-red-500 hover:bg-red-50 transition-colors group"
            >
              <LogOut className="size-3 transition-transform group-hover:translate-x-0.5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

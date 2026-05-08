"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, LayoutDashboard, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudioHeaderProps {
  username: string;
  activeTab: "portfolio" | "settings";
  onTabChange: (tab: "portfolio" | "settings") => void;
}

export function StudioHeader({ username, activeTab, onTabChange }: StudioHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-gray-100 pb-10">
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-300">Management</p>
          <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-tight text-black leading-none">
            Studio <span className="font-bold italic">Dashboard</span>
          </h1>
        </div>
        
        <Link 
          href={`/photographers/${username}`}
          target="_blank"
          className="inline-flex items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-black transition-colors group"
        >
          <ExternalLink className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          Visit Public Profile
        </Link>
      </div>

      <nav className="flex gap-10">
        {[
          { id: "portfolio", label: "Portfolio", icon: ImageIcon },
          { id: "settings", label: "Settings", icon: LayoutDashboard }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as any)}
            className={`flex items-center gap-3 pb-3 text-[10px] uppercase tracking-[0.25em] font-black transition-all border-b-2 relative ${
              activeTab === tab.id 
                ? "border-black text-black" 
                : "border-transparent text-gray-300 hover:text-gray-500"
            }`}
          >
            <tab.icon className="size-3.5" />
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute -bottom-[2px] left-0 w-full h-[2px] bg-black animate-in fade-in zoom-in-95 duration-300" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

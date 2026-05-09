"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, LayoutDashboard, ImageIcon, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudioHeaderProps {
  username: string;
  activeTab: "portfolio" | "settings" | "preview";
  onTabChange: (tab: "portfolio" | "settings" | "preview") => void;
}

export function StudioHeader({ username, activeTab, onTabChange }: StudioHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-6">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold uppercase tracking-widest text-black">
          Studio <span className="font-light italic">Management</span>
        </h1>
        
        <div className="h-4 w-px bg-gray-200 hidden md:block" />

        <Link 
          href={`/photographers/${username}`}
          target="_blank"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-black transition-colors group"
        >
          <ExternalLink className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          Visit Profile
        </Link>
      </div>

      <nav className="flex gap-8">
        {[
          { id: "portfolio", label: "Portfolio", icon: ImageIcon },
          { id: "settings", label: "Settings", icon: LayoutDashboard },
          { id: "preview", label: "Preview & Edit", icon: Globe }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as any)}
            className={`flex items-center gap-2.5 pb-2 text-[9px] uppercase tracking-[0.2em] font-black transition-all border-b-2 relative ${
              activeTab === tab.id 
                ? "border-black text-black" 
                : "border-transparent text-gray-400 hover:text-black"
            }`}
          >
            <tab.icon className="size-3" />
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

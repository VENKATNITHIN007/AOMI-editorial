"use client";

import { useState } from "react";
import { MapPin, Tag, Banknote, User } from "lucide-react";
import { StudioCard } from "./StudioCard";
import { StudioDetailsForm } from "./StudioDetailsForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PhotographerProfile } from "@/lib/types/photographer";

interface IdentityCardProps {
  profile: PhotographerProfile;
}

/**
 * IdentityCard - Displays core professional metadata and manages its updates.
 */
export function IdentityCard({ profile }: IdentityCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const stats = [
    { 
      label: "Operating Base", 
      value: profile.location || "NOT_SPECIFIED", 
      icon: MapPin 
    },
    { 
      label: "Handle", 
      value: `@${profile.username}`, 
      icon: User 
    },
    { 
      label: "Starting From", 
      value: profile.priceFrom ? `₹${profile.priceFrom.toLocaleString()}` : "NOT_SET", 
      icon: Banknote 
    },
  ];

  return (
    <StudioCard
      number="01"
      title="Identity & Specifications"
      description="Professional handle, location, and baseline pricing"
    >
      <div className="p-8 sm:p-10">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 flex-1">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-3 group/stat">
                <div className="flex items-center gap-3">
                  <stat.icon className="size-3.5 text-gray-300 group-hover/card:text-black transition-colors" />
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 group-hover/card:text-gray-400 transition-colors">
                    {stat.label}
                  </p>
                </div>
                <p className="text-sm font-medium text-black tracking-widest truncate uppercase">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Integrated Action */}
          <div className="flex items-start">
            <Button
              onClick={() => setIsEditDialogOpen(true)}
              className="h-10 px-8 rounded-none bg-black hover:bg-neutral-800 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-sm transition-all active:scale-95"
            >
              Edit Details
            </Button>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-xl rounded-none border-black shadow-2xl bg-white p-10">
                <DialogHeader className="mb-10 border-b border-black/5 pb-8">
                  <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic leading-none">
                    Edit Specifications
                  </DialogTitle>
                  <DialogDescription className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-2">
                    Update your professional baseline and operational data
                  </DialogDescription>
                </DialogHeader>
                <StudioDetailsForm 
                  profile={profile} 
                  onSuccess={() => setIsEditDialogOpen(false)} 
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Specialties Tags */}
        <div className="mt-10 pt-8 border-t border-black/5">
          <div className="flex items-center gap-4 flex-wrap">
             <div className="flex items-center gap-3 mr-4">
                <Tag className="size-3.5 text-gray-300" />
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300">Expertise</p>
             </div>
             {profile.specialties.map((specialty) => (
               <span 
                 key={specialty}
                 className="px-4 py-1.5 bg-gray-50 border border-black/5 text-black text-[9px] font-black uppercase tracking-widest group-hover/card:border-black/20 transition-colors"
               >
                 {specialty}
               </span>
             ))}
          </div>
        </div>
      </div>
    </StudioCard>
  );
}

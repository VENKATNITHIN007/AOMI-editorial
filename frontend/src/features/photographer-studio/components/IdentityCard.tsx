"use client";

import { useState } from "react";
import { MapPin, Tag, Banknote, User } from "lucide-react";
import { StudioCard } from "./StudioCard";
import { StudioDetailsForm } from "./StudioDetailsForm";
import { Page } from "@/components/Page";
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
  step: number;
  isComplete: boolean;
}

/**
 * IdentityCard - Displays core professional metadata and manages its updates.
 * Refactored using Page primitives for enhanced editorial structure and readability.
 */
export function IdentityCard({ profile, step, isComplete }: IdentityCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const stats = [
    { 
      label: "Location", 
      value: profile.location || "NOT_SPECIFIED", 
      icon: MapPin 
    },
    { 
      label: "Handle", 
      value: `@${profile.username}`, 
      icon: User 
    },
    { 
      label: "Hourly Rate", 
      value: profile.priceFrom ? `₹${profile.priceFrom.toLocaleString()}` : "NOT_SET", 
      icon: Banknote 
    },
  ];

  return (
    <StudioCard
      step={step}
      isComplete={isComplete}
      title="Profile Details"
    >
      <div className="p-8 sm:p-10">
        <Page.Stack className="gap-12">
          <Page.Row className="flex-col lg:flex-row justify-between items-start gap-10">
            {/* Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 flex-1 w-full">
              {stats.map((stat) => (
                <Page.Stack key={stat.label} className="gap-3 group/stat">
                  <Page.Row className="gap-3 items-center">
                    <stat.icon className="size-3.5 text-gray-300 group-hover/card:text-black transition-colors" />
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 group-hover/card:text-gray-400 transition-colors">
                      {stat.label}
                    </p>
                  </Page.Row>
                  <p className="text-sm font-medium text-black tracking-widest truncate uppercase leading-none">
                    {stat.value}
                  </p>
                </Page.Stack>
              ))}
            </div>

            {/* Integrated Action */}
            <div className="shrink-0 w-full sm:w-auto">
              <Button
                onClick={() => setIsEditDialogOpen(true)}
                className="w-full sm:w-auto h-11 px-12 rounded-none bg-black hover:bg-neutral-800 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-sm transition-all active:scale-95"
              >
                Edit Details
              </Button>

              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-xl rounded-none border-black shadow-2xl bg-white p-10">
                  <DialogHeader className="mb-10 border-b border-black/5 pb-8">
                    <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic leading-none">
                      Edit Details
                    </DialogTitle>
                    <DialogDescription className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-2">
                      Update your public profile details
                    </DialogDescription>
                  </DialogHeader>
                  <StudioDetailsForm 
                    profile={profile} 
                    onSuccess={() => setIsEditDialogOpen(false)} 
                  />
                </DialogContent>
              </Dialog>
            </div>
          </Page.Row>

          {/* Specialties Tags - Stacked below on mobile */}
          <div className="pt-10 border-t border-black/5">
            <Page.Row className="flex-col sm:flex-row sm:items-center gap-6">
               <Page.Row className="gap-3 items-center shrink-0">
                  <Tag className="size-3.5 text-gray-300" />
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300">Focus Areas</p>
               </Page.Row>
               <Page.Row className="gap-3 flex-wrap">
                 {profile.specialties.map((specialty) => (
                   <span 
                     key={specialty}
                     className="px-5 py-2 bg-gray-50 border border-black/5 text-black text-[9px] font-black uppercase tracking-widest group-hover/card:border-black/20 transition-colors"
                   >
                     {specialty}
                   </span>
                 ))}
               </Page.Row>
            </Page.Row>
          </div>
        </Page.Stack>
      </div>
    </StudioCard>
  );
}

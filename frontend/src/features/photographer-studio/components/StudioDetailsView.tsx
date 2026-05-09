"use client";

import { MapPin, Instagram, Sparkles, IndianRupee, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StudioDetailsForm } from "./StudioDetailsForm";
import type { PhotographerProfile } from "@/lib/types/photographer";
import { useAuth } from "@/features/auth";

interface StudioDetailsViewProps {
  profile: PhotographerProfile;
}

export function StudioDetailsView({ profile }: StudioDetailsViewProps) {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Left Column: Avatar & Quick Info */}
        <div className="w-full md:w-1/3 space-y-8">
          <div className="relative group aspect-square overflow-hidden bg-gray-100 border border-gray-100">
            <img 
              src={user?.avatar || "/placeholder-avatar.jpg"} 
              alt={profile.username}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Public Handle</p>
              <p className="text-lg font-medium text-black">@{profile.username}</p>
            </div>

            {profile.instagram && (
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Social</p>
                <a 
                  href={`https://instagram.com/${profile.instagram}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors"
                >
                  <Instagram className="size-4" />
                  <span className="font-medium">@{profile.instagram}</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="w-full md:w-2/3 space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
            <div className="space-y-1">
              <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold italic">Identity</p>
              <h2 className="text-4xl font-serif text-black">{profile.username}</h2>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-none border-black text-black hover:bg-black hover:text-white px-8 h-12 text-[10px] uppercase tracking-widest font-bold transition-all">
                  <Edit3 className="size-4 mr-2" />
                  Edit Studio
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-none border-none p-0">
                <div className="p-8 sm:p-12">
                  <DialogHeader className="mb-8">
                    <DialogTitle className="text-3xl font-serif italic">Update Studio</DialogTitle>
                  </DialogHeader>
                  <StudioDetailsForm profile={profile} isDialog />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-2 gap-12 pt-8 border-t border-gray-100">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="size-3" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Location</span>
              </div>
              <p className="text-lg text-black">{profile.location || "Not specified"}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <IndianRupee className="size-3" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Starting Price</span>
              </div>
              <p className="text-lg text-black">₹{profile.priceFrom?.toLocaleString() || "0"} / day</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Sparkles className="size-3" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Specialties</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.specialties?.map((s) => (
                <span key={s} className="px-4 py-2 bg-gray-50 text-[10px] uppercase tracking-widest font-bold text-black border border-gray-100">
                  {s}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

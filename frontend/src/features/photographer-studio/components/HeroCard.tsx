"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Type, Image as ImageIcon, Upload, Check } from "lucide-react";
import { StudioCard } from "./StudioCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  useUpdateStudioProfileMutation, 
  useUploadPortfolioImageMutation,
  useSetPortfolioItemPurposeMutation 
} from "../studio.queries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PhotographerProfile, PortfolioItem } from "@/lib/types/photographer";
import { cn } from "@/lib/utils";

interface HeroCardProps {
  profile: PhotographerProfile;
  gallery: PortfolioItem[];
  currentHero: PortfolioItem | null;
}

/**
 * HeroCard - Self-contained management for the Hero Tagline and Exhibition.
 * Supports both direct upload and gallery selection for consistency.
 */
export function HeroCard({ profile, gallery, currentHero }: HeroCardProps) {
  const [tagline, setTagline] = useState(profile.heroTagline || "");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success: showSuccess, error: showError } = useToast();

  const updateProfileMutation = useUpdateStudioProfileMutation();
  const uploadMutation = useUploadPortfolioImageMutation();
  const setPurposeMutation = useSetPortfolioItemPurposeMutation();

  const handleUpdateTagline = async () => {
    try {
      await updateProfileMutation.mutateAsync({ heroTagline: tagline });
      showSuccess("Tagline Updated", "Your hero tagline has been saved.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not update tagline.";
      showError("Sync Failed", message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadMutation.mutateAsync({ file, purpose: "hero" });
      showSuccess("Hero Exhibitioned", "New hero image has been uploaded and set.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not upload hero image.";
      showError("Upload Failed", message);
    }
  };

  const handleSelectFromGallery = async (itemId: string) => {
    try {
      await setPurposeMutation.mutateAsync({ itemId, purpose: "hero" });
      showSuccess("Hero Updated", "Gallery item promoted to hero exhibition.");
      setIsPickerOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not set hero image.";
      showError("Promotion Failed", message);
    }
  }

  const isPending = updateProfileMutation.isPending || uploadMutation.isPending || setPurposeMutation.isPending;

  return (
    <StudioCard
      number="02"
      title="Hero Exhibition"
      description="Tagline and primary background exhibition"
    >
      <div className="p-8 sm:p-10 space-y-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Tagline Section */}
          <div className="flex-1 space-y-6">
             <div className="flex items-center gap-3">
                <Type className="size-3.5 text-black" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                  Hero Tagline
                </h3>
             </div>
             <div className="flex gap-3">
                <Input 
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Capturing the soul of the moment"
                  className="rounded-none border-black/10 focus:border-black h-11 text-sm tracking-wide"
                  disabled={isPending}
                />
                <Button 
                  onClick={handleUpdateTagline}
                  disabled={isPending || tagline === profile.heroTagline}
                  className="h-11 px-6 rounded-none bg-black text-white text-[10px] font-black uppercase tracking-widest"
                >
                  Save
                </Button>
             </div>
          </div>

          {/* Hero Image Section */}
          <div className="w-full lg:w-80 space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <ImageIcon className="size-3.5 text-black" />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                     Featured Hero
                   </h3>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsPickerOpen(true)}
                    className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                  >
                    Gallery
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[9px] font-black uppercase tracking-widest text-black border-b border-black pb-0.5"
                  >
                    Upload New
                  </button>
                </div>
             </div>

             <div className="aspect-[16/9] bg-gray-50 border border-black/5 group/hero relative overflow-hidden">
                {currentHero ? (
                  <Image src={currentHero.mediaUrl} alt="Hero preview" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-20">
                     <ImageIcon className="size-8" />
                     <p className="text-[8px] font-black uppercase tracking-widest">No Hero</p>
                  </div>
                )}
                
                {/* Upload Overlay */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover/hero:opacity-100 transition-all duration-500 cursor-pointer flex items-center justify-center backdrop-blur-[2px]"
                >
                   <div className="flex flex-col items-center gap-2">
                     <Upload className="size-4 text-white" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                       Upload Hero
                     </span>
                   </div>
                </div>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileUpload}
                />
             </div>
          </div>
        </div>
      </div>

      {/* Gallery Selection Dialog */}
      <Dialog open={isPickerOpen} onOpenChange={setIsPickerOpen}>
        <DialogContent className="sm:max-w-4xl rounded-none border-black shadow-2xl bg-white p-10 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-10 border-b border-black/5 pb-8">
            <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic leading-none">
              Select From Gallery
            </DialogTitle>
          </DialogHeader>

          {gallery.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center opacity-30 gap-4">
               <ImageIcon className="size-12" />
               <p className="text-[10px] font-black uppercase tracking-[0.2em]">Upload works to your gallery first</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <div 
                  key={item._id}
                  onClick={() => handleSelectFromGallery(item._id)}
                  className={cn(
                    "relative aspect-[4/5] bg-gray-50 border cursor-pointer group/item overflow-hidden transition-all duration-500",
                    currentHero?._id === item._id ? "border-black scale-[0.98]" : "border-black/5 hover:border-black/30"
                  )}
                >
                  <Image 
                    src={item.mediaUrl} 
                    alt="Gallery item" 
                    fill 
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-1000 group-hover/item:scale-110" 
                  />
                  {currentHero?._id === item._id && (
                    <div className="absolute top-2 right-2 bg-black text-white p-1.5 shadow-lg">
                      <Check className="size-3" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                     <span className="text-[8px] font-black uppercase tracking-widest text-white">Select as Hero</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </StudioCard>
  );
}

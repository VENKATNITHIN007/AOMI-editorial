"use client";

import React, { useState } from "react";
import { 
  Edit3, 
  Check, 
  X, 
  Image as ImageIcon, 
  ArrowRight,
  Instagram,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  useUpdateProfileMutation,
  useMyPortfolioQuery,
  useUpdatePortfolioItemMutation
} from "../studio.queries";
import type { PhotographerProfile } from "@/lib/types/photographer";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

interface EditorialEditorProps {
  profile: PhotographerProfile;
  onClose?: () => void;
}

export function EditorialEditor({ profile, onClose }: EditorialEditorProps) {
  const { data: portfolio } = useMyPortfolioQuery();
  const updateMutation = useUpdateProfileMutation();
  const updatePortfolioItemMutation = useUpdatePortfolioItemMutation();
  const { success: showSuccess, error: showError } = useToast();

  const [editingHero, setEditingHero] = useState(false);
  const [heroTagline, setHeroTagline] = useState(profile.heroTagline || "");

  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState(profile.bio || "");

  const handleUpdate = async (fields: Partial<PhotographerProfile>) => {
    try {
      await updateMutation.mutateAsync(fields);
      showSuccess("Branding updated", "Your editorial changes have been synced.");
      setEditingHero(false);
      setEditingBio(false);
    } catch (err: any) {
      showError("Update failed", err.message || "Could not save changes.");
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      await updatePortfolioItemMutation.mutateAsync({
        itemId: id,
        payload: { isFeatured: !currentStatus }
      });
      showSuccess("Success", currentStatus ? "Removed from featured" : "Added to featured");
    } catch {
      showError("Error", "Failed to update status");
    }
  };

  const heroItem = portfolio?.find(p => p._id === profile.heroImageId) || portfolio?.[0];
  const aboutItem = portfolio?.find(p => p._id === profile.aboutImageId) || portfolio?.[1] || portfolio?.[0];

  return (
    <div className="relative bg-[#111] text-white min-h-screen font-sans animate-in fade-in duration-1000">
      
      {/* ── EDIT BAR ──────────────────────────────────────────────── */}
      <div className="sticky top-0 z-[60] bg-black/80 backdrop-blur-md border-b border-white/10 px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40">Mode</span>
          <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white">Editorial Editor</span>
        </div>
        
        <div className="flex items-center gap-8">
          <p className="text-[10px] text-white/40 uppercase tracking-widest italic hidden md:block">
            Interactive preview. Click edit icons to change content.
          </p>
          {onClose && (
            <Button 
              variant="outline" 
              onClick={onClose}
              className="rounded-none border-white/20 text-white hover:bg-white hover:text-black h-8 text-[9px] uppercase tracking-[0.2em] font-bold px-4"
            >
              <X className="size-3 mr-2" /> Exit Editor
            </Button>
          )}
        </div>
      </div>

      {/* ── HERO SECTION ──────────────────────────────────────────── */}
      <section className="relative h-[90vh] w-full flex items-end pb-24 sm:pb-32">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          {heroItem?.mediaUrl ? (
            <img src={heroItem.mediaUrl} alt="Hero" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#222]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
          
          {/* Edit Hero Image Trigger */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="absolute top-12 right-12 z-20 size-12 bg-black/80 hover:bg-black text-white flex items-center justify-center backdrop-blur-md transition-all group border border-white/20 shadow-2xl">
                <ImageIcon className="size-5" />
                <span className="absolute right-full mr-4 px-3 py-1 bg-black text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Change Hero Image</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl bg-[#111] border-white/10 rounded-none p-8">
              <DialogHeader>
                <DialogTitle className="text-white font-serif text-2xl mb-6 italic">Select Hero Image</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                {portfolio?.map((item) => (
                  <button 
                    key={item._id}
                    onClick={() => handleUpdate({ heroImageId: item._id })}
                    className={cn(
                      "relative aspect-[4/5] overflow-hidden border-2 transition-all",
                      profile.heroImageId === item._id ? "border-white" : "border-transparent opacity-50 hover:opacity-100"
                    )}
                  >
                    <img src={item.mediaUrl} className="size-full object-cover" alt="Portfolio" />
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-8 sm:px-16">
          <div className="max-w-4xl w-full flex flex-col">
            {editingHero ? (
              <div className="flex flex-col gap-4 animate-in slide-in-from-left-4 duration-300">
                <textarea
                  value={heroTagline}
                  onChange={(e) => setHeroTagline(e.target.value)}
                  className="bg-transparent border-b-2 border-white/30 text-4xl sm:text-6xl lg:text-[5.5rem] font-serif font-light text-white focus:border-white outline-none py-2 resize-none w-full leading-[1.1]"
                  placeholder="Enter your hero tagline..."
                  rows={2}
                />
                <div className="flex gap-4">
                  <Button onClick={() => handleUpdate({ heroTagline })} className="rounded-none bg-white text-black hover:bg-gray-200">
                    <Check className="size-4 mr-2" /> Save
                  </Button>
                  <Button onClick={() => setEditingHero(false)} variant="outline" className="rounded-none border-white/20 text-white hover:bg-white/10">
                    <X className="size-4 mr-2" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <h1 className="text-4xl sm:text-6xl lg:text-[5.5rem] leading-[1.1] font-serif font-light text-white tracking-tight py-4 mb-8">
                  {profile.heroTagline || "Photography that speaks."}
                </h1>
                <button 
                  onClick={() => setEditingHero(true)}
                  className="absolute -right-16 top-1/2 -translate-y-1/2 p-4 bg-black/80 border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all shadow-2xl hover:bg-black"
                >
                  <Edit3 className="size-5" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-6 self-end">
              <span className="h-px w-12 bg-white/30" />
              <h2 className="text-[10px] uppercase tracking-[0.5em] font-black text-white/70">
                {profile.userId?.fullName || profile.username}
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO CURATION SECTION ────────────────────────────── */}
      <section className="py-16 sm:py-24 px-8 sm:px-12 max-w-[1200px] mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl sm:text-5xl font-serif font-medium text-white tracking-tighter italic">Manage Selection</h2>
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest italic">
            Toggle the star to curate your public portfolio.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {portfolio?.map((item) => (
            <div key={item._id} className="relative aspect-[4/5] group overflow-hidden border border-white/10 bg-[#222]">
              <img 
                src={item.mediaUrl} 
                alt="Portfolio work" 
                className={cn("w-full h-full object-cover transition-all duration-700", !item.isFeatured && "grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100")} 
              />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                <button 
                  onClick={() => toggleFeatured(item._id!, !!item.isFeatured)}
                  className={cn(
                    "size-12 flex items-center justify-center transition-all shadow-2xl border",
                    item.isFeatured ? "bg-white text-black border-transparent" : "bg-black/80 text-white border-white/20 hover:bg-white hover:text-black"
                  )}
                  title={item.isFeatured ? "Remove from featured" : "Add to featured"}
                >
                  <Star className={cn("size-5", item.isFeatured && "fill-current")} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT SECTION ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-8 sm:px-16 max-w-[1400px] mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Column */}
          <div className="relative aspect-[4/5] max-w-md w-full mx-auto lg:mx-0 group">
            {aboutItem?.mediaUrl ? (
              <img src={aboutItem.mediaUrl} alt="About" className="w-full h-full object-cover grayscale opacity-60 hover:opacity-100 transition-all duration-1000" />
            ) : (
              <div className="w-full h-full bg-[#222]" />
            )}
            
            {/* Edit About Image Trigger */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 border border-white/20 backdrop-blur-sm">
                  <div className="size-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl">
                    <ImageIcon className="size-6" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Change Profile Portrait</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl bg-[#111] border-white/10 rounded-none p-8">
                <DialogHeader>
                  <DialogTitle className="text-white font-serif text-2xl mb-6 italic">Select Portrait Image</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                  {portfolio?.map((item) => (
                    <button 
                      key={item._id}
                      onClick={() => handleUpdate({ aboutImageId: item._id })}
                      className={cn(
                        "relative aspect-[3/4] overflow-hidden border-2 transition-all",
                        profile.aboutImageId === item._id ? "border-white" : "border-transparent opacity-50 hover:opacity-100"
                      )}
                    >
                      <img src={item.mediaUrl} className="size-full object-cover" alt="Portfolio" />
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Content Column */}
          <div className="max-w-xl flex flex-col justify-center">
            <div className="flex flex-col gap-4 mb-12">
              <h2 className="text-5xl sm:text-6xl font-serif font-light text-white tracking-tighter leading-tight">
                {profile.userId?.fullName || profile.username}
              </h2>
              
              {editingBio ? (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-transparent border border-white/20 p-6 text-base font-serif italic text-white focus:border-white outline-none resize-none h-64"
                    placeholder="Share your artistic journey..."
                  />
                  <div className="flex gap-4">
                    <Button onClick={() => handleUpdate({ bio })} className="rounded-none bg-white text-black hover:bg-gray-200 px-8">
                      <Check className="size-4 mr-2" /> Save Bio
                    </Button>
                    <Button onClick={() => setEditingBio(false)} variant="outline" className="rounded-none border-white/20 text-white hover:bg-white/10">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="group relative">
                  <p className="text-lg text-white/40 font-serif italic tracking-wide max-w-md">
                    {profile.bio || "Visual Narrative"}
                  </p>
                  <button 
                    onClick={() => setEditingBio(true)}
                    className="mt-6 px-10 py-4 bg-transparent border border-white/30 text-white text-[9px] uppercase tracking-[0.3em] font-bold flex items-center gap-4 group/btn hover:bg-white hover:text-black transition-all"
                  >
                    Edit Narrative <Edit3 className="size-3 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12 border-y border-white/5 py-10">
              <div className="space-y-3">
                <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/30">Investment</p>
                <p className="text-lg font-serif text-white/90">Starting from ₹{profile.priceFrom || "5,000"}</p>
              </div>
              <div className="space-y-3">
                <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/30">Specialties</p>
                <p className="text-sm font-sans font-light text-white/60 leading-relaxed uppercase tracking-widest">
                  {profile.specialties?.length ? profile.specialties.join(" • ") : "Wedding • Portrait • Lifestyle"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER PREVIEW ────────────────────────────────────────── */}
      <footer className="py-20 border-t border-white/10 bg-[#0a0a0a] text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-8">End of Public Preview</p>
        <div className="flex justify-center gap-12">
          <Instagram className="size-4 text-white/20" />
        </div>
      </footer>

    </div>
  );
}

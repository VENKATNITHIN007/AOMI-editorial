"use client";

import { useState } from "react";
import { Type, Image as ImageIcon } from "lucide-react";
import { StudioCard } from "./StudioCard";
import { ImageUploadSlot } from "./ImageUploadSlot";
import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-utils";
import { useUpdateStudioProfileMutation, useUploadPortfolioImageMutation } from "../studio.queries";
import type { PhotographerProfile, PortfolioItem } from "@/lib/types/photographer";

interface HeroCardProps {
  profile: PhotographerProfile;
  currentHero: PortfolioItem | null;
  step: number;
  isComplete: boolean;
}

/**
 * HeroCard — Manages the Cover Photo and tagline shown on the public profile hero.
 * Refactored using Page primitives for enhanced editorial structure.
 */
export function HeroCard({ profile, currentHero, step, isComplete }: HeroCardProps) {
  const [tagline, setTagline] = useState(profile.heroTagline ?? "");
  const { success, error } = useToast();
  const updateMutation = useUpdateStudioProfileMutation();
  const uploadMutation = useUploadPortfolioImageMutation();

  const isPending = updateMutation.isPending || uploadMutation.isPending;

  const handleSaveTagline = async () => {
    try {
      await updateMutation.mutateAsync({ heroTagline: tagline });
      success("Tagline Saved", "Your cover photo tagline has been updated.");
    } catch (err) {
      error("Save Failed", getErrorMessage(err, "Could not save tagline."));
    }
  };

  const handleUpload = async (file: File) => {
    try {
      await uploadMutation.mutateAsync({ file, purpose: "hero" });
      success("Cover Photo Updated", "Your cover photo has been set.");
    } catch (err) {
      error("Upload Failed", getErrorMessage(err, "Could not upload image."));
    }
  };

  return (
    <StudioCard step={step} isComplete={isComplete} title="Cover Photo">
      <div className="p-8 sm:p-10">
        <Page.Row className="flex-col lg:flex-row gap-12">
          {/* Tagline */}
          <Page.Stack className="flex-1 gap-6">
            <Page.Row className="gap-2 items-center">
              <Type className="size-3.5 text-black" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Tagline</h3>
            </Page.Row>
            <Page.Row className="gap-3">
              <Input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Capturing the soul of the moment"
                className="rounded-none border-black/10 focus-visible:ring-0 focus:border-black h-11 text-[13px] tracking-tight"
                disabled={isPending}
              />
              <Button
                onClick={handleSaveTagline}
                disabled={isPending || tagline === (profile.heroTagline ?? "")}
                className="h-11 px-8 rounded-none bg-black text-white text-[10px] font-black uppercase tracking-widest shrink-0 transition-all active:scale-95"
              >
                Save
              </Button>
            </Page.Row>
          </Page.Stack>

          {/* Cover Photo */}
          <Page.Stack className="w-full lg:w-80 gap-5">
            <Page.Row className="gap-2 items-center">
              <ImageIcon className="size-3.5 text-black" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Cover Photo</h3>
            </Page.Row>
            <ImageUploadSlot
              currentUrl={currentHero?.mediaUrl}
              alt="Cover photo preview"
              aspectClass="aspect-[16/9]"
              onChange={handleUpload}
              disabled={isPending}
            />
          </Page.Stack>
        </Page.Row>
      </div>
    </StudioCard>
  );
}

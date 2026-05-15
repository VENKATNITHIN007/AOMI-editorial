"use client";

import { useState } from "react";
import { AlignLeft, Image as ImageIcon } from "lucide-react";
import { StudioCard } from "./StudioCard";
import { ImageUploadSlot } from "./ImageUploadSlot";
import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-utils";
import { useUpdateStudioProfileMutation, useUploadPortfolioImageMutation } from "../studio.queries";
import type { PhotographerProfile, PortfolioItem } from "@/lib/types/photographer";

interface AboutCardProps {
  profile: PhotographerProfile;
  currentAbout: PortfolioItem | null;
  step: number;
  isComplete: boolean;
}

/**
 * AboutCard — Manages the photographer's biography text and portrait image.
 * Refactored using Page primitives for enhanced editorial structure.
 */
export function AboutCard({ profile, currentAbout, step, isComplete }: AboutCardProps) {
  const [bio, setBio] = useState(profile.bio ?? "");
  const { success, error } = useToast();
  const updateMutation = useUpdateStudioProfileMutation();
  const uploadMutation = useUploadPortfolioImageMutation();

  const isPending = updateMutation.isPending || uploadMutation.isPending;

  const handleSaveBio = async () => {
    try {
      await updateMutation.mutateAsync({ bio });
      success("Bio Saved", "Your biography has been updated.");
    } catch (err) {
      error("Save Failed", getErrorMessage(err, "Could not save bio."));
    }
  };

  const handleUpload = async (file: File) => {
    try {
      await uploadMutation.mutateAsync({ file, purpose: "about" });
      success("About Image Updated", "Your about image has been set.");
    } catch (err) {
      error("Upload Failed", getErrorMessage(err, "Could not upload image."));
    }
  };

  return (
    <StudioCard step={step} isComplete={isComplete} title="About Section">
      <div className="p-8 sm:p-10">
        <Page.Row className="flex-col lg:flex-row gap-12">
          {/* Bio */}
          <Page.Stack className="flex-1 gap-6">
            <Page.Row className="gap-2 items-center">
              <AlignLeft className="size-3.5 text-black" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Biography</h3>
            </Page.Row>
            <Page.Stack className="gap-4">
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell your story. What inspires your work? What is your approach?"
                className="rounded-none border-black/10 focus-visible:ring-0 focus:border-black min-h-[120px] sm:min-h-[160px] resize-none text-[13px] leading-relaxed"
                disabled={isPending}
              />
              <Page.Row className="justify-end">
                <Button
                  onClick={handleSaveBio}
                  disabled={isPending || bio === (profile.bio ?? "")}
                  className="h-11 px-10 rounded-none bg-black text-white text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                >
                  Save Bio
                </Button>
              </Page.Row>
            </Page.Stack>
          </Page.Stack>

          {/* About Image */}
          <Page.Stack className="w-full lg:w-72 gap-5">
            <Page.Row className="gap-2 items-center">
              <ImageIcon className="size-3.5 text-black" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">About Image</h3>
            </Page.Row>
            <ImageUploadSlot
              currentUrl={currentAbout?.mediaUrl}
              alt="About image preview"
              aspectClass="aspect-[4/5]"
              onChange={handleUpload}
              disabled={isPending}
            />
          </Page.Stack>
        </Page.Row>
      </div>
    </StudioCard>
  );
}

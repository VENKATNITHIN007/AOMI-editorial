"use client";

import { Image as ImageIcon } from "lucide-react";
import { StudioCard } from "./StudioCard";
import { ImageUploadSlot } from "./ImageUploadSlot";
import { Page } from "@/components/Page";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-utils";
import { useUploadPortfolioImageMutation } from "../studio.queries";
import type { PortfolioItem } from "@/lib/types/photographer";

interface ThumbnailCardProps {
  currentThumbnail: PortfolioItem | null;
  step: number;
  isComplete: boolean;
}

const TIPS = [
  "Portrait ratio (4:5) works best",
  "High contrast subject",
  "Eye-catching first impression",
];

/**
 * ThumbnailCard — Manages the Card Photo shown in the photographer discovery grid.
 * Refactored using Page primitives for enhanced editorial structure.
 */
export function ThumbnailCard({ currentThumbnail, step, isComplete }: ThumbnailCardProps) {
  const { success, error } = useToast();
  const uploadMutation = useUploadPortfolioImageMutation();

  const handleUpload = async (file: File) => {
    try {
      await uploadMutation.mutateAsync({ file, purpose: "thumbnail" });
      success("Card Photo Updated", "Your discovery card photo has been set.");
    } catch (err) {
      error("Upload Failed", getErrorMessage(err, "Could not upload image."));
    }
  };

  return (
    <StudioCard
      step={step}
      isComplete={isComplete}
      title="Card Photo"
    >
      <div className="p-8 sm:p-10">
        <Page.Row className="flex-col lg:flex-row gap-12">
          {/* Tips */}
          <Page.Stack className="flex-1 gap-6 pt-2">
            <ul className="space-y-3">
              {TIPS.map((tip) => (
                <Page.Row key={tip} className="gap-4 items-center">
                  <div className="size-1 bg-black shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{tip}</span>
                </Page.Row>
              ))}
            </ul>
          </Page.Stack>

          {/* Card Photo */}
          <Page.Stack className="w-full lg:w-72 gap-5">
            <Page.Row className="gap-2 items-center">
              <ImageIcon className="size-3.5 text-black" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Card Photo</h3>
            </Page.Row>
            <ImageUploadSlot
              currentUrl={currentThumbnail?.mediaUrl}
              alt="Card photo preview"
              aspectClass="aspect-[4/5]"
              onChange={handleUpload}
              disabled={uploadMutation.isPending}
            />
          </Page.Stack>
        </Page.Row>
      </div>
    </StudioCard>
  );
}

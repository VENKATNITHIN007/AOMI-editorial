"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Trash2, LayoutGrid } from "lucide-react";
import { StudioCard } from "./StudioCard";
import { Page } from "@/components/Page";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-utils";
import { useUploadPortfolioImageMutation, useDeletePortfolioItemsMutation } from "../studio.queries";
import { getOptimizedImageUrl } from "@/lib/cloudinary-utils";
import { cn } from "@/lib/utils";
import type { PortfolioItem } from "@/lib/types/photographer";

// ── Slot Configuration ────────────────────────────────────────────────────────

type BentoPurpose = "bento_square" | "bento_portrait" | "bento_landscape";

interface BentoSlot {
  id: number;
  gridClass: string;
  aspectClass: string;
  label: string;
  purpose: BentoPurpose;
}

const BENTO_SLOTS: BentoSlot[] = [
  { id: 0, gridClass: "col-span-2 row-span-2", aspectClass: "aspect-square",  label: "Hero",       purpose: "bento_square"    },
  { id: 1, gridClass: "col-span-1 row-span-1", aspectClass: "aspect-[4/5]",   label: "Portrait 1", purpose: "bento_portrait"  },
  { id: 2, gridClass: "col-span-1 row-span-1", aspectClass: "aspect-[4/5]",   label: "Portrait 2", purpose: "bento_portrait"  },
  { id: 3, gridClass: "col-span-1 row-span-1", aspectClass: "aspect-[16/9]",  label: "Landscape 1",purpose: "bento_landscape" },
  { id: 4, gridClass: "col-span-1 row-span-1", aspectClass: "aspect-[16/9]",  label: "Landscape 2",purpose: "bento_landscape" },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface PortfolioGridCardProps {
  items: PortfolioItem[];
  step: number;
  isComplete: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * PortfolioGridCard — 5-slot Bento Grid where each slot is a direct upload target.
 * Refactored using Page primitives for enhanced editorial structure.
 */
export function PortfolioGridCard({ items, step, isComplete }: PortfolioGridCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const { success, error } = useToast();

  const uploadMutation = useUploadPortfolioImageMutation();
  const deleteMutation = useDeletePortfolioItemsMutation();

  const getItemForSlot = (position: number) => items.find((i) => i.position === position);

  const handleSlotClick = (position: number) => {
    if (uploadMutation.isPending) return;
    setActiveSlot(position);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeSlot === null) return;

    try {
      await uploadMutation.mutateAsync({ file, purpose: "gallery", position: activeSlot });
      success("Slot Updated", "Image uploaded to grid slot.");
    } catch (err) {
      error("Upload Failed", getErrorMessage(err, "Could not upload image."));
    } finally {
      setActiveSlot(null);
      e.target.value = "";
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteMutation.mutateAsync([id]);
      success("Slot Cleared", "Image removed from grid slot.");
    } catch (err) {
      error("Delete Failed", getErrorMessage(err, "Could not remove image."));
    }
  };

  return (
    <StudioCard
      step={step}
      isComplete={isComplete}
      title="Portfolio Grid"
    >
      <div className="p-8 sm:p-10">
        <Page.Stack className="gap-8">
          {/* Header */}
          <Page.Row className="items-center justify-between">
            <Page.Row className="items-center gap-3">
              <LayoutGrid className="size-3.5 text-black" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Bento Exhibition</h3>
            </Page.Row>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              {items.length} / {BENTO_SLOTS.length} slots filled
            </p>
          </Page.Row>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {BENTO_SLOTS.map((slot) => {
              const item = getItemForSlot(slot.id);
              const isThisUploading = uploadMutation.isPending && activeSlot === slot.id;

              return (
                <div
                  key={slot.id}
                  onClick={() => !item && handleSlotClick(slot.id)}
                  className={cn(
                    "relative bg-gray-50 border border-black/5 overflow-hidden group/slot",
                    "transition-all duration-500",
                    slot.gridClass,
                    slot.aspectClass,
                    !item ? "cursor-pointer hover:border-black/20 hover:bg-gray-100" : "cursor-default"
                  )}
                >
                  {item ? (
                    <>
                      <Image
                        src={getOptimizedImageUrl(item.mediaUrl, slot.purpose)}
                        alt={slot.label}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className={cn(
                          "object-cover transition-transform duration-[1.5s] group-hover/slot:scale-105",
                          isThisUploading && "opacity-40 blur-sm"
                        )}
                      />

                      {/* Desktop Hover: delete / replace */}
                      <div className="hidden sm:flex absolute inset-0 bg-black/55 opacity-0 group-hover/slot:opacity-100 transition-opacity duration-300 backdrop-blur-[1px] flex flex-col items-center justify-center gap-4">
                        <button
                          onClick={(e) => handleDelete(e, item._id)}
                          className="size-10 bg-white/10 border border-white/25 text-white hover:bg-red-600 hover:border-red-600 transition-all flex items-center justify-center rounded-full"
                        >
                          <Trash2 className="size-4" />
                        </button>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">
                          Replace
                        </span>
                      </div>

                      {/* Mobile Explicit Triggers */}
                      <div className="sm:hidden absolute inset-0 flex items-center justify-center gap-3">
                         <button 
                           onClick={(e) => handleDelete(e, item._id)}
                           className="size-10 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                         >
                           <Trash2 className="size-4" />
                         </button>
                         <button 
                           onClick={() => handleSlotClick(slot.id)}
                           className="size-10 bg-black text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                         >
                           <Upload className="size-4" />
                         </button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 opacity-25 group-hover/slot:opacity-80 transition-opacity p-4 text-center">
                      {isThisUploading ? (
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] animate-pulse">
                          Uploading…
                        </span>
                      ) : (
                        <>
                          <Upload className="size-6" />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em]">{slot.label}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Hidden file input — shared across all slots */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </Page.Stack>
      </div>
    </StudioCard>
  );
}

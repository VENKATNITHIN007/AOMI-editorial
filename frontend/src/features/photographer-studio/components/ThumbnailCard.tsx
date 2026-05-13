"use client";

import { useState, useRef } from "react";
import { Search, Image as ImageIcon, Upload, Check } from "lucide-react";
import { StudioCard } from "./StudioCard";
import { useToast } from "@/hooks/use-toast";
import { 
  useUploadPortfolioImageMutation,
  useSetPortfolioItemPurposeMutation 
} from "../studio.queries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PortfolioItem } from "@/lib/types/photographer";
import { cn } from "@/lib/utils";

interface ThumbnailCardProps {
  gallery: PortfolioItem[];
  currentThumbnail: PortfolioItem | null;
}

/**
 * ThumbnailCard - Self-contained management for the Discovery Face (search thumbnail).
 */
export function ThumbnailCard({ gallery, currentThumbnail }: ThumbnailCardProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success: showSuccess, error: showError } = useToast();

  const uploadMutation = useUploadPortfolioImageMutation();
  const setPurposeMutation = useSetPortfolioItemPurposeMutation();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadMutation.mutateAsync({ file, purpose: "thumbnail" });
      showSuccess("Discovery Updated", "New search thumbnail has been uploaded and set.");
    } catch (err: any) {
      showError("Upload Failed", err.message || "Could not upload thumbnail.");
    }
  };

  const handleSelectFromGallery = async (itemId: string) => {
    try {
      await setPurposeMutation.mutateAsync({ itemId, purpose: "thumbnail" });
      showSuccess("Discovery Updated", "Gallery item promoted to discovery face.");
      setIsPickerOpen(false);
    } catch (err: any) {
      showError("Sync Failed", err.message || "Could not set discovery thumbnail.");
    }
  }

  const isPending = uploadMutation.isPending || setPurposeMutation.isPending;

  return (
    <StudioCard
      number="04"
      title="Discovery Thumbnail"
      description="The primary face of your studio in global search results"
    >
      <div className="p-8 sm:p-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Thumbnail Preview Section */}
          <div className="size-48 bg-gray-50 border border-black/5 group/thumb relative overflow-hidden shrink-0">
             {currentThumbnail ? (
               <img src={currentThumbnail.mediaUrl} className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-20">
                  <Search className="size-8" />
                  <p className="text-[8px] font-black uppercase tracking-widest text-center">No Face Selection</p>
               </div>
             )}
             
             {/* Upload Overlay */}
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-all duration-500 cursor-pointer flex items-center justify-center backdrop-blur-[2px]"
             >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="size-4 text-white" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">
                    Upload New
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

          {/* Details & Actions */}
          <div className="flex-1 space-y-4">
             <div className="flex items-center gap-3">
                <Search className="size-3.5 text-black" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                  Discovery Context
                </h3>
             </div>
             <p className="text-sm font-light text-gray-500 leading-relaxed tracking-wide max-w-md">
               This image is your first impression. Upload a square-friendly work or select a masterpiece from your gallery to lead your search presence.
             </p>
             <div className="flex gap-6">
                <button 
                  onClick={() => setIsPickerOpen(true)}
                  disabled={isPending}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors"
                >
                  Gallery Picker
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-black border-b border-black pb-1"
                >
                  {isPending ? "Uploading..." : "Direct Upload"}
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Gallery Selection Dialog */}
      <Dialog open={isPickerOpen} onOpenChange={setIsPickerOpen}>
        <DialogContent className="sm:max-w-4xl rounded-none border-black shadow-2xl bg-white p-10 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-10 border-b border-black/5 pb-8">
            <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic leading-none">
              Select Discovery Face
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
                    "relative aspect-square bg-gray-50 border cursor-pointer group/item overflow-hidden transition-all duration-500",
                    currentThumbnail?._id === item._id ? "border-black scale-[0.98]" : "border-black/5 hover:border-black/30"
                  )}
                >
                  <img src={item.mediaUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover/item:scale-110" />
                  {currentThumbnail?._id === item._id && (
                    <div className="absolute top-2 right-2 bg-black text-white p-1.5 shadow-lg">
                      <Check className="size-3" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                     <span className="text-[8px] font-black uppercase tracking-widest text-white">Select for Discovery</span>
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

"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Trash2, X, Image as ImageIcon } from "lucide-react";
import { StudioCard } from "./StudioCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  useUploadPortfolioImageMutation, 
  useDeletePortfolioItemsMutation 
} from "../studio.queries";
import type { PortfolioItem } from "@/lib/types/photographer";

interface GalleryCardProps {
  items: PortfolioItem[];
}

/**
 * GalleryCard - Unified management for all portfolio images.
 * Acts as the asset pool for Hero, About, and Discovery selections.
 */
export function GalleryCard({ items }: GalleryCardProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success: showSuccess, error: showError } = useToast();

  const uploadMutation = useUploadPortfolioImageMutation();
  const deleteMutation = useDeletePortfolioItemsMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removePendingFile = (idx: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const promises = selectedFiles.map(file => uploadMutation.mutateAsync({ file }));
      await Promise.all(promises);
      showSuccess("Exhibition Updated", `${selectedFiles.length} works have been added to your gallery.`);
      setSelectedFiles([]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not sync your new works.";
      showError("Upload Failed", message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync([id]);
      showSuccess("Item Removed", "The selected work has been removed from your gallery.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not remove the item.";
      showError("Deletion Failed", message);
    }
  };

  const isUploading = uploadMutation.isPending;

  return (
    <StudioCard
      number="05"
      title="Portfolio Gallery"
      description="Unified exhibition management and image asset pool"
    >
      <div className="p-8 sm:p-10 space-y-12">
        {/* Minimal Upload Zone */}
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group/upload relative h-32 border border-dashed border-black/10 hover:border-black transition-all duration-500 cursor-pointer flex flex-col items-center justify-center bg-gray-50/30 overflow-hidden"
          >
             <div className="flex flex-col items-center gap-2 transition-transform duration-500 group-hover/upload:scale-105">
                <Upload className="size-5 text-gray-300 group-hover/upload:text-black transition-colors" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 group-hover/upload:text-black">
                  Exhibition Upload / Drag & Drop
                </p>
             </div>
             <input 
               ref={fileInputRef}
               type="file" 
               multiple 
               className="hidden" 
               accept="image/*"
               onChange={handleFileChange}
             />
          </div>

          {/* Pending Uploads Preview */}
          {selectedFiles.length > 0 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
               <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                 {selectedFiles.map((file, idx) => (
                   <div key={idx} className="relative aspect-square bg-gray-50 border border-black/5 group overflow-hidden">
                      <Image src={URL.createObjectURL(file)} alt="Pending preview" fill unoptimized className="object-cover" />
                      <button 
                        onClick={() => removePendingFile(idx)}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="size-4 text-white" />
                      </button>
                   </div>
                 ))}
               </div>
               <div className="flex justify-end pt-4 border-t border-black/5">
                  <Button 
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="h-10 px-8 rounded-none bg-black hover:bg-neutral-800 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-sm transition-all"
                  >
                    {isUploading ? "Syncing Works..." : `Confirm Exhibition (${selectedFiles.length})`}
                  </Button>
               </div>
            </div>
          )}
        </div>

        {/* Live Gallery Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <ImageIcon className="size-3.5 text-black" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                 Active Collection
               </h3>
            </div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              {items.length} Published Works
            </p>
          </div>

          {items.length === 0 ? (
            <div className="h-64 border border-black/5 bg-gray-50/50 flex items-center justify-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                Studio Empty / Awaiting Works
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
               {items.map((item) => (
                 <div 
                   key={item._id} 
                   className="relative aspect-[4/5] bg-gray-50 border border-black/5 group/img overflow-hidden transition-all duration-700 hover:border-black/20 hover:shadow-xl"
                 >
                    <Image 
                      src={item.mediaUrl} 
                      alt="Gallery collection item"
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover/img:scale-110" 
                    />
                    
                    {/* Purpose Badges */}
                    {item.purpose !== "gallery" && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-black text-white text-[7px] font-black uppercase tracking-widest">
                        {item.purpose}
                      </div>
                    )}

                    {/* Control Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex items-center justify-center">
                       <button 
                         onClick={() => handleDelete(item._id)}
                         className="size-10 bg-white/10 border border-white/20 text-white hover:bg-red-600 hover:border-red-600 transition-all flex items-center justify-center group/btn"
                       >
                          <Trash2 className="size-4 transition-transform group-hover/btn:scale-110" />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>
    </StudioCard>
  );
}

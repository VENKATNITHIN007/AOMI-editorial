"use client";

import React, { useState } from "react";
import { UploadCloud, Trash2, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  useMyPortfolioQuery, 
  useAddMultiplePortfolioItemsMutation, 
  useUploadFileMutation, 
  useDeletePortfolioItemMutation 
} from "../studio.queries";
import { cn } from "@/lib/utils";

/**
 * Portfolio Manager Component.
 * Handles display, batch upload, and deletion of portfolio items.
 */
export function PortfolioManager() {
  const { data: portfolio = [], isLoading } = useMyPortfolioQuery();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { success: showSuccess, error: showError } = useToast();
  const addPortfolioMutation = useAddMultiplePortfolioItemsMutation();
  const uploadMutation = useUploadFileMutation();
  const deleteMutation = useDeletePortfolioItemMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      setSelectedFiles(prev => [...prev, ...newFiles].slice(0, 10));
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleBatchUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    try {
      // 1. Upload to Cloudinary
      const uploadPromises = selectedFiles.map(file => 
        uploadMutation.mutateAsync({ file, folder: "portfolio" })
      );
      const results = await Promise.all(uploadPromises);
      
      // 2. Save to DB
      const items = results.map(res => ({
        mediaUrl: res.url,
        mediaType: "image" as const,
      }));
      
      await addPortfolioMutation.mutateAsync({ items });
      
      showSuccess("Success", `${items.length} photos added to portfolio`);
      setSelectedFiles([]);
    } catch (err: any) {
      showError("Upload failed", err.message || "Failed to upload photos");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Remove this item from your portfolio?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      showSuccess("Success", "Item removed from portfolio");
    } catch {
      showError("Error", "Failed to remove item");
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Upload Section */}
      <div className="bg-gray-50 border border-gray-100 p-8 sm:p-12">
        <div className="max-w-xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-light uppercase tracking-widest text-black">Expand Your Showcase</h2>
            <p className="text-xs text-gray-400 tracking-wider">Add up to 10 images at once. WebP or JPG recommended.</p>
          </div>

          <div className="border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center bg-white hover:border-black transition-colors group">
            <UploadCloud className="size-8 text-gray-300 mb-4 group-hover:text-black transition-colors" />
            <label className="cursor-pointer">
              <span className="h-12 px-8 inline-flex items-center justify-center border border-black text-[10px] font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all">
                Select Photos
              </span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-5 gap-3">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="relative aspect-square bg-gray-100 border border-gray-200 group overflow-hidden">
                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeSelectedFile(idx)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="size-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
              <Button 
                onClick={handleBatchUpload} 
                disabled={isUploading}
                className="w-full h-14 bg-black hover:bg-gray-900 text-white rounded-none text-[10px] uppercase tracking-[0.25em] font-bold"
              >
                {isUploading ? "Uploading..." : `Upload ${selectedFiles.length} Photos`}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-black">
            Current Showcase ({portfolio.length})
          </h2>
        </div>
        
        {portfolio.length === 0 && !isLoading ? (
          <div className="py-24 text-center border border-dashed border-gray-100 bg-gray-50/30">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-300 font-bold">Your portfolio is currently empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {portfolio.map((item) => (
              <div key={item._id} className="relative aspect-[4/5] bg-gray-50 group overflow-hidden border border-gray-100 shadow-sm">
                <img 
                  src={item.mediaUrl} 
                  alt={item.category || "Portfolio work"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4 backdrop-blur-[2px]">
                  <button 
                    onClick={() => handleDeleteItem(item._id!)}
                    className="size-12 bg-white flex items-center justify-center text-black hover:bg-red-500 hover:text-white transition-colors shadow-xl"
                    title="Remove item"
                  >
                    <Trash2 className="size-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Star, Trash2, X, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "../../../components/ui/alert-dialog";
import { 
  useMyPortfolioQuery, 
  useAddMultiplePortfolioItemsMutation, 
  useUploadFileMutation, 
  useDeletePortfolioItemMutation,

} from "../studio.queries";

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
      const uploadPromises = selectedFiles.map(file => 
        uploadMutation.mutateAsync({ file, folder: "portfolio" })
      );
      const results = await Promise.all(uploadPromises);
      
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
    try {
      await deleteMutation.mutateAsync(id);
      showSuccess("Success", "Item removed from portfolio");
    } catch {
      showError("Error", "Failed to remove item");
    }
  };


  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto py-2 px-6">
      {/* Upload Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-gray-50/50 p-6 border border-dashed border-gray-200 group hover:border-black transition-all">
        <div className="flex-1 space-y-1">
          <h2 className="text-sm font-bold uppercase tracking-widest text-black">Expand Gallery</h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Drag and drop high-resolution works to your portfolio.</p>
        </div>

        <label className="cursor-pointer">
          <Button variant="outline" className="rounded-none border-black hover:bg-black hover:text-white text-[10px] uppercase tracking-widest h-10 px-8" asChild>
            <span>
              <UploadCloud className="size-4 mr-2" />
              Select Files
            </span>
          </Button>
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="relative aspect-square bg-gray-50 border border-gray-100 group overflow-hidden shadow-sm">
                  <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removeSelectedFile(idx)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="size-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={handleBatchUpload} 
                disabled={isUploading}
                className="px-8 h-12 bg-black hover:bg-gray-900 text-white rounded-none text-[9px] uppercase tracking-[0.2em] font-bold shadow-xl"
              >
                {isUploading ? "Syncing..." : `Confirm & Upload (${selectedFiles.length})`}
              </Button>
            </div>
          </div>
        )}

      {/* Portfolio Grid */}
      <div className="space-y-12">
        <div className="flex items-end justify-between border-b border-gray-100 pb-4">
          <div className="space-y-1">
            <h2 className="text-lg font-serif italic text-black">Curated Collection</h2>
            <p className="text-[9px] text-gray-400 tracking-[0.1em] uppercase font-bold">{portfolio.length} Published Works</p>
          </div>
        </div>
        
        {portfolio.length === 0 && !isLoading ? (
          <div className="py-20 text-center border border-dashed border-gray-100 bg-gray-50/50">
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-300 font-bold">No works added to your studio yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {portfolio.map((item) => (
              <div key={item._id} className="relative aspect-[4/5] bg-gray-50 group overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
                <img 
                  src={item.mediaUrl} 
                  alt={item.category || "Portfolio work"} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
                
                {/* Featured Badge */}
                {item.isFeatured && (
                  <div className="absolute top-4 left-4 bg-black text-white p-2 shadow-lg">
                    <Star className="size-3 fill-white" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                  <div className="flex gap-2">
                    {/* Curation actions moved to Preview Editor */}
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button 
                        className="size-10 bg-white/20 border border-white/20 flex items-center justify-center text-white hover:bg-red-500 hover:border-red-500 transition-all shadow-xl"
                        title="Remove item"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-none border-none">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-serif">Remove from Portfolio?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-gray-500">
                          This image will be permanently removed from your studio gallery. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-none border-gray-200 text-[10px] uppercase tracking-widest font-bold">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteItem(item._id!)}
                          className="rounded-none bg-red-600 hover:bg-red-700 text-white text-[10px] uppercase tracking-widest font-bold"
                        >
                          Delete Item
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

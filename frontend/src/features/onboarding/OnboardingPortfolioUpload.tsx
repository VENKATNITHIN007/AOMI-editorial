"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingPortfolioUploadProps {
  onComplete: (files: File[]) => void;
  isUploading: boolean;
}

export function OnboardingPortfolioUpload({ onComplete, isUploading }: OnboardingPortfolioUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      setSelectedFiles(prev => [...prev, ...newFiles].slice(0, 10)); // max 10
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="space-y-4">
        <h3 className="text-2xl font-serif text-black">3. Initial Portfolio</h3>
        <p className="text-sm text-gray-500 max-w-md">Upload at least 1 image to start. Your best work will define your brand from day one.</p>
      </div>

      <div className="group relative border border-dashed border-gray-200 p-12 sm:p-20 flex flex-col items-center justify-center bg-gray-50/30 hover:bg-white hover:border-black transition-all duration-500 min-h-[300px]">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-black" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-black" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-black" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-black" />
        </div>

        <UploadCloud className="size-12 text-gray-300 mb-6 group-hover:text-black transition-colors" />
        <p className="text-sm font-medium text-black mb-1 uppercase tracking-widest">Drop your vision here</p>
        <p className="text-xs text-gray-400 mb-8 tracking-wider">Up to 10 high-resolution images (JPG, PNG)</p>
        
        <label className="cursor-pointer">
          <span className="h-12 px-10 inline-flex items-center justify-center bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-lg active:scale-95">
            Select Gallery
          </span>
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Preview Selection ({selectedFiles.length}/10)</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="relative aspect-[4/5] bg-gray-50 group overflow-hidden border border-gray-100 shadow-sm transition-transform hover:-translate-y-1 duration-500">
                <Image 
                  src={URL.createObjectURL(file)} 
                  alt="preview" 
                  fill 
                  unoptimized
                  className="object-cover" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => removeFile(idx)}
                    className="size-10 bg-white rounded-full flex items-center justify-center text-black hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-90"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-12 border-t border-gray-50 flex flex-col sm:flex-row gap-6 justify-end">
        <Button 
          onClick={() => onComplete([])} 
          disabled={isUploading} 
          variant="ghost" 
          className="h-16 px-10 rounded-none text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 hover:text-black transition-colors"
        >
          Skip for now
        </Button>
        <Button 
          onClick={() => onComplete(selectedFiles)} 
          disabled={isUploading || selectedFiles.length === 0} 
          className="px-20 h-16 bg-black hover:bg-gray-900 text-white rounded-none text-[10px] uppercase tracking-[0.3em] font-bold shadow-2xl hover:shadow-black/20 transition-all active:scale-[0.98]"
        >
          {isUploading ? "Syncing..." : "Complete Setup"}
        </Button>
      </div>
    </div>
  );
}

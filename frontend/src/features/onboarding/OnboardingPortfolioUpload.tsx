"use client";

import { useState } from "react";
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 mb-8">
        <h3 className="text-xl font-light tracking-widest uppercase text-black">Initial Portfolio</h3>
        <p className="text-xs tracking-wider text-gray-400">Upload up to 10 of your best images to start showcasing your work. You can add more later.</p>
      </div>

      <div className="border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center bg-gray-50/50 min-h-[200px]">
        <UploadCloud className="size-8 text-gray-400 mb-4" />
        <p className="text-sm font-medium text-black mb-1">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-500 mb-6">JPG, PNG up to 10MB each</p>
        <label className="cursor-pointer">
          <span className="h-10 px-6 inline-flex items-center justify-center bg-white border border-gray-200 text-[10px] font-bold uppercase tracking-widest text-black hover:bg-gray-50">
            Select Files
          </span>
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {selectedFiles.map((file, idx) => (
            <div key={idx} className="relative aspect-square bg-gray-100 group overflow-hidden border border-gray-200">
              <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
              <button 
                onClick={() => removeFile(idx)}
                className="absolute top-2 right-2 size-6 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-black hover:bg-red-50 hover:text-red-500"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row gap-4 justify-end">
        <Button 
          onClick={() => onComplete([])} 
          disabled={isUploading} 
          variant="outline" 
          className="h-14 px-8 rounded-none text-[10px] uppercase tracking-[0.25em] font-bold border-gray-200"
        >
          Skip for now
        </Button>
        <Button 
          onClick={() => onComplete(selectedFiles)} 
          disabled={isUploading || selectedFiles.length === 0} 
          className="h-14 px-12 bg-black hover:bg-gray-900 text-white rounded-none text-[10px] uppercase tracking-[0.25em] font-bold"
        >
          {isUploading ? "Uploading..." : "Complete Setup"}
        </Button>
      </div>
    </div>
  );
}

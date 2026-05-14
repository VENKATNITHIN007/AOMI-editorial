"use client";

import { useRef } from "react";
import Image from "next/image";
import { Upload, Image as ImageIcon, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadSlotProps {
  /** Currently uploaded image URL. Null = empty slot. */
  currentUrl: string | null | undefined;
  /** Alt text for the preview image. */
  alt: string;
  /** Aspect ratio class, e.g. "aspect-[16/9]" or "aspect-[4/5]". */
  aspectClass?: string;
  /** Called when the user selects a file. */
  onChange: (file: File) => void;
  /** Disabled during upload. */
  disabled?: boolean;
  /** Extra classes on the wrapper. */
  className?: string;
}

/**
 * ImageUploadSlot — Reusable click-to-upload image preview.
 * Refined for mobile to prevent accidental file picker triggers.
 */
export function ImageUploadSlot({
  currentUrl,
  alt,
  aspectClass = "aspect-[4/5]",
  onChange,
  disabled = false,
  className,
}: ImageUploadSlotProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAction = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
    e.target.value = ""; // Allow re-uploading same file
  };

  return (
    <div
      className={cn(
        aspectClass,
        "relative bg-gray-50 border border-black/5 overflow-hidden group/slot",
        !currentUrl && "cursor-pointer",
        disabled && "opacity-60",
        className
      )}
      onClick={() => !currentUrl && handleAction()}
    >
      {currentUrl ? (
        <>
          <Image src={currentUrl} alt={alt} fill className="object-cover" />
          
          {/* Desktop Hover Overlay */}
          <div 
            onClick={handleAction}
            className="hidden sm:flex absolute inset-0 bg-black/40 opacity-0 group-hover/slot:opacity-100 transition-all duration-500 items-center justify-center backdrop-blur-[2px] cursor-pointer"
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="size-4 text-white" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Replace</span>
            </div>
          </div>

          {/* Mobile Explicit Trigger (avoiding accidental whole-surface clicks) */}
          <div className="sm:hidden absolute bottom-3 right-3 z-10">
            <button
              onClick={handleAction}
              className="size-10 bg-black text-white rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform"
            >
              <Edit2 className="size-4" />
            </button>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-20 group-hover/slot:opacity-40 transition-opacity">
          <ImageIcon className="size-8" />
          <p className="text-[8px] font-black uppercase tracking-widest">
            {disabled ? "Uploading..." : "Tap to Upload"}
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={handleChange}
      />
    </div>
  );
}

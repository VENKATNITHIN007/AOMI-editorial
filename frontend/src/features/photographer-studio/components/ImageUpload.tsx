"use client";

import React, { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface ImageUploadProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  disabled?: boolean;
}

export function ImageUpload<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled = false,
}: ImageUploadProps<T>) {
  const [isUploading, setIsUploading] = useState(false);

  // Mock upload for now - will be replaced with Cloudinary in Phase 6
  const handleUpload = async (file: File, onChange: (value: string) => void) => {
    setIsUploading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const mockUrl = URL.createObjectURL(file); 
      onChange(mockUrl);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-4">
            {label}
          </FieldLabel>
          
          <div className="flex items-center gap-8">
            {/* Preview Area */}
            <div className="relative size-24 border border-black overflow-hidden bg-gray-50 flex items-center justify-center group">
              {field.value ? (
                <>
                  <img 
                    src={field.value} 
                    alt="Preview" 
                    className="size-full object-cover" 
                  />
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => field.onChange("")}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="size-5 text-white" />
                    </button>
                  )}
                </>
              ) : (
                <ImageIcon className="size-6 text-gray-200" />
              )}
              
              {isUploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <Loader2 className="size-5 animate-spin text-black" />
                </div>
              )}
            </div>

            {/* Action Area */}
            <div className="flex-1 space-y-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  disabled={disabled || isUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file, field.onChange);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <div className={cn(
                  "flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold px-6 h-12 border border-black transition-colors",
                  isUploading ? "opacity-50" : "hover:bg-black hover:text-white"
                )}>
                  <Upload className="size-3" />
                  {field.value ? "Change Image" : "Upload Image"}
                </div>
              </div>
              {description && (
                <p className="text-[9px] text-gray-400 uppercase tracking-widest leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
          
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

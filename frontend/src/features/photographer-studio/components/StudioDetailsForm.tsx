"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUpdateProfileMutation as useUpdateUserMutation } from "@/features/auth";
import { useUpdateProfileMutation, useUploadFileMutation } from "../studio.queries";
import { CITY_OPTIONS, SPECIALTY_OPTIONS } from "@/lib/constants/photographer";
import type { PhotographerProfile } from "@/lib/types/photographer";
import { useCallback } from "react";

const studioUpdateSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores"),
  avatar: z.string().optional(),
  location: z.string().min(1, "Please select a location"),
  bio: z.string().max(1000, "Bio cannot exceed 1000 characters").optional(),
  specialties: z
    .array(z.string())
    .min(1, "Please select at least one specialty")
    .max(3, "You can select up to 3 specialties"),
  priceFrom: z.coerce.number().min(0, "Price must be a positive number"),
});

type StudioUpdateInput = z.infer<typeof studioUpdateSchema>;

interface StudioDetailsFormProps {
  profile: PhotographerProfile;
}

export function StudioDetailsForm({ profile }: StudioDetailsFormProps) {
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  
  const updatePhotographerMutation = useUpdateProfileMutation();
  const updateUserMutation = useUpdateUserMutation();
  const uploadFileMutation = useUploadFileMutation();

  const form = useForm<StudioUpdateInput>({
    resolver: zodResolver(studioUpdateSchema) as any,
    defaultValues: {
      username: profile.username,
      avatar: user?.avatar || "",
      location: profile.location || "",
      bio: profile.bio || "",
      specialties: profile.specialties || [],
      priceFrom: profile.priceFrom || 0,
    },
  });

  const handleImageUpload = useCallback(async (file: File) => {
    const res = await uploadFileMutation.mutateAsync({ file, folder: "avatar" });
    return res.url;
  }, [uploadFileMutation]);

  const onSubmit = async (data: StudioUpdateInput) => {
    try {
      // 1. Update Photographer Profile
      await updatePhotographerMutation.mutateAsync({
        username: data.username,
        location: data.location,
        bio: data.bio,
        specialties: data.specialties,
        priceFrom: data.priceFrom,
      });

      // 2. Update User Avatar (if changed)
      if (data.avatar !== user?.avatar) {
        await updateUserMutation.mutateAsync({
          avatar: data.avatar || undefined,
        });
      }

      showSuccess("Studio updated", "Your profile and studio settings have been saved.");
    } catch (err: any) {
      showError("Update failed", err.message || "Could not save studio settings.");
    }
  };

  const isPending = updatePhotographerMutation.isPending || updateUserMutation.isPending;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="space-y-12">
        <div className="space-y-2">
          <h2 className="text-xl font-light uppercase tracking-widest text-black">Studio Information</h2>
          <p className="text-xs text-gray-400 tracking-wider">Update your public presence and professional details.</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className="space-y-10">
            {/* Identity Section */}
            <div className="p-8 bg-gray-50/50 border border-gray-100 space-y-8">
              <Form.ImageUpload
                control={form.control}
                name="avatar"
                label="Studio Profile Picture"
                description="This image represents you in the discovery gallery."
                disabled={isPending}
                onUpload={handleImageUpload}
              />

              <Form.Input
                control={form.control}
                name="username"
                label="Public Username"
                description="This affects your public URL handle: /photographers/[username]"
                disabled={isPending}
              />
            </div>

            {/* Professional Section */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <Form.Select
                  control={form.control}
                  name="location"
                  label="Primary Location"
                  options={CITY_OPTIONS}
                  disabled={isPending}
                />

                <Form.Input
                  control={form.control}
                  name="priceFrom"
                  label="Starting Price (₹) / Day"
                  type="number"
                  disabled={isPending}
                />
              </div>

              <Form.Textarea
                control={form.control}
                name="bio"
                label="Biography"
                placeholder="Tell potential clients about your style and experience..."
                className="min-h-[160px] resize-none"
                disabled={isPending}
              />

              <Form.MultiSelect
                control={form.control}
                name="specialties"
                label="Specialties (Select up to 3)"
                options={SPECIALTY_OPTIONS}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="pt-10 border-t border-gray-100">
            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full sm:w-auto px-16 h-14 bg-black hover:bg-gray-900 text-white rounded-none text-[10px] uppercase tracking-[0.25em] font-bold transition-all shadow-lg hover:shadow-black/5"
            >
              {isPending ? "Saving Changes..." : "Update Studio Settings"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

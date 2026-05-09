"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/features/auth";
import { useUpdateProfileMutation } from "../studio.queries";
import { CITY_OPTIONS, SPECIALTY_OPTIONS } from "@/lib/constants/photographer";
import type { PhotographerProfile } from "@/lib/types/photographer";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

const studioUpdateSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores"),
  location: z.string().min(1, "Please select a location"),
  instagram: z.string().optional(),
  specialties: z
    .array(z.string())
    .min(1, "Please select at least one specialty")
    .max(3, "You can select up to 3 specialties"),
  priceFrom: z.coerce.number().min(0, "Price must be a positive number"),
});

type StudioUpdateInput = z.infer<typeof studioUpdateSchema>;

interface StudioDetailsFormProps {
  profile: PhotographerProfile;
  isDialog?: boolean;
}

export function StudioDetailsForm({ profile, isDialog = false }: StudioDetailsFormProps) {
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  
  const updatePhotographerMutation = useUpdateProfileMutation();

  const form = useForm<StudioUpdateInput>({
    resolver: zodResolver(studioUpdateSchema) as any,
    defaultValues: {
      username: profile.username,
      location: profile.location || "",
      instagram: profile.instagram || "",
      specialties: profile.specialties || [],
      priceFrom: profile.priceFrom || 0,
    },
  });


  const onSubmit = async (data: StudioUpdateInput) => {
    try {
      // 1. Update Photographer Profile
      await updatePhotographerMutation.mutateAsync({
        username: data.username,
        location: data.location,
        instagram: data.instagram,
        specialties: data.specialties,
        priceFrom: data.priceFrom,
      });

      showSuccess("Studio updated", "Your studio settings have been saved.");
      
      // If in dialog, we might want to refresh or close, but let's keep it simple for now
      if (isDialog) {
        // In a real app, you'd close the dialog here
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err: any) {
      showError("Update failed", err.message || "Could not save studio settings.");
    }
  };

  const isPending = updatePhotographerMutation.isPending;

  return (
    <div className={cn(
      "mx-auto w-full",
      !isDialog && "max-w-4xl py-12 px-6"
    )}>
      <div className={cn("space-y-8", isDialog && "space-y-6")}>
        {!isDialog && (
          <div className="space-y-2 pb-12 border-b">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-medium">Professional Identity</p>
            <h2 className="text-4xl font-serif italic text-black">Studio Settings</h2>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-8", isDialog && "space-y-6")}>
          <div className={cn(
            "grid grid-cols-1 gap-16",
            !isDialog && "lg:grid-cols-12"
          )}>
            {/* Media & Identity Section */}
            <div className={cn(
              "space-y-8",
              !isDialog && "lg:col-span-5"
            )}>
              <Form.Input
                control={form.control}
                name="username"
                label="Studio Handle"
                placeholder="your_handle"
                disabled={isPending}
              />

              <Form.Input
                control={form.control}
                name="instagram"
                label="Instagram Username"
                placeholder="username"
                disabled={isPending}
              />
            </div>

            {/* Business Details Section */}
            <div className={cn(
              "space-y-12",
              !isDialog && "lg:col-span-7"
            )}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <Form.Select
                  control={form.control}
                  name="location"
                  label="Location"
                  options={CITY_OPTIONS}
                  disabled={isPending}
                />

                <Form.Input
                  control={form.control}
                  name="priceFrom"
                  label="Starting Price (₹)"
                  type="number"
                  disabled={isPending}
                />
              </div>

              <Form.MultiSelect
                control={form.control}
                name="specialties"
                label="Specialties"
                options={SPECIALTY_OPTIONS}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="pt-12 border-t border-gray-100 flex justify-end">
            <Button 
              type="submit" 
              disabled={isPending}
              className="px-12 h-12 bg-black hover:bg-gray-900 text-white rounded-none text-[10px] uppercase tracking-[0.3em] font-bold transition-all shadow-xl active:scale-[0.98]"
            >
              {isPending ? "Syncing..." : "Update Studio"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

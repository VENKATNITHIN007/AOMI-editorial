"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUpdateStudioProfileMutation } from "../studio.queries";
import { CITY_OPTIONS, SPECIALTY_OPTIONS } from "@/lib/constants/photographer";
import type { PhotographerProfile } from "@/lib/types/photographer";
import { cn } from "@/lib/utils";

const studioUpdateSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores"),
  location: z.string().min(1, "Please select a location"),
  specialties: z
    .array(z.string())
    .min(1, "Please select at least one specialty")
    .max(3, "You can select up to 3 specialties"),
  priceFrom: z.coerce.number().min(0, "Price must be a positive number"),
});

type StudioUpdateInput = z.infer<typeof studioUpdateSchema>;

interface StudioDetailsFormProps {
  profile: PhotographerProfile;
  onSuccess?: () => void;
  className?: string;
}

/**
 * StudioDetailsForm - Clean, editorial form for business metadata.
 */
export function StudioDetailsForm({ profile, onSuccess, className }: StudioDetailsFormProps) {
  const { success: showSuccess, error: showError } = useToast();
  const updateMutation = useUpdateStudioProfileMutation();

  const form = useForm<StudioUpdateInput>({
    resolver: zodResolver(studioUpdateSchema),
    defaultValues: {
      username: profile.username,
      location: profile.location || "",
      specialties: profile.specialties || [],
      priceFrom: profile.priceFrom || 0,
    },
  });

  const onSubmit = async (data: StudioUpdateInput) => {
    try {
      await updateMutation.mutateAsync({
        username: data.username,
        location: data.location,
        specialties: data.specialties,
        priceFrom: data.priceFrom,
      });

      showSuccess("Studio Synced", "Your business details have been exhibitioned.");
      onSuccess?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not save studio settings.";
      showError("Sync Failed", message);
    }
  };

  const isPending = updateMutation.isPending;

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Form.Input
              control={form.control}
              name="username"
              label="Studio Handle / Username"
              placeholder="e.g. jdoe_photography"
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Form.Select
              control={form.control}
              name="location"
              label="Operating Base / City"
              options={CITY_OPTIONS}
              disabled={isPending}
            />

            <Form.Input
              control={form.control}
              name="priceFrom"
              label="Entry Pricing (₹)"
              type="number"
              disabled={isPending}
            />
          </div>

          <Form.MultiSelect
            control={form.control}
            name="specialties"
            label="Focus / Specialties"
            options={SPECIALTY_OPTIONS}
            disabled={isPending}
          />
        </div>

        <div className="pt-8 border-t border-black/5 flex justify-end">
          <Button 
            type="submit" 
            disabled={isPending}
            className="px-10 h-10 bg-black hover:bg-neutral-800 text-white rounded-none text-[10px] uppercase tracking-[0.3em] font-black transition-all active:scale-[0.98]"
          >
            {isPending ? "Syncing..." : "Update Specifications"}
          </Button>
        </div>
      </form>
    </div>
  );
}

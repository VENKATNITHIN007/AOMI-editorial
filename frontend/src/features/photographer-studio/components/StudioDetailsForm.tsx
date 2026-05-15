"use client";

import React from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/Form";
import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-utils";
import { useUpdateStudioProfileMutation } from "../studio.queries";
import { CITY_OPTIONS, SPECIALTY_OPTIONS } from "@/lib/constants/photographer";
import type { PhotographerProfile } from "@/lib/types/photographer";
import { studioProfileUpdateSchema, type StudioProfileUpdateInput } from "@/lib/validations/photographer";
import { cn } from "@/lib/utils";

interface StudioDetailsFormProps {
  profile: PhotographerProfile;
  onSuccess?: () => void;
  className?: string;
}

/**
 * StudioDetailsForm - Clean, editorial form for business metadata.
 * Refactored for production-grade readability using Page primitives.
 */
export function StudioDetailsForm({ profile, onSuccess, className }: StudioDetailsFormProps) {
  const { success: showSuccess, error: showError } = useToast();
  const updateMutation = useUpdateStudioProfileMutation();

  const form = useForm<StudioProfileUpdateInput>({
    resolver: zodResolver(studioProfileUpdateSchema) as Resolver<StudioProfileUpdateInput>,
    defaultValues: {
      username: profile.username,
      location: profile.location || "",
      specialties: profile.specialties || [],
      priceFrom: profile.priceFrom || 0,
    },
  });

  const onSubmit = async (data: StudioProfileUpdateInput) => {
    try {
      await updateMutation.mutateAsync(data);
      showSuccess("Details Saved", "Your profile details have been updated.");
      onSuccess?.();
    } catch (err: unknown) {
      showError("Sync Failed", getErrorMessage(err, "Could not save studio settings."));
    }
  };

  const isPending = updateMutation.isPending;

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Page.Stack className="gap-10">
          <Page.Stack className="gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Form.Input
                control={form.control}
                name="username"
                label="Username"
                placeholder="e.g. jdoe_photography"
                disabled={isPending}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Form.Select
                control={form.control}
                name="location"
                label="City"
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
              label="Focus Areas"
              options={SPECIALTY_OPTIONS}
              disabled={isPending}
            />
          </Page.Stack>

          <Page.Row className="pt-8 border-t border-black/5 justify-end">
            <Button 
              type="submit" 
              disabled={isPending}
              className="px-12 h-11 bg-black hover:bg-neutral-800 text-white rounded-none text-[10px] uppercase tracking-[0.3em] font-black transition-all active:scale-[0.98]"
            >
              {isPending ? "Saving..." : "Update Details"}
            </Button>
          </Page.Row>
        </Page.Stack>
      </form>
    </div>
  );
}

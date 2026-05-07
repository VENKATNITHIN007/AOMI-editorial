"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { CITY_OPTIONS, SPECIALTY_OPTIONS } from "@/lib/constants/photographer";
import { photographerOnboardingSchema, type PhotographerOnboardingInput } from "@/lib/validations/photographer";

interface OnboardingDetailsFormProps {
  onSubmit: (data: PhotographerOnboardingInput) => void;
  isPending: boolean;
}

export function OnboardingDetailsForm({ onSubmit, isPending }: OnboardingDetailsFormProps) {
  const form = useForm<PhotographerOnboardingInput>({
    resolver: zodResolver(photographerOnboardingSchema),
    defaultValues: {
      username: "",
      location: "",
      specialties: [],
      priceFrom: "",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 mb-8">
        <h3 className="text-xl font-light tracking-widest uppercase text-black">Studio Details</h3>
        <p className="text-xs tracking-wider text-gray-400">This information will be displayed on your public profile.</p>
      </div>

      <Form.Input
        control={form.control}
        name="username"
        label="Username"
        placeholder="your_handle"
        description="Your public URL: /photographers/[username]"
        disabled={isPending}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Form.Select
          control={form.control}
          name="location"
          label="Primary location"
          placeholder="Select city"
          options={CITY_OPTIONS}
          disabled={isPending}
        />

        <Form.Input
          control={form.control}
          name="priceFrom"
          label="Starting price (₹) / day"
          type="number"
          placeholder="e.g. 15000"
          disabled={isPending}
        />
      </div>

      <Form.MultiSelect
        control={form.control}
        name="specialties"
        label="Specialties"
        options={SPECIALTY_OPTIONS}
        description="Select up to 3 (e.g. Wedding, Fashion)"
        disabled={isPending}
      />

      <div className="pt-6 border-t border-gray-50">
        <Button 
          type="submit" 
          disabled={isPending} 
          className="w-full h-14 bg-black hover:bg-gray-900 text-white rounded-none text-[10px] uppercase tracking-[0.25em] font-bold"
        >
          {isPending ? "Saving..." : "Continue to Portfolio"}
        </Button>
      </div>
    </form>
  );
}

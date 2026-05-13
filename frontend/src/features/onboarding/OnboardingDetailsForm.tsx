"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { CITY_OPTIONS, SPECIALTY_OPTIONS } from "@/lib/constants/photographer";
import * as z from "zod";
import { photographerOnboardingSchema } from "@/lib/validations/photographer";

type OnboardingInput = z.infer<typeof photographerOnboardingSchema>;

interface OnboardingDetailsFormProps {
  onSubmit: (data: OnboardingInput) => void;
  isPending: boolean;
}

export function OnboardingDetailsForm({ onSubmit, isPending }: OnboardingDetailsFormProps) {
  const form = useForm<OnboardingInput>({
    resolver: zodResolver(photographerOnboardingSchema) as Resolver<OnboardingInput>,
    defaultValues: {
      username: "",
      location: "",
      specialties: [],
      priceFrom: "",
      bio: "",
      instagram: "",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="space-y-4">
        <h3 className="text-2xl font-serif text-black">1. Studio Identity</h3>
        <p className="text-sm text-gray-500 max-w-md">Define how you want to be discovered. Your username creates your unique URL handle.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="space-y-12">
          <Form.Input
            control={form.control}
            name="username"
            label="Public Handle"
            placeholder="e.g. alex_morgan"
            description="Your URL: /photographers/[username]"
            disabled={isPending}
            className="bg-transparent border-b border-gray-200 rounded-none px-0 focus:border-black transition-colors"
          />

          <Form.Input
            control={form.control}
            name="instagram"
            label="Instagram"
            placeholder="username"
            description="Share your social portfolio"
            disabled={isPending}
            className="bg-transparent border-b border-gray-200 rounded-none px-0 focus:border-black transition-colors"
          />
        </div>

        <div className="space-y-12">
          <Form.Textarea
            control={form.control}
            name="bio"
            label="Artistic Vision (Bio)"
            placeholder="Describe your style, experience, and what makes your work unique..."
            className="min-h-[160px] resize-none bg-gray-50/50 border-gray-100 focus:bg-white transition-all"
            disabled={isPending}
          />
        </div>
      </div>

      <div className="pt-12 space-y-12 border-t border-gray-50">
        <div className="space-y-4">
          <h3 className="text-2xl font-serif text-black">2. Professional Details</h3>
          <p className="text-sm text-gray-500">Essential information for discovery and booking inquiries.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Form.Select
            control={form.control}
            name="location"
            label="Primary Location"
            placeholder="Select city"
            options={CITY_OPTIONS}
            disabled={isPending}
          />

          <Form.Input
            control={form.control}
            name="priceFrom"
            label="Starting Price (₹) / Day"
            type="number"
            placeholder="e.g. 25000"
            disabled={isPending}
            className="bg-transparent border-b border-gray-200 rounded-none px-0 focus:border-black transition-colors"
          />
        </div>

        <Form.MultiSelect
          control={form.control}
          name="specialties"
          label="Specialties"
          options={SPECIALTY_OPTIONS}
          description="Select up to 3 core focus areas."
          disabled={isPending}
        />
      </div>

      <div className="pt-12 flex justify-end">
        <Button 
          type="submit" 
          disabled={isPending} 
          className="px-20 h-16 bg-black hover:bg-gray-900 text-white rounded-none text-[10px] uppercase tracking-[0.3em] font-bold shadow-2xl hover:shadow-black/20 transition-all active:scale-[0.98]"
        >
          {isPending ? "Setting up..." : "Continue to Portfolio"}
        </Button>
      </div>
    </form>
  );
}

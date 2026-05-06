"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/features/auth";
import { useCreateProfileMutation } from "@/features/photographer-studio/studio.queries";
import { CITY_OPTIONS, SPECIALTY_OPTIONS } from "@/lib/constants/photographer";
import { photographerOnboardingSchema, type PhotographerOnboardingInput } from "@/lib/validations/photographer";

export function OnboardForm() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const createProfileMutation = useCreateProfileMutation();
  const { user } = useAuth();

  const form = useForm<PhotographerOnboardingInput>({
    resolver: zodResolver(photographerOnboardingSchema),
    defaultValues: {
      username: "",
      location: "",
      specialties: [],
      priceFrom: "",
    },
  });

  const onSubmit = async (data: PhotographerOnboardingInput) => {
    try {
      await createProfileMutation.mutateAsync({
        username: data.username,
        location: data.location,
        specialties: data.specialties,
        priceFrom: data.priceFrom ? Number(data.priceFrom) : undefined,
      });
      success("Studio created successfully");

      if (user?.role === "photographer") {
        router.replace("/photographer/dashboard");
      } else {
        setTimeout(() => router.replace("/photographer/dashboard"), 500);
      }
    } catch (err: unknown) {
      showError((err as Error).message || "Failed to create profile");
    }
  };

  const pending = createProfileMutation.isPending;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 sm:p-10 space-y-6">
      <Form.Input
        control={form.control}
        name="username"
        label="Username"
        placeholder="your_handle"
        description="Your public URL: /photographers/[username]"
        disabled={pending}
      />

      <Form.Select
        control={form.control}
        name="location"
        label="Primary location"
        placeholder="Select city"
        options={CITY_OPTIONS}
        disabled={pending}
      />

      <Form.MultiSelect
        control={form.control}
        name="specialties"
        label="Specialties"
        options={SPECIALTY_OPTIONS}
        description="Select up to 3"
        disabled={pending}
      />

      <Form.Input
        control={form.control}
        name="priceFrom"
        label="Starting price ($)"
        type="number"
        placeholder="e.g. 150"
        disabled={pending}
      />

      <div className="flex items-center justify-end gap-4 border-t border-gray-50 pt-6">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={pending} className="h-11 text-[10px] uppercase tracking-[0.15em] font-bold border-gray-200">
          Cancel
        </Button>
        <Button type="submit" disabled={pending} className="h-11 bg-black hover:bg-gray-900 text-white text-[10px] uppercase tracking-[0.15em] font-bold px-8">
          {pending ? "Creating..." : "Create Studio"}
        </Button>
      </div>
    </form>
  );
}

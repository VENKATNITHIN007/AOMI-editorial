"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, useUpdateProfileMutation } from "@/features/auth";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(50),
  phoneNumber: z.string().optional(),
  avatar: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type ProfileInput = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfileMutation();
  const { success, error: showError } = useToast();

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", phoneNumber: "", avatar: "" },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.name || "",
        phoneNumber: user.phoneNumber || "",
        avatar: user.avatar || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileInput) => {
    try {
      await updateProfileMutation.mutateAsync({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber || undefined,
        avatar: data.avatar || undefined,
      });
      success("Profile updated successfully");
    } catch {
      showError("Failed to update profile");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">Full Name</Label>
          <Input {...register("fullName")} placeholder="Your name" disabled={isSubmitting} className="h-12 text-sm border-gray-200 bg-gray-50/50 focus:bg-white transition-colors" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">Email</Label>
          <Input value={user?.email || ""} disabled className="h-12 text-sm bg-gray-100 text-gray-400 cursor-not-allowed" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">Phone Number</Label>
          <Input {...register("phoneNumber")} placeholder="+1 (555) 000-0000" disabled={isSubmitting} className="h-12 text-sm border-gray-200 bg-gray-50/50 focus:bg-white transition-colors" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">Avatar URL</Label>
          <Input {...register("avatar")} placeholder="https://example.com/avatar.jpg" disabled={isSubmitting} className="h-12 text-sm border-gray-200 bg-gray-50/50 focus:bg-white transition-colors" />
        </div>
      </div>
      <div className="border-t border-gray-50 pt-6">
        <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-black hover:bg-gray-900 text-white rounded-none text-[10px] uppercase tracking-[0.2em] font-bold disabled:opacity-50">
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

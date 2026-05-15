"use client";

import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { useAuth, useUpdateProfileMutation, useUploadAvatarMutation } from "@/features/auth";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-utils";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(50),
  phoneNumber: z.string().optional(),
  avatar: z.string().optional(), // Used for local preview/UI state
});

type ProfileInput = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  onSuccess?: () => void;
}

export function ProfileForm({ onSuccess }: ProfileFormProps) {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfileMutation();
  const uploadAvatarMutation = useUploadAvatarMutation();
  const { success, error: showError } = useToast();

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", phoneNumber: "", avatar: "" },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.name || "",
        phoneNumber: user.phoneNumber || "",
        avatar: user.avatar || "",
      });
    }
  }, [user, form]);

  /**
   * Upload avatar using the new atomic "One Trip" API.
   * This updates both Cloudinary and the User record in one request.
   */
  const handleAvatarUpload = useCallback(async (file: File): Promise<string> => {
    const result = await uploadAvatarMutation.mutateAsync(file);
    return result.avatar; // Backend returns { avatar: "new_url" }
  }, [uploadAvatarMutation]);

  const onSubmit = async (data: ProfileInput) => {
    try {
      await updateProfileMutation.mutateAsync({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber || undefined,
      });
      success("Profile updated successfully");
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to update profile"));
    }
  };

  const isPending = updateProfileMutation.isPending;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
      <div className="space-y-8">
        {/* Avatar Section */}
        <Form.ImageUpload
          control={form.control}
          name="avatar"
          label="Profile Picture"
          description="JPG, PNG or WebP. Max 10MB."
          disabled={isPending}
          onUpload={handleAvatarUpload}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Input
            control={form.control}
            name="fullName"
            label="Full Name"
            placeholder="Your name"
            disabled={isPending}
          />
          
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
              Email Address
            </label>
            <div className="h-12 flex items-center px-4 bg-gray-100 text-gray-400 text-sm border border-transparent cursor-not-allowed">
              {user?.email}
            </div>
          </div>
        </div>

        <Form.Input
          control={form.control}
          name="phoneNumber"
          label="Phone Number"
          placeholder="+1 (555) 000-0000"
          disabled={isPending}
        />
      </div>

      <div className="border-t border-gray-50 pt-8">
        <Button 
          type="submit" 
          disabled={isPending} 
          className="w-full md:w-auto px-12 h-12 bg-black hover:bg-gray-900 text-white rounded-none text-[10px] uppercase tracking-[0.2em] font-bold disabled:opacity-50 transition-all"
        >
          {isPending ? "Saving Changes..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

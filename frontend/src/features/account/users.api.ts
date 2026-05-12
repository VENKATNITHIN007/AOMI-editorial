import { apiClient } from "@/lib/api-client";
import type { User } from "@/lib/types/auth";

export interface UpdateProfilePayload {
  fullName?: string;
  phoneNumber?: string;
}

export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post("/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to upload avatar");
  }
  return response.data.data;
}

export async function updateProfile(payload: UpdateProfilePayload) {
  const response = await apiClient.put("/users/profile", payload);
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to update profile");
  }
  return response.data.data as User;
}

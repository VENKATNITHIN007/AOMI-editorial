import { apiClient } from "@/lib/api-client";
import type { PhotographerProfile, PortfolioItem, PhotographerFullData } from "@/lib/types/photographer";

// ── Types ────────────────────────────────────────────────────────────────────

export interface CreatePhotographerProfilePayload {
  username: string;
  bio?: string;
  location?: string;
  instagram?: string;
  specialties?: string[];
  priceFrom?: number;
}

export interface UpdatePhotographerProfilePayload {
  username?: string;
  bio?: string;
  location?: string;
  instagram?: string;
  heroTagline?: string;
  specialties?: string[];
  priceFrom?: number;
}

export interface UploadPortfolioImagePayload {
  file: File;
  purpose?: string;
  /** Grid slot index (0-4) for gallery images. Auto-assigned if omitted. */
  position?: number;
}

// ── Profile ──────────────────────────────────────────────────────────────────

export async function createPhotographerProfile(payload: CreatePhotographerProfilePayload) {
  const { data } = await apiClient.post("/photographers/create", payload);
  if (!data.success) throw new Error(data.message || "Failed to create profile");
  return data.data as PhotographerProfile;
}

export async function getMyPhotographerProfile() {
  const { data } = await apiClient.get("/photographers/profile");
  if (!data.success) throw new Error(data.message || "Failed to load profile");
  return data.data as PhotographerFullData;
}

export async function updatePhotographerProfile(payload: UpdatePhotographerProfilePayload) {
  const { data } = await apiClient.patch("/photographers/update", payload);
  if (!data.success) throw new Error(data.message || "Failed to update profile");
  return data.data as PhotographerProfile;
}

// ── Portfolio ─────────────────────────────────────────────────────────────────

export async function uploadPortfolioImage({ file, purpose = "gallery", position }: UploadPortfolioImagePayload) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("purpose", purpose);
  if (position !== undefined) formData.append("position", String(position));

  const { data } = await apiClient.post("/portfolio/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (!data.success) throw new Error(data.message || "Failed to upload image");
  return data.data as PortfolioItem;
}

export async function deletePortfolioItems(itemIds: string[]) {
  const { data } = await apiClient.delete("/portfolio", { data: { itemIds } });
  if (!data.success) throw new Error(data.message || "Failed to delete items");
  return data.data;
}

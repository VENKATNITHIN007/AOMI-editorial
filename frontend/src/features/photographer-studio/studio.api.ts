import { apiClient } from "@/lib/api-client";
import type { PhotographerProfile, PortfolioItem, PhotographerFullData } from "@/lib/types/photographer";

// ── Profile APIs ────────────────────────────────────────────────────────

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

export async function createPhotographerProfile(payload: CreatePhotographerProfilePayload) {
  const response = await apiClient.post("/photographers/create", payload);
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to create photographer profile");
  }
  return response.data.data as PhotographerProfile;
}

export async function getMyPhotographerProfile() {
  const response = await apiClient.get("/photographers/profile");
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to load photographer profile");
  }
  return response.data.data as PhotographerFullData;
}

export async function updatePhotographerProfile(payload: UpdatePhotographerProfilePayload) {
  const response = await apiClient.patch("/photographers/update", payload);
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to update photographer profile");
  }
  return response.data.data as PhotographerProfile;
}

// ── Portfolio APIs ──────────────────────────────────────────────────────

export async function uploadAndCreatePortfolioImage(file: File, purpose: string = "gallery") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("purpose", purpose);

  const response = await apiClient.post("/portfolio/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to upload image");
  }
  return response.data.data as PortfolioItem;
}

export async function setPortfolioItemPurpose(itemId: string, purpose: string) {
  const response = await apiClient.patch(`/portfolio/${itemId}/purpose`, { purpose });
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to set portfolio item purpose");
  }
  return response.data.data as PortfolioItem;
}

export async function deletePortfolioItems(itemIds: string[]) {
  const response = await apiClient.delete("/portfolio", {
    data: { itemIds },
  });
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to delete portfolio items");
  }
  return response.data.data;
}

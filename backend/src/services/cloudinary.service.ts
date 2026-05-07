import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";
import appConfig from "../config";

// ── Configuration ──────────────────────────────────────────────────────────

cloudinary.config({
  cloud_name: appConfig.CLOUDINARY_CLOUD_NAME,
  api_key: appConfig.CLOUDINARY_API_KEY,
  api_secret: appConfig.CLOUDINARY_API_SECRET,
});

// ── Constants ──────────────────────────────────────────────────────────────

/**
 * Cloudinary folder prefixes for organized storage.
 * All uploads are namespaced under `photophile/` to keep the media library clean.
 */
export const CLOUDINARY_FOLDERS = {
  AVATARS: "photophile/avatars",
  PORTFOLIO: "photophile/portfolio",
} as const;

export type CloudinaryFolder = (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS];

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Extract the Cloudinary public_id from a secure_url.
 *
 * Example:
 *   Input:  "https://res.cloudinary.com/demo/image/upload/v123/photophile/avatars/abc123.jpg"
 *   Output: "photophile/avatars/abc123"
 *
 * Works by stripping the version segment and file extension from the path
 * that follows `/upload/`.
 */
export function extractPublicId(fileUrl: string): string | null {
  if (!fileUrl) return null;

  try {
    const url = new URL(fileUrl);
    // Path: /demo/image/upload/v123456/photophile/avatars/filename.jpg
    const parts = url.pathname.split("/upload/");
    if (parts.length < 2) return null;

    // Remove the version prefix (v123456/) and file extension
    const afterUpload = parts[1];
    const withoutVersion = afterUpload.replace(/^v\d+\//, "");
    const withoutExtension = withoutVersion.replace(/\.[^.]+$/, "");

    return withoutExtension || null;
  } catch {
    return null;
  }
}

// ── Core Operations ────────────────────────────────────────────────────────

/**
 * Upload a local file to Cloudinary, then clean up the temporary file.
 *
 * @param localFilePath - Absolute path to the file on disk (from multer).
 * @param folder        - Target Cloudinary folder (e.g. `photophile/avatars`).
 * @returns The full Cloudinary response on success, or `null` on failure.
 */
export async function uploadToCloudinary(
  localFilePath: string,
  folder: CloudinaryFolder = CLOUDINARY_FOLDERS.PORTFOLIO,
): Promise<UploadApiResponse | null> {
  if (!localFilePath) return null;

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
      folder,
    });

    return response;
  } catch (error) {
    console.error("[Cloudinary] Upload failed:", error);
    return null;
  } finally {
    // Always clean up the temp file, even on failure
    cleanupTempFile(localFilePath);
  }
}

/**
 * Delete a single asset from Cloudinary by its public URL.
 *
 * @param fileUrl  - The `secure_url` stored in our database.
 * @param fileType - Cloudinary resource type (defaults to `"image"`).
 */
export async function deleteFromCloudinary(
  fileUrl: string,
  fileType: "image" | "raw" | "video" = "image",
): Promise<boolean> {
  const publicId = extractPublicId(fileUrl);
  if (!publicId) {
    console.warn("[Cloudinary] Could not extract public_id from:", fileUrl);
    return false;
  }

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: fileType,
    });
    return true;
  } catch (error) {
    console.error("[Cloudinary] Delete failed for:", publicId, error);
    return false;
  }
}

/**
 * Delete multiple assets from Cloudinary by their public URLs.
 * Runs deletions in parallel for efficiency.
 *
 * @param fileUrls - Array of `secure_url` strings from the database.
 * @returns Number of successfully deleted assets.
 */
export async function deleteMultipleFromCloudinary(
  fileUrls: string[],
): Promise<number> {
  const results = await Promise.allSettled(
    fileUrls.map((url) => deleteFromCloudinary(url)),
  );

  return results.filter(
    (r) => r.status === "fulfilled" && r.value === true,
  ).length;
}

// ── Internal ───────────────────────────────────────────────────────────────

function cleanupTempFile(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // Non-critical — log and move on
    console.warn("[Cloudinary] Failed to clean up temp file:", filePath);
  }
}
import { Request, Response } from "express";
import fs from "fs";
import { asyncHandler } from "../utils/core/asyncHandler";
import ApiResponse from "../utils/core/ApiResponse";
import ApiError from "../utils/core/ApiError";
import {
  uploadToCloudinary,
  CLOUDINARY_FOLDERS,
  type CloudinaryFolder,
} from "../services/cloudinary.service";
import { ERRORS } from "../constants/error";

/**
 * Valid folder values that clients can request.
 * Maps user-facing names → Cloudinary folder paths.
 */
const ALLOWED_FOLDERS: Record<string, CloudinaryFolder> = {
  avatar: CLOUDINARY_FOLDERS.AVATARS,
  portfolio: CLOUDINARY_FOLDERS.PORTFOLIO,
};

/**
 * Upload a single image file to Cloudinary.
 *
 * Expects:
 *   - `file` field via multipart/form-data (handled by multer)
 *   - Optional `folder` query param: "avatar" | "portfolio" (defaults to "portfolio")
 *
 * Returns:
 *   - `{ url: string }` — the Cloudinary secure_url to persist in the database.
 */
export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, ERRORS.AUTH.REQUIRED);
  }

  if (!req.file) {
    throw new ApiError(400, ERRORS.UPLOAD.NO_FILE);
  }

  // Resolve the target Cloudinary folder
  const folderKey = (req.query.folder as string) || "portfolio";
  const folder = ALLOWED_FOLDERS[folderKey];

  if (!folder) {
    throw new ApiError(400, ERRORS.UPLOAD.INVALID_FOLDER);
  }

  try {
    const result = await uploadToCloudinary(req.file.path, folder);

    if (!result) {
      throw new ApiError(500, ERRORS.UPLOAD.FAILED);
    }

    return res.status(200).json(
      new ApiResponse(
        { url: result.secure_url },
        "File uploaded successfully",
      ),
    );
  } finally {
    // ALWAYS delete the local temp file after upload attempt
    if (req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Failed to delete temp file:", err);
      }
    }
  }
});

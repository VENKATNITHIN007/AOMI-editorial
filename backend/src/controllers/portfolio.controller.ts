import { Request, Response } from "express";
import fs from "fs";
import { asyncHandler } from "../utils/core/asyncHandler";
import ApiResponse from "../utils/core/ApiResponse";
import ApiError from "../utils/core/ApiError";
import { Photographer } from "../models/photographer.model";
import { ERRORS } from "../constants/error";
import { Portfolio, IPortfolio } from "../models/portfolio.model";
import {
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
  uploadToCloudinary,
  CLOUDINARY_FOLDERS,
} from "../services/cloudinary.service";

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Resolve the authenticated user's Photographer document.
 * Throws if the user is not authenticated or not a photographer.
 */
async function resolvePhotographer(req: Request) {
  if (!req.user) {
    throw new ApiError(401, ERRORS.AUTH.REQUIRED);
  }

  const photographer = await Photographer.findOne({ userId: req.user._id });

  if (!photographer) {
    throw new ApiError(403, ERRORS.PHOTOGRAPHER.PORTFOLIO_ONLY);
  }

  return photographer;
}

// ── Controllers ────────────────────────────────────────────────────────────

/**
 * Update portfolio item (purpose only).
 */
export const updatePortfolioItem = asyncHandler(
  async (req: Request, res: Response) => {
    const photographer = await resolvePhotographer(req);
    const { itemId } = req.params;
    const { purpose, position } = req.body;

    const portfolioItem = await Portfolio.findOneAndUpdate(
      { _id: itemId, photographerId: photographer._id },
      {
        ...(purpose !== undefined && { purpose }),
        ...(position !== undefined && { position }),
      },
      { new: true },
    );

    if (!portfolioItem) {
      throw new ApiError(404, ERRORS.PORTFOLIO.ITEM_NOT_FOUND);
    }

    return res
      .status(200)
      .json(
        new ApiResponse(portfolioItem, "Portfolio item updated successfully"),
      );
  },
);

/**
 * Upload and create portfolio image (One Trip).
 * - Combined upload to Cloudinary + DB record creation.
 * - Auto-deletes old hero/about/thumbnail if purpose is singular.
 * - Enforces gallery limit (10).
 */
export const uploadAndCreatePortfolioImage = asyncHandler(
  async (req: Request, res: Response) => {
    const photographer = await resolvePhotographer(req);

    if (!req.file) {
      throw new ApiError(400, ERRORS.UPLOAD.NO_FILE);
    }

    const { purpose = "gallery", position: rawPosition } = req.body;

    // 1. Gallery Limit Check (before upload to save bandwidth)
    if (purpose === "gallery") {
      const galleryCount = await Portfolio.countDocuments({
        photographerId: photographer._id,
        purpose: "gallery",
      });
      if (galleryCount >= 10) {
        // Manually cleanup temp file since uploadToCloudinary won't be called
        if (req.file.path && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        throw new ApiError(400, "Gallery limit is 10 images");
      }
    }

    // 2. Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.path, CLOUDINARY_FOLDERS.PORTFOLIO);
    if (!result) {
      throw new ApiError(500, ERRORS.UPLOAD.FAILED);
    }

    // 3. Create the DB record
    let position = 0;
    if (purpose === "gallery") {
      if (rawPosition !== undefined) {
        position = Number(rawPosition);
        // Clean up any existing image in this position
        const existingItem = await Portfolio.findOne({ photographerId: photographer._id, purpose: "gallery", position });
        if (existingItem) {
          await Portfolio.deleteOne({ _id: existingItem._id });
          deleteMultipleFromCloudinary([existingItem.mediaUrl]).catch(err =>
            console.error("[Portfolio] Cloudinary cleanup failed for overwritten slot:", err)
          );
        }
      } else {
        position = await Portfolio.countDocuments({ photographerId: photographer._id, purpose: "gallery" });
      }
    }

    const portfolioItem = await Portfolio.create({
      photographerId: photographer._id,
      mediaUrl: result.secure_url,
      mediaType: "image",
      purpose,
      position
    });

    // 4. Cleanup old singular purpose images (hero/about/thumbnail)
    if (["hero", "about", "thumbnail"].includes(purpose)) {
      const oldItems = await Portfolio.find({
        photographerId: photographer._id,
        purpose,
        _id: { $ne: portfolioItem._id } // exclude the new one
      });

      if (oldItems.length > 0) {
        const oldItemIds = oldItems.map(i => i._id);
        const oldUrls = oldItems.map(i => i.mediaUrl);

        // Delete from DB
        await Portfolio.deleteMany({ _id: { $in: oldItemIds } });

        // Delete from Cloudinary (background)
        deleteMultipleFromCloudinary(oldUrls).catch(err =>
          console.error("[Portfolio] Cloudinary cleanup failed after purpose swap:", err)
        );
      }
    }

    return res
      .status(201)
      .json(
        new ApiResponse(portfolioItem, "Portfolio image uploaded and created successfully"),
      );
  }
);

/**
 * Bulk reorder portfolio items.
 */
export const bulkReorderPortfolio = asyncHandler(
  async (req: Request, res: Response) => {
    const photographer = await resolvePhotographer(req);
    const { items } = req.body; // Array of { id: string, position: number }

    if (!Array.isArray(items)) {
      throw new ApiError(400, "Items must be an array");
    }

    const updatePromises = items.map((item) =>
      Portfolio.updateOne(
        { _id: item.id, photographerId: photographer._id },
        { position: item.position },
      ),
    );

    await Promise.all(updatePromises);

    return res
      .status(200)
      .json(new ApiResponse({}, "Portfolio reordered successfully"));
  },
);

/**
 * Delete portfolio items (Single or Batch).
 */
export const deleteMultiplePortfolioItems = asyncHandler(
  async (req: Request, res: Response) => {
    const photographer = await resolvePhotographer(req);
    const { itemIds } = req.body;

    // Fetch items first to get their media URLs for Cloudinary cleanup
    const itemsToDelete = await Portfolio.find({
      _id: { $in: itemIds },
      photographerId: photographer._id,
    });

    const result = await Portfolio.deleteMany({
      _id: { $in: itemIds },
      photographerId: photographer._id,
    });

    // Fire-and-forget Cloudinary cleanup for all deleted items
    const mediaUrls = itemsToDelete.map((item) => item.mediaUrl);
    if (mediaUrls.length > 0) {
      deleteMultipleFromCloudinary(mediaUrls).catch((err) =>
        console.error("[Portfolio] Batch Cloudinary cleanup failed:", err),
      );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          { deletedCount: result.deletedCount },
          `${result.deletedCount} portfolio items deleted`,
        ),
      );
  },
);

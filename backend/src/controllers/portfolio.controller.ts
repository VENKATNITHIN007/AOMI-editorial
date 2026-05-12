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
 * Add single portfolio item.
 */
export const addPortfolioItem = asyncHandler(
  async (req: Request, res: Response) => {
    const photographer = await resolvePhotographer(req);
    const { mediaUrl, mediaType, category, isFeatured } = req.body;

    const portfolioItem = await Portfolio.create({
      photographerId: photographer._id,
      mediaUrl,
      mediaType,
      category,
      isFeatured: isFeatured || false,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(portfolioItem, "Portfolio item added successfully"),
      );
  },
);

/**
 * Add multiple portfolio items (batch upload).
 */
export const addMultiplePortfolioItems = asyncHandler(
  async (req: Request, res: Response) => {
    const photographer = await resolvePhotographer(req);
    const { items } = req.body;

    const portfolioItems = items.map((item: IPortfolio) => ({
      photographerId: photographer._id,
      mediaUrl: item.mediaUrl,
      mediaType: item.mediaType,
      category: item.category,
      isFeatured: item.isFeatured || false,
    }));

    const createdItems = await Portfolio.insertMany(portfolioItems);

    return res
      .status(201)
      .json(
        new ApiResponse(
          createdItems,
          `${createdItems.length} portfolio items added successfully`,
        ),
      );
  },
);

/**
 * Get own portfolio (authenticated photographer).
 */
export const getMyPortfolio = asyncHandler(
  async (req: Request, res: Response) => {
    const photographer = await resolvePhotographer(req);

    const portfolio = await Portfolio.find({
      photographerId: photographer._id,
    }).sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(portfolio, "Portfolio fetched successfully"));
  },
);

/**
 * Get portfolio by photographer username (public).
 */
export const getPortfolioByUsername = asyncHandler(
  async (req: Request, res: Response) => {
    const { username } = req.params;

    const photographer = await Photographer.findOne({
      username: username.toLowerCase(),
    });

    if (!photographer) {
      throw new ApiError(404, ERRORS.PHOTOGRAPHER.NOT_FOUND);
    }

    const portfolio = await Portfolio.find({
      photographerId: photographer._id,
    }).sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(portfolio, "Portfolio fetched successfully"));
  },
);

/**
 * Update portfolio item (purpose only).
 */
export const updatePortfolioItem = asyncHandler(
  async (req: Request, res: Response) => {
    const photographer = await resolvePhotographer(req);
    const { itemId } = req.params;
    const { purpose } = req.body;

    const portfolioItem = await Portfolio.findOneAndUpdate(
      { _id: itemId, photographerId: photographer._id },
      { 
        ...(purpose !== undefined && { purpose }), 
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

    const { purpose = "gallery" } = req.body;

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
    const portfolioItem = await Portfolio.create({
      photographerId: photographer._id,
      mediaUrl: result.secure_url,
      mediaType: "image",
      purpose,
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
 * Delete single portfolio item.
 * Also removes the associated file from Cloudinary.
 */
export const deletePortfolioItem = asyncHandler(
  async (req: Request, res: Response) => {
    const photographer = await resolvePhotographer(req);
    const { itemId } = req.params;

    const portfolioItem = await Portfolio.findOneAndDelete({
      _id: itemId,
      photographerId: photographer._id,
    });

    if (!portfolioItem) {
      throw new ApiError(404, ERRORS.PORTFOLIO.ITEM_NOT_FOUND);
    }

    // Fire-and-forget Cloudinary cleanup (don't block the response)
    deleteFromCloudinary(portfolioItem.mediaUrl).catch((err) =>
      console.error("[Portfolio] Cloudinary cleanup failed:", err),
    );

    return res
      .status(200)
      .json(new ApiResponse({}, "Portfolio item deleted successfully"));
  },
);

/**
 * Delete multiple portfolio items.
 * Also removes the associated files from Cloudinary.
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

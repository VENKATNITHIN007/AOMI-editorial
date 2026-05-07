import { Request, Response } from "express";
import { asyncHandler } from "../utils/core/asyncHandler";
import ApiResponse from "../utils/core/ApiResponse";
import ApiError from "../utils/core/ApiError";
import { Photographer } from "../models/photographer.model";
import { ERRORS } from "../constants/error";
import { Portfolio, IPortfolio } from "../models/portfolio.model";
import {
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
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
    const { mediaUrl, mediaType, category } = req.body;

    const portfolioItem = await Portfolio.create({
      photographerId: photographer._id,
      mediaUrl,
      mediaType,
      category,
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
 * Update portfolio item (category only).
 */
export const updatePortfolioItem = asyncHandler(
  async (req: Request, res: Response) => {
    const photographer = await resolvePhotographer(req);
    const { itemId } = req.params;
    const { category } = req.body;

    const portfolioItem = await Portfolio.findOneAndUpdate(
      { _id: itemId, photographerId: photographer._id },
      { category },
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

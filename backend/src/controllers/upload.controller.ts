import { Request, Response } from "express";
import { asyncHandler } from "../utils/core/asyncHandler";
import ApiResponse from "../utils/core/ApiResponse";
import ApiError from "../utils/core/ApiError";
import { uploadToCloudinary } from "../services/cloudinary.service";

export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, "No file provided");
  }

  const fileUrl = await uploadToCloudinary(req.file.path);
  
  if (!fileUrl) {
    throw new ApiError(500, "Failed to upload file to Cloudinary");
  }

  return res.status(200).json(
    new ApiResponse({ url: fileUrl }, "File uploaded successfully")
  );
});

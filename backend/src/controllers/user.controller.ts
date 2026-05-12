import { Request, Response } from "express";
import { ERRORS } from "../constants/error";
import { userService } from "../services/user.service";
import ApiError from "../utils/core/ApiError";
import ApiResponse from "../utils/core/ApiResponse";
import { asyncHandler } from "../utils/core/asyncHandler";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  CLOUDINARY_FOLDERS,
} from "../services/cloudinary.service";
import User from "../models/user.model";

export const currentUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, ERRORS.AUTH.REQUIRED);
  }

  return res
    .status(200)
    .json(new ApiResponse(req.user, "Fetched current user details"));
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, ERRORS.AUTH.REQUIRED);
  }

  const updatedUser = await userService.updateProfile(req.user._id!, req.body);

  return res
    .status(200)
    .json(new ApiResponse({ data: updatedUser }, "Profile updated successfully"));
});

export const updateAvatar = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(401, ERRORS.AUTH.REQUIRED);
  }

  if (!req.file) {
    throw new ApiError(400, ERRORS.UPLOAD.NO_FILE);
  }

  // 1. Upload new avatar
  const result = await uploadToCloudinary(req.file.path, CLOUDINARY_FOLDERS.AVATARS);
  if (!result) {
    throw new ApiError(500, ERRORS.UPLOAD.FAILED);
  }

  // 2. Update user and get the old avatar URL
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, ERRORS.AUTH.USER_NOT_FOUND);
  }

  const oldAvatarUrl = user.avatar;
  user.avatar = result.secure_url;
  await user.save();

  // 3. Cleanup old avatar from Cloudinary (if it exists)
  if (oldAvatarUrl) {
    deleteFromCloudinary(oldAvatarUrl).catch((err) =>
      console.error("[User] Old avatar cleanup failed:", err),
    );
  }

  return res.status(200).json(
    new ApiResponse(
      { avatar: result.secure_url },
      "Avatar updated successfully",
    ),
  );
});

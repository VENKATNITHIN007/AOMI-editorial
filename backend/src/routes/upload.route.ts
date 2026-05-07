import { Router } from "express";
import { uploadImage } from "../controllers/upload.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { imageUpload } from "../middlewares/multer.middleware";

const uploadRouter = Router();

/**
 * POST /api/v1/upload?folder=avatar|portfolio
 *
 * Authenticated endpoint for uploading a single image to Cloudinary.
 * The `folder` query param controls where the image is stored.
 * Expects a `file` field in multipart/form-data.
 */
uploadRouter.post(
  "/",
  authMiddleware,
  imageUpload.single("file"),
  uploadImage,
);

export default uploadRouter;

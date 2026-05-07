import multer, { FileFilterCallback } from "multer";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { Request } from "express";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "../constants/upload";

// ── Constants ──────────────────────────────────────────────────────────────

const TEMP_DIR = "./public/temp";

// ── Storage Configuration ──────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }
    cb(null, TEMP_DIR);
  },

  filename: (_req, file, cb) => {
    // Generate a unique filename to prevent collisions:
    // <timestamp>-<random>.<original_extension>
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// ── File Filter ────────────────────────────────────────────────────────────

/**
 * Accept only image types defined in upload constants.
 * Rejects non-image files with a descriptive error message.
 */
const imageFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  if (ACCEPTED_IMAGE_TYPES.some((type) => type === file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Accepted types: ${ACCEPTED_IMAGE_TYPES.join(", ")}`));
  }
};

// ── Multer Instances ───────────────────────────────────────────────────────

/**
 * Image-only upload middleware.
 * - Filters: JPEG, PNG, WebP
 * - Max size: defined in upload constants
 */
export const imageUpload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

/**
 * Generic upload middleware (no file type filter).
 * Use only when you explicitly need to accept all file types.
 */
export const upload = multer({ storage });
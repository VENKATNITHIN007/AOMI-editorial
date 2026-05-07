/**
 * UPLOAD CONSTANTS
 *
 * Centralized configuration for all file upload constraints.
 * Referenced by multer middleware, Zod validations, and controllers.
 */

/** Maximum file size in bytes (10 MB). */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Accepted image MIME types. */
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

/** Human-readable label for accepted image formats (for error messages). */
export const ACCEPTED_IMAGE_EXTENSIONS = "JPG, PNG, WebP";
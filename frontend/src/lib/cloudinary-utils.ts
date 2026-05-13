/**
 * Cloudinary URL Transformation Utilities.
 * Leverages Cloudinary's on-the-fly image processing for optimal performance and cropping.
 */

type ImagePurpose = "thumbnail" | "hero" | "portrait" | "gallery" | "avatar" | "lightbox";

interface CloudinaryOptions {
  width?: number;
  height?: number;
  crop?: string;
  gravity?: string;
  quality?: string;
  format?: string;
}

const DEFAULTS: Record<ImagePurpose, CloudinaryOptions> = {
  thumbnail: { width: 800, height: 1000, crop: "fill", gravity: "auto", quality: "auto", format: "webp" },
  hero: { width: 1920, height: 1080, crop: "fill", gravity: "auto", quality: "auto", format: "webp" },
  portrait: { width: 800, height: 1000, crop: "fill", gravity: "auto", quality: "auto", format: "webp" },
  gallery: { width: 1200, height: 1200, crop: "fill", gravity: "auto", quality: "auto", format: "webp" },
  avatar: { width: 200, height: 200, crop: "fill", gravity: "face", quality: "auto", format: "webp" },
  lightbox: { width: 2000, height: 2000, crop: "limit", quality: "auto", format: "webp" },
};

/**
 * Transforms a raw Cloudinary URL into an optimized version for a specific purpose.
 * Example: Transforms .../upload/v123/img.jpg -> .../upload/c_fill,g_auto,w_600,h_750,q_auto,f_webp/v123/img.jpg
 */
export function getOptimizedImageUrl(url: string | null | undefined, purpose: ImagePurpose): string {
  if (!url) return "";
  if (!url.includes("cloudinary.com")) return url;

  const options = DEFAULTS[purpose];
  const transformation = [
    `c_${options.crop}`,
    options.gravity ? `g_${options.gravity}` : "",
    `w_${options.width}`,
    options.height ? `h_${options.height}` : "",
    `q_${options.quality}`,
    `f_${options.format}`,
  ]
    .filter(Boolean)
    .join(",");

  // Cloudinary URLs typically look like: https://res.cloudinary.com/cloud_name/image/upload/v1234567/public_id.jpg
  // We insert our transformations after /upload/
  return url.replace("/upload/", `/upload/${transformation}/`);
}

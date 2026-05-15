import * as z from "zod";

export const photographerOnboardingSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username cannot exceed 30 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" })
    .transform((val) => val.toLowerCase()),
  location: z.string().min(1, { message: "Please select a location" }),
  specialties: z
    .array(z.string())
    .min(1, { message: "Please select at least one specialty" })
    .max(3, { message: "You can select up to 3 specialties" }),
  priceFrom: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!Number.isNaN(Number(val)) && Number(val) > 0),
      { message: "Price must be a positive number" },
    ),
  bio: z
    .string()
    .max(500, "Bio cannot exceed 500 characters")
    .optional(),
  instagram: z
    .string()
    .optional()
    .transform(val => {
      if (!val) return val;
      // Handle links: https://www.instagram.com/username/ -> username
      // Handle @: @username -> username
      const cleaned = val.trim()
        .replace(/^(https?:\/\/)?(www\.)?instagram\.com\//i, "") // Remove URL prefix
        .replace(/\/.*$/, "") // Remove trailing slashes or queries
        .replace(/^@/, ""); // Remove @
      return cleaned;
    }),
});

export type PhotographerOnboardingInput = z.infer<typeof photographerOnboardingSchema>;

export const studioProfileUpdateSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .transform((val) => val.toLowerCase()),
  location: z.string().min(1, "Please select a location"),
  specialties: z
    .array(z.string())
    .min(1, "Please select at least one specialty")
    .max(3, "You can select up to 3 specialties"),
  priceFrom: z.coerce.number().min(0, "Price must be a positive number"),
  instagram: z
    .string()
    .optional()
    .transform(val => {
      if (!val) return val;
      const cleaned = val.trim()
        .replace(/^(https?:\/\/)?(www\.)?instagram\.com\//i, "")
        .replace(/\/.*$/, "")
        .replace(/^@/, "");
      return cleaned;
    }),
});

export type StudioProfileUpdateInput = z.infer<typeof studioProfileUpdateSchema>;
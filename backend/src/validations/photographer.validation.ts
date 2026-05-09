import { z } from "zod";

export const CreatePhotographerProfileSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
      invalid_type_error: "Username must be a string",
    })
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(
      /^[a-z0-9_]+$/,
      "Username can only contain lowercase letters, numbers, and underscores",
    )
    .transform((val) => val.toLowerCase()),
  bio: z.string().optional(),
  location: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  priceFrom: z
    .number({
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be positive")
    .optional(),
  instagram: z.string().optional(),
  heroTagline: z.string().optional(),
  heroImageId: z.string().optional(),
  aboutImageId: z.string().optional(),
});

export const UpdatePhotographerProfileSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .regex(
        /^[a-z0-9_]+$/,
        "Username can only contain lowercase letters, numbers, and underscores",
      )
      .optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    specialties: z.array(z.string()).optional(),
    priceFrom: z
      .number({
        invalid_type_error: "Price must be a number",
      })
      .positive("Price must be positive")
      .optional(),
    instagram: z.string().optional(),
    heroTagline: z.string().optional(),
    heroImageId: z.string().optional(),
    aboutImageId: z.string().optional(),
  })
  .strict();

export type CreatePhotographerProfileType = z.infer<
  typeof CreatePhotographerProfileSchema
>;
export type UpdatePhotographerProfileType = z.infer<
  typeof UpdatePhotographerProfileSchema
>;

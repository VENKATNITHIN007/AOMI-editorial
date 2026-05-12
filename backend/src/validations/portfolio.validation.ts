import { z } from "zod";

export const SetPortfolioItemPurposeSchema = z.object({
  purpose: z.enum(["gallery", "hero", "about", "thumbnail"]),
});

export const UploadPortfolioImageSchema = z.object({
  purpose: z.enum(["gallery", "hero", "about", "thumbnail"]).default("gallery"),
});

export const DeletePortfolioItemsSchema = z.object({
  itemIds: z
    .array(
      z.string({
        invalid_type_error: "Item ID must be a string",
      }),
    )
    .min(1, "At least one item ID is required"),
});

export type DeletePortfolioItemsType = z.infer<
  typeof DeletePortfolioItemsSchema
>;

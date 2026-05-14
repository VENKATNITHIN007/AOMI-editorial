import mongoose, { Schema, model, models } from "mongoose";

export interface IPortfolio {
  _id?: mongoose.Types.ObjectId;
  photographerId: mongoose.Types.ObjectId;
  mediaUrl: string;
  mediaType: "image" | "video";
  purpose: "gallery" | "hero" | "about" | "thumbnail";
  position?: number;
  createdAt?: Date;
}

const portfolioSchema = new Schema<IPortfolio>(
  {
    photographerId: {
      type: Schema.Types.ObjectId,
      ref: "Photographer",
      required: true,
      index: true,
    },
    mediaUrl: { type: String, required: true },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
      index: true,
    },
    purpose: {
      type: String,
      enum: ["gallery", "hero", "about", "thumbnail"],
      default: "gallery",
      index: true,
    },
    position: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  { timestamps: true },
);

// Index for resolving section images fast and fetching gallery
portfolioSchema.index({ photographerId: 1, purpose: 1 });
portfolioSchema.index({ photographerId: 1, createdAt: -1 });

export const Portfolio = mongoose.model<IPortfolio>(
  "Portfolio",
  portfolioSchema,
);

export default Portfolio;

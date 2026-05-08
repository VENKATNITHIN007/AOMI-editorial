import { Router } from "express";
import {
  createPhotographerProfile,
  getPhotographerProfileByUserId,
  getPhotographerProfileByUsername,
  updatePhotographerProfile,
  browsePhotographers,
} from "../controllers/photographer.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import {
  CreatePhotographerProfileSchema,
  UpdatePhotographerProfileSchema,
} from "../validations/photographer.validation";

const photographerRouter = Router();

// Public routes
photographerRouter.get("/browse", browsePhotographers); // Browse/search photographers

// Protected routes (authentication required)
photographerRouter.post(
  "/create",
  authMiddleware,
  validateRequest(CreatePhotographerProfileSchema),
  createPhotographerProfile,
);

photographerRouter.get(
  "/profile",
  authMiddleware,
  getPhotographerProfileByUserId,
);

photographerRouter.patch(
  "/update",
  authMiddleware,
  validateRequest(UpdatePhotographerProfileSchema),
  updatePhotographerProfile,
);

// This MUST be last because /:username acts as a catch-all for this path level
photographerRouter.get("/:username", getPhotographerProfileByUsername);

export default photographerRouter;

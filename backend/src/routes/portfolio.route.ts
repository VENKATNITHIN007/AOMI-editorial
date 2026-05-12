import { Router } from "express";
import {
  addPortfolioItem,
  addMultiplePortfolioItems,
  getMyPortfolio,
  getPortfolioByUsername,
  updatePortfolioItem,
  deletePortfolioItem,
  deleteMultiplePortfolioItems,
  uploadAndCreatePortfolioImage,
} from "../controllers/portfolio.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { imageUpload } from "../middlewares/multer.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import {
  AddPortfolioItemSchema,
  AddMultiplePortfolioItemsSchema,
  UpdatePortfolioItemSchema,
  DeletePortfolioItemsSchema,
  UploadPortfolioImageSchema,
} from "../validations/portfolio.validation";

const portfolioRouter = Router();

// Public route - Get portfolio by photographer username
portfolioRouter.get("/:username", getPortfolioByUsername);

// Protected routes (authentication required)
portfolioRouter
  .use(authMiddleware)
  .get("/", getMyPortfolio)
  .post(
    "/upload",
    imageUpload.single("file"),
    validateRequest(UploadPortfolioImageSchema),
    uploadAndCreatePortfolioImage,
  )
  .post("/add", validateRequest(AddPortfolioItemSchema), addPortfolioItem)
  .post(
    "/add-multiple",
    validateRequest(AddMultiplePortfolioItemsSchema),
    addMultiplePortfolioItems,
  )
  .patch(
    "/:itemId",
    validateRequest(UpdatePortfolioItemSchema),
    updatePortfolioItem,
  )
  .delete("/:itemId", deletePortfolioItem)
  .delete(
    "/",
    validateRequest(DeletePortfolioItemsSchema),
    deleteMultiplePortfolioItems,
  );

export default portfolioRouter;

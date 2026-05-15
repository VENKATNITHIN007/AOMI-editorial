import { Router } from "express";
import {
  updatePortfolioItem,
  deleteMultiplePortfolioItems,
  uploadAndCreatePortfolioImage,
  bulkReorderPortfolio,
} from "../controllers/portfolio.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { imageUpload } from "../middlewares/multer.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import {
  SetPortfolioItemPurposeSchema,
  DeletePortfolioItemsSchema,
  UploadPortfolioImageSchema,
} from "../validations/portfolio.validation";

const portfolioRouter = Router();

portfolioRouter
  .use(authMiddleware)
  .post(
    "/upload",
    imageUpload.single("file"),
    validateRequest(UploadPortfolioImageSchema),
    uploadAndCreatePortfolioImage,
  )
  .patch(
    "/:itemId/purpose",
    validateRequest(SetPortfolioItemPurposeSchema),
    updatePortfolioItem,
  )
  .post(
    "/reorder",
    bulkReorderPortfolio,
  )
  .delete(
    "/",
    validateRequest(DeletePortfolioItemsSchema),
    deleteMultiplePortfolioItems,
  );

export default portfolioRouter;

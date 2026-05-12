import { Router } from "express";
import {
  currentUser,
  updateProfile,
  updateAvatar,
} from "../controllers/user.controller";
import { imageUpload } from "../middlewares/multer.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { UpdateProfileSchema } from "../validations/auth.validation";
import { authMiddleware, authMiddlewareAllowUnverified } from "../middlewares/auth.middleware";

const userRouter = Router();

userRouter.get("/me", authMiddlewareAllowUnverified, currentUser);

userRouter
  .use(authMiddleware)
  .put("/profile", validateRequest(UpdateProfileSchema), updateProfile)
  .post("/avatar", imageUpload.single("file"), updateAvatar);

export default userRouter;

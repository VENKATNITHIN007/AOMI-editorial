import { Router } from "express";
import { uploadFile } from "../controllers/upload.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const uploadRouter = Router();

uploadRouter.use(authMiddleware);
uploadRouter.post("/", upload.single("file"), uploadFile);

export default uploadRouter;

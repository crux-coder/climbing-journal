import * as express from "express";
import {
  create,
  getAll,
  getById,
  update,
  uploadImages,
} from "./climbingroute.controller";
import { validateParamsId } from "src/middleware/validate.params.id";
import { authMiddleware } from "src/middleware/auth.middleware";
import multerUpload from "src/config/multer";

const router = express.Router();

router.post("/", authMiddleware, create);
router.get("/", getAll);
router.get("/:id", validateParamsId, getById);
router.put("/:id", authMiddleware, validateParamsId, update);
router.put(
  "/:id/upload-images",
  authMiddleware,
  validateParamsId,
  multerUpload.array("files"),
  uploadImages,
);

export default router;

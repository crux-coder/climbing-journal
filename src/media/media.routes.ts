import * as express from "express";
import { remove } from "./media.controller";
import { validateParamsId } from "src/middleware/validate.params.id";
import { authMiddleware } from "src/middleware/auth.middleware";

const router = express.Router();

router.delete("/:id", authMiddleware, validateParamsId, remove);

export default router;

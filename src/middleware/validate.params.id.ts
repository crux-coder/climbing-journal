import { Request, Response, NextFunction } from "express";
import { AppError } from "src/common/app.error";

export const validateParamsId = (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  if (!id || typeof id !== "string" || !id.trim()) {
    return next(
      new AppError(
        "ID is required and must be a string",
        400,
        "ID_REQUIRED",
        "ID is required and must be a string",
      ),
    );
  }

  next();
};

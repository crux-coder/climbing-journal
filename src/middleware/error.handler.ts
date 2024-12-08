import { NextFunction, Request, Response } from "express";
import { AppError } from "src/common/app.error";
import { ZodError } from "zod";

export type RestError = {
  success: boolean;
  error: {
    message: string;
    code: string;
    timestamp: string;
    // TODO: Standardize details since we are using zod
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: any[];
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorHandler = (
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction,
) => {
  console.error(err.stack);

  if (err instanceof AppError) {
    const status = err.status;
    const message = err.clientMessage;
    const code = err.code;

    res.status(status).json({
      success: false,
      error: {
        message,
        code,
        timestamp: new Date().toISOString(),
      },
    });
  } else if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        message: "Validation failed. Please check the details.",
        code: "VALIDATION_ERROR",
        timestamp: new Date().toISOString(),
        details: err.errors,
      },
    });
  } else {
    res.status(500).json({
      success: false,
      error: {
        message: "Internal Server Error",
        code: "INTERNAL_SERVER_ERROR",
        timestamp: new Date().toISOString(),
      },
    });
  }
};

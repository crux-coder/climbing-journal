import { NextFunction, Request, Response } from "express";
import { AppError } from "src/common/app.error";
import { getAuthenticatedSupabaseClient } from "src/config/supabase";
import MediaModel from "src/media/media.model";

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const supabase = getAuthenticatedSupabaseClient(req.auth.token);
    const mediaId: string = req.params.id as string;

    const media: string | null = await MediaModel.getById(supabase, mediaId);

    if (!media) {
      return next(
        new AppError(
          "Media not found",
          404,
          "NOT_FOUND",
          "Media not found with the provided ID.",
        ),
      );
    }

    await MediaModel.remove(supabase, mediaId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

import { NextFunction, Request, Response } from "express";
import { AppError } from "src/common/app.error";
import { getAuthenticatedSupabaseClient } from "src/config/supabase";
import ClimbingpitchModel, {
  ClimbingPitch,
} from "src/climbingpitch/climbingpitch.model";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const supabase = getAuthenticatedSupabaseClient(req.auth.token);
    const body = req.body as ClimbingPitch;
    const climbingpitch: ClimbingPitch = await ClimbingpitchModel.create(
      supabase,
      body,
    );

    res.status(201).json(climbingpitch);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const supabase = getAuthenticatedSupabaseClient(req.auth.token);
    const climbingpitchs: ClimbingPitch[] =
      await ClimbingpitchModel.getAll(supabase);

    res.status(200).json(climbingpitchs);
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const supabase = getAuthenticatedSupabaseClient(req.auth.token);
    // Middleware already validated the ID, if we reach this point, we can safely assume that the ID is a string
    const climbingpitchId: string = req.params.id as string;

    const climbingpitch: ClimbingPitch | null =
      await ClimbingpitchModel.getById(supabase, climbingpitchId);

    if (!climbingpitch) {
      next(
        new AppError(
          "Climbingpitch not found",
          404,
          "NOT_FOUND",
          "Climbingpitch not found with the provided ID.",
        ),
      );
    }

    res.status(200).json(climbingpitch);
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const supabase = getAuthenticatedSupabaseClient(req.auth.token);
    // Middleware already validated the ID, if we reach this point, we can safely assume that the ID is a string
    const climbingpitchId: string = req.params.id as string;
    const climbingpitch: ClimbingPitch = await ClimbingpitchModel.update(
      supabase,
      climbingpitchId,
      req.body,
    );

    res.status(200).json(climbingpitch);
  } catch (error) {
    next(error);
  }
};

import { NextFunction, Request, Response } from "express";
import { AppError } from "src/common/app.error";
import ClimbingrouteModel, {
  ClimbingRoute,
} from "src/climbingroute/climbingroute.model";
import {
  getAnonSupabaseClient,
  getAuthenticatedSupabaseClient,
} from "src/config/supabase";
import { z } from "zod";
import {
  BOULDER_CLIMBING_GRADES,
  CLIMBING_TYPES,
  MUTLI_PITCH_CLIMBING_GRADES,
  SPORT_CLIMBING_GRADES,
  TRAD_CLIMBING_GRADES,
} from "src/common/constants";
import climbingpitchModel from "src/climbingpitch/climbingpitch.model";
import MediaModel from "src/media/media.model";

const ClimbingRouteTypeEnum = z.enum(CLIMBING_TYPES);
const SportClimbingGradesEnum = z.enum(SPORT_CLIMBING_GRADES);
const TradClimbingGradesEnum = z.enum(TRAD_CLIMBING_GRADES);
const BoulderClimbingGradesEnum = z.enum(BOULDER_CLIMBING_GRADES);
const MultiPitchClimbingGradesEnum = z.enum(MUTLI_PITCH_CLIMBING_GRADES);

const ClimbingRouteCreateRequest = z
  .object({
    name: z.string(),
    grade: z.string(),
    type: ClimbingRouteTypeEnum,
    length: z.number().positive().optional(),
    description: z.string().optional(),
    approach: z.string().optional(),
    pitches: z
      .array(
        z.object({
          pitch_order: z.number().nonnegative(),
          grade: z.string().optional(),
          length: z.number().optional(),
          description: z.string(),
        }),
      )
      .optional()
      .refine((pitches) => {
        if (pitches) {
          // Check if pitch_order is sequential starting from 0
          return pitches.every((pitch, index) => {
            return pitch.pitch_order === index;
          });
        }
        return true;
      }, "Pitches must have sequential pitch_order starting from 0."),
  })
  .strict()
  .refine(
    (data) => {
      const { type, grade } = data;
      switch (type) {
        case "BOULDER":
          return BoulderClimbingGradesEnum.safeParse(grade).success;
        case "SPORT":
          return SportClimbingGradesEnum.safeParse(grade).success;
        case "TRAD":
          return TradClimbingGradesEnum.safeParse(grade).success;
        case "MULTI_PITCH":
          return MultiPitchClimbingGradesEnum.safeParse(grade).success;
        default:
          return false;
      }
    },
    { message: "Invalid climbing route grade for the type.", path: ["grade"] },
  );

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let climbingRoute: ClimbingRoute | null = null;
  try {
    ClimbingRouteCreateRequest.parse(req.body);
    const body = req.body as ClimbingRoute;
    const { pitches, ...climbingRouteData } = body;
    const supabase = getAuthenticatedSupabaseClient(req.auth.token);
    climbingRoute = await ClimbingrouteModel.create(
      supabase,
      climbingRouteData,
    );

    if (body.pitches) {
      const climbingPitches = await climbingpitchModel.createMany(
        supabase,
        body.pitches.map((pitch) => {
          return {
            ...pitch,
            // TODO: Check later.. but... At this point, we can safely assume that climbingRoute is not null
            climbing_route_id: climbingRoute!.id,
          };
        }),
      );

      res.status(201).json({ ...climbingRoute, pitches: climbingPitches });
    } else {
      res.status(201).json(climbingRoute);
    }
  } catch (error) {
    const supabase = getAuthenticatedSupabaseClient(req.auth.token);
    if (climbingRoute) {
      await ClimbingrouteModel.deleteById(supabase, climbingRoute.id);
    }
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    ClimbingRouteCreateRequest.parse(req.body);
    const body = req.body as ClimbingRoute;
    const supabase = getAuthenticatedSupabaseClient(req.auth.token);

    // Middleware already validated the ID, if we reach this point, we can safely assume that the ID is a string
    const climbingRouteId: string = req.params.id as string;
    const climbingRoute: ClimbingRoute = await ClimbingrouteModel.update(
      supabase,
      { ...body, id: climbingRouteId },
    );

    if (body.pitches) {
      const climbingPitches = await climbingpitchModel.updateMany(
        supabase,
        body.pitches,
      );

      res.status(200).json({ ...climbingRoute, pitches: climbingPitches });
    } else {
      res.status(200).json(climbingRoute);
    }
  } catch (error) {
    next(error);
  }
};

export const uploadImages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const supabase = getAuthenticatedSupabaseClient(req.auth.token);
    const files = req.files as Express.Multer.File[];
    // Middleware already validated the ID, if we reach this point, we can safely assume that the ID is a string
    const climbingRouteId: string = req.params.id as string;

    const climbingRoute = await ClimbingrouteModel.getById(
      supabase,
      climbingRouteId,
    );

    if (!climbingRoute) {
      throw new AppError(
        "Climbing route not found",
        404,
        "NOT_FOUND",
        "Climbing route not found with the provided ID.",
      );
    }

    const media: string[] = await MediaModel.createMany(
      supabase,
      files,
      climbingRouteId, // Bucket
    );

    res.status(201).json(media);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (_: Request, res: Response, next: NextFunction) => {
  const supabase = getAnonSupabaseClient();

  try {
    const users: ClimbingRoute[] = await ClimbingrouteModel.getAll(supabase);

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const supabase = getAnonSupabaseClient();

  try {
    // Middleware already validated the ID, if we reach this point, we can safely assume that the ID is a string
    const climbingRouteId: string = req.params.id as string;

    const climbingRoute: ClimbingRoute | null =
      await ClimbingrouteModel.getById(supabase, climbingRouteId);

    if (!climbingRoute) {
      next(
        new AppError(
          "ClimbingRoute not found.",
          404,
          "USER_NOT_FOUND",
          "Climbing route not found with the provided ID.",
        ),
      );
    }

    res.status(200).json(climbingRoute);
  } catch (error) {
    next(error);
  }
};

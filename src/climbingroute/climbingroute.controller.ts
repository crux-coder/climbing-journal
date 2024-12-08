import { NextFunction, Request, Response } from 'express';
import { AppError } from 'src/common/app.error';
import ClimbingrouteModel, { ClimbingRoute } from 'src/climbingroute/climbingroute.model';
import { getAnonSupabaseClient, getAuthenticatedSupabaseClient } from 'src/config/supabase';
import { z } from "zod";

const ClimbingRouteCreateRequest = z.object({
    name: z.string(),
    grade: z.string().optional(),
    type: z.string().optional(),
    length: z.number().optional(),
}).strict();

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ClimbingRouteCreateRequest.parse(req.body);
        const body = req.body as ClimbingRoute;
        const supabase = getAuthenticatedSupabaseClient(req.auth.token);

        const user: ClimbingRoute = await ClimbingrouteModel.create(supabase, body);

        res.status(201).json(user);
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

export const getById = async (req: Request, res: Response, next: NextFunction) => {
    const supabase = getAnonSupabaseClient();

    try {
        // Middleware already validated the ID, if we reach this point, we can safely assume that the ID is a string
        const climbingRouteId: string = req.params.id as string;

        const climbingRoute: ClimbingRoute | null = await ClimbingrouteModel.getById(supabase, climbingRouteId);

        if (!climbingRoute) {
            next(new AppError('ClimbingRoute not found.', 404, 'USER_NOT_FOUND', 'Climbing route not found with the provided ID.'));
        }

        res.status(200).json(climbingRoute);
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ClimbingRouteCreateRequest.parse(req.body);
        const body = req.body as ClimbingRoute;
        const supabase = getAuthenticatedSupabaseClient(req.auth.token);

        // Middleware already validated the ID, if we reach this point, we can safely assume that the ID is a string
        const climbingRouteId: string = req.params.id as string;
        const climbingRoute: ClimbingRoute = await ClimbingrouteModel.update(supabase, climbingRouteId, body);

        res.status(200).json(climbingRoute);
    } catch (error) {
        next(error);
    }
};

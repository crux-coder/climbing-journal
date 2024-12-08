import { NextFunction, Request, Response } from "express";
import { AppError } from "src/common/app.error";
import { getAuthenticatedSupabaseClient } from "src/config/supabase";
import UseModel, { User } from "src/users/users.model";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const supabase = getAuthenticatedSupabaseClient(req.auth.token);

  try {
    const user: User = await UseModel.createUser(supabase, req.body);

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const supabase = getAuthenticatedSupabaseClient(req.auth.token);

  try {
    const users: User[] = await UseModel.getUsers(supabase);

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
  const supabase = getAuthenticatedSupabaseClient(req.auth.token);

  try {
    // Middleware already validated the ID, if we reach this point, we can safely assume that the ID is a string
    const userId: string = req.params.id as string;

    const user: User | null = await UseModel.getUserById(supabase, userId);

    if (!user) {
      next(
        new AppError(
          "User not found",
          404,
          "USER_NOT_FOUND",
          "User not found with the provided ID.",
        ),
      );
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const supabase = getAuthenticatedSupabaseClient(req.auth.token);

  try {
    // Middleware already validated the ID, if we reach this point, we can safely assume that the ID is a string
    const userId: string = req.params.id as string;
    const user: User = await UseModel.updateUser(supabase, userId, req.body);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

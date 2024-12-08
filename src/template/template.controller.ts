import { NextFunction, Request, Response } from "express";
import { AppError } from "src/common/app.error";
import { getAuthenticatedSupabaseClient } from "src/config/supabase";
import TemplateModel, { Template } from "src/template/template.model";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const supabase = getAuthenticatedSupabaseClient(req.auth.token);
    const template: Template = await TemplateModel.create(supabase, req.body);

    res.status(201).json(template);
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
    const templates: Template[] = await TemplateModel.getAll(supabase);

    res.status(200).json(templates);
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
    const templateId: string = req.params.id as string;

    const template: Template | null = await TemplateModel.getById(
      supabase,
      templateId,
    );

    if (!template) {
      next(
        new AppError(
          "Template not found",
          404,
          "NOT_FOUND",
          "Template not found with the provided ID.",
        ),
      );
    }

    res.status(200).json(template);
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
    const templateId: string = req.params.id as string;
    const template: Template = await TemplateModel.update(
      supabase,
      templateId,
      req.body,
    );

    res.status(200).json(template);
  } catch (error) {
    next(error);
  }
};

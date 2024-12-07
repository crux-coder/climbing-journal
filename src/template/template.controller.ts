import { NextFunction, Request, Response } from 'express';
import { AppError } from 'src/common/app.error';
import TemplateModel, { Template } from 'src/template/template.model';

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: Template = await TemplateModel.create(req.body);

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const getAll = async (_: Request, res: Response, next: NextFunction) => {
    try {
        const users: Template[] = await TemplateModel.getAll();

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Middleware already validated the ID, if we reach this point, we can safely assume that the ID is a string
        const userId: string = req.params.id as string;

        const user: Template | null = await TemplateModel.getById(userId);

        if (!user) {
            next(new AppError('User not found', 404, 'USER_NOT_FOUND', 'User not found with the provided ID.'));
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Middleware already validated the ID, if we reach this point, we can safely assume that the ID is a string
        const userId: string = req.params.id as string;
        const user: Template = await TemplateModel.update(userId, req.body);

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

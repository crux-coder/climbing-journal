import { NextFunction, Request, Response } from 'express';
import { AppError } from 'src/common/app.error';
import UseModel, { User } from 'src/users/users.model';

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: User = await UseModel.createUser(req.body);

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const getAll = async (_: Request, res: Response, next: NextFunction) => {
    try {
        const users: User[] = await UseModel.getUsers();

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Middleware already validated the ID, if we reach this point, we can safely assume that the ID is a string
        const userId: string = req.params.id as string;

        const user: User | null = await UseModel.getUserById(userId);

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
        const user: User = await UseModel.updateUser(userId, req.body);

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

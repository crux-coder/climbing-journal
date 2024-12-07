import { NextFunction, Request, Response } from 'express';
import { AppError } from 'src/common/app.error';

export type RestError = {
    success: boolean;
    error: {
        message: string;
        code: string;
        timestamp: string;
    },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorHandler = (err: AppError, _: Request, res: Response, __: NextFunction) => {
    console.error(err.stack);

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
};
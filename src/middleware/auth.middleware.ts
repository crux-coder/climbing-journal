import { Request, Response, NextFunction } from "express";
import { AppError } from "src/common/app.error";


export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        let token;

        // 1. Check Authorization header
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        // 2. Fallback to cookies
        if (!token) {
            // TODO: Implement cookie parsing
        }

        // 3. Verify token
        if (!token) {
            throw new Error('Missing authentication token.');
        }

        req.auth = { token };

        next();
    } catch (err) {
        if (err instanceof Error) {
            next(new AppError(
                err.message,
                401,
                'AUTHENTICATION_ERROR',
                'Missing or invalid authentication token.',
            ));
        }
    }
}
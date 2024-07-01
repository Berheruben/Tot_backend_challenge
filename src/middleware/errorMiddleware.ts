
import { ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { QueryFailedError } from 'typeorm';

interface CustomError extends Error {
    status?: number;
}

export const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);

    if (err instanceof ValidationError) {
        return res.status(400).json({
            message: 'Validation Error',
            details: err,
        });
    }

    if (err instanceof QueryFailedError) {
        return res.status(400).json({
            message: 'Database Query Error',
            details: err.message,
        });
    }

    if (err.status) {
        return res.status(err.status).json({
            message: err.message,
        });
    }

    res.status(500).json({
        message: 'Internal Server Error',
    });
};

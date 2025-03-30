import { Request, Response, NextFunction } from 'express';
import Boom from '@hapi/boom';

export default function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err);

    if (err.isBoom) {
        // Use Boom's formatted error
        res.status(err.output.statusCode).json(err.output.payload);
    } else {
        // Wrap the error using Boom for a friendly error message
        const boomError = Boom.badImplementation(err);
        res.status(boomError.output.statusCode).json(boomError.output.payload);
    }
}

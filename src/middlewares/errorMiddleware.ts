import { Request, Response, NextFunction } from 'express';
import Boom from '@hapi/boom';
import logger from '../utils/logger';
import config from '../config/env.config';

export default function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // Log the error
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Handle Boom errors
  if (err.isBoom) {
    return res.status(err.output.statusCode).json({
      error: err.output.payload.error,
      message: err.output.payload.message,
      statusCode: err.output.statusCode,
      ...(err.data && { details: err.data }),
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    const boomError = Boom.badRequest('Validation failed', err.details);
    return res.status(boomError.output.statusCode).json({
      error: boomError.output.payload.error,
      message: boomError.output.payload.message,
      statusCode: boomError.output.statusCode,
      details: err.details,
    });
  }

  // Handle TypeORM errors
  if (err.name === 'QueryFailedError') {
    const boomError = Boom.badRequest('Database query failed');
    return res.status(boomError.output.statusCode).json({
      error: boomError.output.payload.error,
      message: config.nodeEnv === 'production' ? 'Database operation failed' : err.message,
      statusCode: boomError.output.statusCode,
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    const boomError = Boom.unauthorized('Invalid or expired token');
    return res.status(boomError.output.statusCode).json({
      error: boomError.output.payload.error,
      message: boomError.output.payload.message,
      statusCode: boomError.output.statusCode,
    });
  }

  // Default error handling
  const boomError = Boom.badImplementation('Internal server error');
  res.status(boomError.output.statusCode).json({
    error: boomError.output.payload.error,
    message: config.nodeEnv === 'production' ? 'Something went wrong on our end' : err.message,
    statusCode: boomError.output.statusCode,
    ...(config.nodeEnv !== 'production' && { stack: err.stack }),
  });
}

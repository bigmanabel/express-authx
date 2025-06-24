import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { json } from 'body-parser';
import config from './config/env.config';
import { dataSource } from './config/database.config';
import errorMiddleware from './middlewares/errorMiddleware';
import routes from './routes';
import logger from './utils/logger';

async function bootstrap() {
  try {
    // Initialize database connection
    await dataSource.initialize();
    logger.info('Database connection established successfully');

    const app = express();

    // Security middleware
    app.use(helmet());
    app.use(
      cors({
        origin:
          config.nodeEnv === 'production'
            ? ['https://yourapp.com'] // Replace with your production domains
            : true,
        credentials: true,
      })
    );

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.maxRequests,
      message: {
        error: 'Too many requests from this IP, please try again later.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    app.use(limiter);

    // Logging middleware
    if (config.nodeEnv === 'development') {
      app.use(morgan('dev'));
    } else {
      app.use(morgan('combined'));
    }

    // Body parsing middleware
    app.use(json({ limit: '10mb' }));

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.nodeEnv,
      });
    });

    // Mount API routes
    app.use('/api', routes);

    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found on this server.',
        path: req.originalUrl,
      });
    });

    // Error handling middleware (must be last)
    app.use(errorMiddleware);

    // Start server
    app.listen(config.port, () => {
      logger.info(`🚀 Express server running on http://localhost:${config.port}`);
      logger.info(`📝 Environment: ${config.nodeEnv}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully');
      await dataSource.destroy();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT received, shutting down gracefully');
      await dataSource.destroy();
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();

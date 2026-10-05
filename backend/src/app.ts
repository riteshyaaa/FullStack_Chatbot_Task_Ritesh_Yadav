import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import routes from './routes';
import { notFoundHandler, errorHandler } from './middleware/error.middleware';
import { apiRateLimiter } from './middleware/rateLimiter.middleware';

export const createApp = (): Application => {
  const app = express();

  // Security HTTP Headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows flexible API usage
      crossOriginEmbedderPolicy: false,
    })
  );

  // Cross-Origin Resource Sharing (CORS)
  const clientOrigins = config.clientUrl
    ? config.clientUrl.split(',').map((o) => o.trim())
    : ['http://localhost:5173', 'http://localhost:3000'];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
          clientOrigins.includes('*') ||
          clientOrigins.includes(origin) ||
          origin.includes('localhost') ||
          origin.endsWith('.vercel.app')
        ) {
          return callback(null, true);
        }
        return callback(null, true);
      },
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  // Request Body Parsers with Safe Size Limits (prevents memory DoS)
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // HTTP Request Logging
  if (config.nodeEnv !== 'test') {
    app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
  }

  // Global API Rate Limiting
  app.use('/api', apiRateLimiter);

  // Mount Application Routes
  app.use('/api', routes);

  // Root welcome / health ping
  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: 'Welcome to DroneTV AI Support & Lead Assistant REST API',
      documentation: '/docs/API.md',
      endpoints: {
        health: '/api/health',
        enquiries: '/api/enquiries',
      },
    });
  });

  // 404 Not Found Middleware
  app.use(notFoundHandler);

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
};

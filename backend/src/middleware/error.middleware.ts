import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ResponseUtil } from '../utils/response';

export const notFoundHandler = (req: Request, res: Response): void => {
  ResponseUtil.notFound(res, `Route '${req.method} ${req.originalUrl}' not found on this server`);
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log full error and stack trace internally for developers / administrators
  logger.error(`Unhandled Exception: ${err.message}`, {
    stack: err.stack,
    name: err.name,
  });

  // Check for known Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    if (prismaError.code === 'P2025') {
      ResponseUtil.notFound(res, 'The requested record was not found in the database');
      return;
    }
    if (prismaError.code === 'P2002') {
      ResponseUtil.error(res, 'A unique constraint violation occurred on the database', 409);
      return;
    }
  }

  if (err.name === 'PrismaClientValidationError') {
    ResponseUtil.badRequest(res, 'Invalid data provided to database query');
    return;
  }

  // Return safe generic message to client without leaking internal details or stack traces
  ResponseUtil.serverError(
    res,
    'An unexpected server error occurred. Our technical team has been notified.'
  );
};

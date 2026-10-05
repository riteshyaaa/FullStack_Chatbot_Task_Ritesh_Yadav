import { Response } from 'express';
import { ApiResponse } from '../types';

export class ResponseUtil {
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode = 200,
    meta?: ApiResponse['meta']
  ): Response {
    const responseBody: ApiResponse<T> = {
      success: true,
      data,
      ...(message && { message }),
      ...(meta && { meta }),
    };
    return res.status(statusCode).json(responseBody);
  }

  static created<T>(res: Response, data: T, message = 'Resource created successfully'): Response {
    return this.success(res, data, message, 201);
  }

  static error(
    res: Response,
    message: string,
    statusCode = 500,
    errors?: Array<{ field?: string; message: string }>
  ): Response {
    const responseBody: ApiResponse = {
      success: false,
      message,
      ...(errors && errors.length > 0 && { errors }),
    };
    return res.status(statusCode).json(responseBody);
  }

  static badRequest(
    res: Response,
    message = 'Bad Request',
    errors?: Array<{ field?: string; message: string }>
  ): Response {
    return this.error(res, message, 400, errors);
  }

  static notFound(res: Response, message = 'Resource not found'): Response {
    return this.error(res, message, 404);
  }

  static serverError(res: Response, message = 'Internal server error'): Response {
    return this.error(res, message, 500);
  }
}

import rateLimit from 'express-rate-limit';
import { config } from '../config';
import { ResponseUtil } from '../utils/response';

export const apiRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    ResponseUtil.error(
      res,
      'Too many requests from this IP. Please try again after 15 minutes.',
      429
    );
  },
});

export const leadSubmissionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max 10 submissions per minute per IP to prevent spam
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    ResponseUtil.error(
      res,
      'Too many enquiry submissions in a short period. Please wait a minute and try again.',
      429
    );
  },
});

import { Router, Request, Response } from 'express';
import { EnquiryService } from '../services/enquiry.service';
import { ResponseUtil } from '../utils/response';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Check system health, database connection, and uptime
 */
router.get('/', async (_req: Request, res: Response) => {
  const isDbHealthy = await EnquiryService.checkDatabaseHealth();

  const healthData = {
    status: isDbHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: isDbHealthy ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  };

  if (!isDbHealthy) {
    ResponseUtil.error(res, 'Database connection is degraded', 503, [
      { message: 'Database connection failed' },
    ]);
    return;
  }

  ResponseUtil.success(res, healthData, 'System is operational');
});

export default router;

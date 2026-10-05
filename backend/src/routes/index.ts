import { Router } from 'express';
import enquiryRoutes from './enquiry.routes';
import healthRoutes from './health.routes';

const router = Router();

router.use('/enquiries', enquiryRoutes);
router.use('/health', healthRoutes);

export default router;

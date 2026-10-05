import { Router } from 'express';
import { EnquiryController } from '../controllers/enquiry.controller';
import {
  validateBody,
  validateQuery,
  validateParams,
} from '../middleware/validate.middleware';
import {
  createEnquirySchema,
  updateEnquirySchema,
  queryEnquirySchema,
  idParamSchema,
} from '../validators/enquiry.validator';
import { leadSubmissionLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

/**
 * @route   GET /api/enquiries
 * @desc    Get all enquiries with search, filtering, and pagination
 */
router.get(
  '/',
  validateQuery(queryEnquirySchema),
  EnquiryController.getAll
);

/**
 * @route   GET /api/enquiries/:id
 * @desc    Get a single enquiry by ID
 */
router.get(
  '/:id',
  validateParams(idParamSchema),
  EnquiryController.getById
);

/**
 * @route   POST /api/enquiries
 * @desc    Submit a new enquiry
 */
router.post(
  '/',
  leadSubmissionLimiter,
  validateBody(createEnquirySchema),
  EnquiryController.create
);

/**
 * @route   PATCH /api/enquiries/:id
 * @desc    Update an enquiry (e.g. status transition)
 */
router.patch(
  '/:id',
  validateParams(idParamSchema),
  validateBody(updateEnquirySchema),
  EnquiryController.update
);

/**
 * @route   PUT /api/enquiries/:id
 * @desc    Alias for full or partial update
 */
router.put(
  '/:id',
  validateParams(idParamSchema),
  validateBody(updateEnquirySchema),
  EnquiryController.update
);

/**
 * @route   DELETE /api/enquiries/:id
 * @desc    Delete an enquiry
 */
router.delete(
  '/:id',
  validateParams(idParamSchema),
  EnquiryController.delete
);

export default router;

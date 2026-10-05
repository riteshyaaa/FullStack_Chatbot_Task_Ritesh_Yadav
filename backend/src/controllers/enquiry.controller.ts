import { Request, Response, NextFunction } from 'express';
import { EnquiryService } from '../services/enquiry.service';
import { ResponseUtil } from '../utils/response';
import { ICreateEnquiryDTO, IUpdateEnquiryDTO, IEnquiryQueryFilters } from '../types';

export class EnquiryController {
  /**
   * GET /api/enquiries
   * Retrieve paginated, filtered, and searchable enquiries
   */
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: IEnquiryQueryFilters = req.query as any;
      const result = await EnquiryService.getEnquiries(filters);

      ResponseUtil.success(
        res,
        result.enquiries,
        'Enquiries retrieved successfully',
        200,
        {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/enquiries/:id
   * Retrieve a specific enquiry by ID
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const enquiry = await EnquiryService.getEnquiryById(id);

      if (!enquiry) {
        ResponseUtil.notFound(res, `Enquiry with ID '${id}' not found`);
        return;
      }

      ResponseUtil.success(res, enquiry, 'Enquiry retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/enquiries
   * Create a new enquiry (via Chatbot or Web Form)
   */
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: ICreateEnquiryDTO = req.body;
      const created = await EnquiryService.createEnquiry(data);

      ResponseUtil.created(
        res,
        created,
        'Thank you! Your enquiry has been successfully submitted. Our team will contact you shortly.'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/enquiries/:id
   * Update an existing enquiry (status, details)
   */
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data: IUpdateEnquiryDTO = req.body;

      // First check if enquiry exists
      const existing = await EnquiryService.getEnquiryById(id);
      if (!existing) {
        ResponseUtil.notFound(res, `Enquiry with ID '${id}' not found`);
        return;
      }

      const updated = await EnquiryService.updateEnquiry(id, data);
      ResponseUtil.success(res, updated, 'Enquiry updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/enquiries/:id
   * Delete an enquiry by ID
   */
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const existing = await EnquiryService.getEnquiryById(id);
      if (!existing) {
        ResponseUtil.notFound(res, `Enquiry with ID '${id}' not found`);
        return;
      }

      const deleted = await EnquiryService.deleteEnquiry(id);
      ResponseUtil.success(res, { id: deleted.id }, 'Enquiry deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

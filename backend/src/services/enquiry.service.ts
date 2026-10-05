import { PrismaClient, UserType, EnquiryStatus, Prisma } from '@prisma/client';
import { ICreateEnquiryDTO, IUpdateEnquiryDTO, IEnquiryQueryFilters, IEnquiry } from '../types';
import { logger } from '../utils/logger';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export class EnquiryService {
  /**
   * Create a new enquiry in database
   */
  static async createEnquiry(data: ICreateEnquiryDTO): Promise<IEnquiry> {
    logger.info(`Creating enquiry for ${data.name} (${data.email}) - Type: ${data.userType}`);

    const newEnquiry = await prisma.enquiry.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || null,
        userType: data.userType as UserType,
        serviceInterest: data.serviceInterest?.trim() || null,
        message: data.message.trim(),
        status: EnquiryStatus.New,
      },
    });

    return newEnquiry;
  }

  /**
   * Get all enquiries with optional search, filters, pagination, and sorting
   */
  static async getEnquiries(filters: IEnquiryQueryFilters): Promise<{
    enquiries: IEnquiry[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 50;
    const skip = (page - 1) * limit;

    const where: Prisma.EnquiryWhereInput = {};

    // Filter by userType
    if (filters.userType) {
      where.userType = filters.userType as UserType;
    }

    // Filter by status
    if (filters.status) {
      where.status = filters.status as EnquiryStatus;
    }

    // Search by name, email, message, or serviceInterest
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.trim();
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { message: { contains: searchTerm, mode: 'insensitive' } },
        { serviceInterest: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    // Sorting
    const sortBy = filters.sortBy || 'createdAt';
    const order = filters.order || 'desc';
    const orderBy: Prisma.EnquiryOrderByWithRelationInput = {
      [sortBy]: order,
    };

    const [total, enquiries] = await Promise.all([
      prisma.enquiry.count({ where }),
      prisma.enquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      enquiries,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Get a single enquiry by ID
   */
  static async getEnquiryById(id: string): Promise<IEnquiry | null> {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
    });
    return enquiry;
  }

  /**
   * Update an enquiry by ID (e.g. status transition or field edits)
   */
  static async updateEnquiry(id: string, data: IUpdateEnquiryDTO): Promise<IEnquiry> {
    const updateData: Prisma.EnquiryUpdateInput = {};

    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.email !== undefined) updateData.email = data.email.trim().toLowerCase();
    if (data.phone !== undefined) updateData.phone = data.phone?.trim() || null;
    if (data.userType !== undefined) updateData.userType = data.userType as UserType;
    if (data.serviceInterest !== undefined) updateData.serviceInterest = data.serviceInterest?.trim() || null;
    if (data.message !== undefined) updateData.message = data.message.trim();
    if (data.status !== undefined) updateData.status = data.status as EnquiryStatus;

    const updated = await prisma.enquiry.update({
      where: { id },
      data: updateData,
    });

    logger.info(`Updated enquiry ID: ${id} - Status: ${updated.status}`);
    return updated;
  }

  /**
   * Delete an enquiry by ID
   */
  static async deleteEnquiry(id: string): Promise<IEnquiry> {
    const deleted = await prisma.enquiry.delete({
      where: { id },
    });
    logger.info(`Deleted enquiry ID: ${id}`);
    return deleted;
  }

  /**
   * Health check for database connection
   */
  static async checkDatabaseHealth(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (err) {
      logger.error('Database health check failed:', err);
      return false;
    }
  }
}

export { prisma };

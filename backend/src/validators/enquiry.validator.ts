import { z } from 'zod';

// Regex for international phone number validation (allows +, digits, spaces, hyphens, parens)
const phoneRegex = /^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d-.\s]{5,15}$/;

export const createEnquirySchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(150, 'Name cannot exceed 150 characters'),

  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please enter a valid email address (e.g. name@domain.com)')
    .max(255, 'Email cannot exceed 255 characters'),

  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Please enter a valid phone number (e.g. +91 9876543210)')
    .max(20, 'Phone number cannot exceed 20 characters')
    .optional()
    .nullable()
    .or(z.literal('')),

  userType: z.enum(['Student', 'Customer', 'Other'], {
    errorMap: () => ({ message: 'User type must be Student, Customer, or Other' }),
  }),

  serviceInterest: z
    .string()
    .trim()
    .max(255, 'Service interest cannot exceed 255 characters')
    .optional()
    .nullable()
    .or(z.literal('')),

  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(5, 'Message must be at least 5 characters')
    .max(3000, 'Message cannot exceed 3000 characters'),
});

export const updateEnquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(150, 'Name cannot exceed 150 characters')
    .optional(),

  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .max(255, 'Email cannot exceed 255 characters')
    .optional(),

  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Please enter a valid phone number')
    .max(20, 'Phone cannot exceed 20 characters')
    .optional()
    .nullable(),

  userType: z.enum(['Student', 'Customer', 'Other']).optional(),

  serviceInterest: z.string().trim().max(255).optional().nullable(),

  message: z
    .string()
    .trim()
    .min(5, 'Message must be at least 5 characters')
    .max(3000, 'Message cannot exceed 3000 characters')
    .optional(),

  status: z.enum(['New', 'Contacted', 'InProgress', 'Closed'], {
    errorMap: () => ({ message: 'Status must be New, Contacted, InProgress, or Closed' }),
  }).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export const queryEnquirySchema = z.object({
  search: z.string().trim().optional(),
  userType: z.enum(['Student', 'Customer', 'Other']).optional(),
  status: z.enum(['New', 'Contacted', 'InProgress', 'Closed']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  sortBy: z.enum(['createdAt', 'name', 'status', 'userType']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const idParamSchema = z.object({
  id: z.string({ required_error: 'Enquiry ID is required' }).trim().min(1, 'ID cannot be empty'),
});

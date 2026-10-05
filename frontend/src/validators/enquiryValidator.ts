import { ICreateEnquiryInput } from '../types';

export interface ValidationError {
  field: keyof ICreateEnquiryInput;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;

export const validateEnquiryForm = (data: Partial<ICreateEnquiryInput>): ValidationResult => {
  const errors: Record<string, string> = {};

  // Name Validation
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Full name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  } else if (data.name.trim().length > 150) {
    errors.name = 'Name cannot exceed 150 characters';
  }

  // Email Validation
  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'Email address is required';
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address';
  } else if (data.email.trim().length > 255) {
    errors.email = 'Email cannot exceed 255 characters';
  }

  // Phone Validation (Optional)
  if (data.phone && data.phone.trim().length > 0) {
    if (!PHONE_REGEX.test(data.phone.trim())) {
      errors.phone = 'Please enter a valid phone number (e.g. +91 9876543210)';
    } else if (data.phone.trim().length > 20) {
      errors.phone = 'Phone number cannot exceed 20 characters';
    }
  }

  // UserType Validation
  const validUserTypes = ['Student', 'Customer', 'Other'];
  if (!data.userType) {
    errors.userType = 'Please select whether you are a Student, Customer, or Other';
  } else if (!validUserTypes.includes(data.userType)) {
    errors.userType = 'Invalid inquiry type selected';
  }

  // Service Interest Validation (Optional)
  if (data.serviceInterest && data.serviceInterest.trim().length > 255) {
    errors.serviceInterest = 'Service interest cannot exceed 255 characters';
  }

  // Message Validation
  if (!data.message || data.message.trim().length === 0) {
    errors.message = 'Please provide a message or describe your requirement';
  } else if (data.message.trim().length < 5) {
    errors.message = 'Message must be at least 5 characters long';
  } else if (data.message.trim().length > 3000) {
    errors.message = 'Message cannot exceed 3000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

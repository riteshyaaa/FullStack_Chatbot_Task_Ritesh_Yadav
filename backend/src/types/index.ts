export type UserType = 'Student' | 'Customer' | 'Other';
export type EnquiryStatus = 'New' | 'Contacted' | 'InProgress' | 'Closed';

export interface IEnquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  userType: UserType;
  serviceInterest?: string | null;
  message: string;
  status: EnquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateEnquiryDTO {
  name: string;
  email: string;
  phone?: string | null;
  userType: UserType;
  serviceInterest?: string | null;
  message: string;
}

export interface IUpdateEnquiryDTO {
  name?: string;
  email?: string;
  phone?: string | null;
  userType?: UserType;
  serviceInterest?: string | null;
  message?: string;
  status?: EnquiryStatus;
}

export interface IEnquiryQueryFilters {
  search?: string;
  userType?: UserType;
  status?: EnquiryStatus;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'name' | 'status' | 'userType';
  order?: 'asc' | 'desc';
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}

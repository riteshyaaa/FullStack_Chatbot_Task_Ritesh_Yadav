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
  createdAt: string;
  updatedAt: string;
}

export interface ICreateEnquiryInput {
  name: string;
  email: string;
  phone?: string;
  userType: UserType;
  serviceInterest?: string;
  message: string;
}

export interface IUpdateEnquiryInput {
  status?: EnquiryStatus;
  name?: string;
  email?: string;
  phone?: string;
  userType?: UserType;
  serviceInterest?: string;
  message?: string;
}

export interface IEnquiryFilters {
  search?: string;
  userType?: UserType | '';
  status?: EnquiryStatus | '';
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'name' | 'status' | 'userType';
  order?: 'asc' | 'desc';
}

export interface IApiResponse<T = any> {
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

// Chatbot Types
export type MessageSender = 'user' | 'bot';

export interface QuickReply {
  id: string;
  label: string;
  text: string;
  intentId?: string;
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: Date;
  quickReplies?: QuickReply[];
  isEnquiryPrompt?: boolean;
}

export interface ChatIntent {
  id: string;
  name: string;
  keywords: string[];
  patterns?: RegExp[];
  response: string;
  followUpReplies?: QuickReply[];
  suggestEnquiry?: boolean;
}

// Navigation & Page State
export type PageTab = 'home' | 'services' | 'courses' | 'contact' | 'admin';

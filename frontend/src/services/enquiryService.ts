import { request } from './api';
import {
  IEnquiry,
  ICreateEnquiryInput,
  IUpdateEnquiryInput,
  IEnquiryFilters,
  IApiResponse,
} from '../types';

export const enquiryService = {
  /**
   * Fetch paginated and filtered list of enquiries
   */
  async getEnquiries(filters: IEnquiryFilters = {}): Promise<IApiResponse<IEnquiry[]>> {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.userType) params.append('userType', filters.userType);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.order) params.append('order', filters.order);

    const queryString = params.toString();
    const endpoint = `/enquiries${queryString ? `?${queryString}` : ''}`;

    return request<IEnquiry[]>(endpoint, {
      method: 'GET',
    });
  },

  /**
   * Fetch a single enquiry by ID
   */
  async getEnquiryById(id: string): Promise<IApiResponse<IEnquiry>> {
    return request<IEnquiry>(`/enquiries/${encodeURIComponent(id)}`, {
      method: 'GET',
    });
  },

  /**
   * Submit a new lead / enquiry
   */
  async createEnquiry(data: ICreateEnquiryInput): Promise<IApiResponse<IEnquiry>> {
    return request<IEnquiry>('/enquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update enquiry status or details
   */
  async updateEnquiry(id: string, data: IUpdateEnquiryInput): Promise<IApiResponse<IEnquiry>> {
    return request<IEnquiry>(`/enquiries/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete an enquiry by ID
   */
  async deleteEnquiry(id: string): Promise<IApiResponse<{ id: string }>> {
    return request<{ id: string }>(`/enquiries/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  /**
   * Health check
   */
  async checkHealth(): Promise<IApiResponse<any>> {
    return request<any>('/health', {
      method: 'GET',
    });
  },
};

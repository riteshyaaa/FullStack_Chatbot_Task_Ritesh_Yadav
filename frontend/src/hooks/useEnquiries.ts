import { useState, useCallback, useEffect } from 'react';
import {
  IEnquiry,
  IEnquiryFilters,
  ICreateEnquiryInput,
  IUpdateEnquiryInput,
  EnquiryStatus,
} from '../types';
import { enquiryService } from '../services/enquiryService';

export const useEnquiries = (initialFilters: IEnquiryFilters = { page: 1, limit: 10, sortBy: 'createdAt', order: 'desc' }) => {
  const [enquiries, setEnquiries] = useState<IEnquiry[]>([]);
  const [filters, setFilters] = useState<IEnquiryFilters>(initialFilters);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEnquiries = useCallback(
    async (overrideFilters?: IEnquiryFilters) => {
      setIsLoading(true);
      setError(null);
      try {
        const activeFilters = { ...filters, ...(overrideFilters || {}) };
        const response = await enquiryService.getEnquiries(activeFilters);
        if (response.success && response.data) {
          setEnquiries(response.data);
          if (response.meta) {
            setMeta(response.meta);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch enquiries');
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchEnquiries();
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<IEnquiryFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // reset page to 1 on filter/search changes unless explicitly set
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  }, []);

  const createEnquiry = useCallback(
    async (input: ICreateEnquiryInput): Promise<IEnquiry> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await enquiryService.createEnquiry(input);
        if (response.success && response.data) {
          // Refresh current view
          fetchEnquiries();
          return response.data;
        }
        throw new Error(response.message || 'Failed to submit enquiry');
      } catch (err: any) {
        setError(err.message || 'Failed to submit enquiry');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchEnquiries]
  );

  const updateStatus = useCallback(
    async (id: string, status: EnquiryStatus): Promise<IEnquiry> => {
      try {
        const response = await enquiryService.updateEnquiry(id, { status });
        if (response.success && response.data) {
          setEnquiries((prev) =>
            prev.map((e) => (e.id === id ? { ...e, status, updatedAt: new Date().toISOString() } : e))
          );
          return response.data;
        }
        throw new Error(response.message || 'Failed to update enquiry status');
      } catch (err: any) {
        setError(err.message || 'Failed to update enquiry');
        throw err;
      }
    },
    []
  );

  const updateEnquiry = useCallback(
    async (id: string, data: IUpdateEnquiryInput): Promise<IEnquiry> => {
      try {
        const response = await enquiryService.updateEnquiry(id, data);
        if (response.success && response.data) {
          setEnquiries((prev) =>
            prev.map((e) => (e.id === id ? { ...e, ...response.data } : e))
          );
          return response.data;
        }
        throw new Error(response.message || 'Failed to update enquiry');
      } catch (err: any) {
        setError(err.message || 'Failed to update enquiry');
        throw err;
      }
    },
    []
  );

  const deleteEnquiry = useCallback(
    async (id: string): Promise<void> => {
      try {
        const response = await enquiryService.deleteEnquiry(id);
        if (response.success) {
          setEnquiries((prev) => prev.filter((e) => e.id !== id));
          setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
        } else {
          throw new Error(response.message || 'Failed to delete enquiry');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to delete enquiry');
        throw err;
      }
    },
    []
  );

  return {
    enquiries,
    filters,
    meta,
    isLoading,
    error,
    updateFilters,
    fetchEnquiries,
    createEnquiry,
    updateStatus,
    updateEnquiry,
    deleteEnquiry,
  };
};

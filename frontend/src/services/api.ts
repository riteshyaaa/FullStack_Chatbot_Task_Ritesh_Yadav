import { IApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  public status: number;
  public errors?: Array<{ field?: string; message: string }>;

  constructor(message: string, status = 500, errors?: Array<{ field?: string; message: string }>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<IApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data: IApiResponse<T> = await response.json().catch(() => ({
      success: false,
      message: `Failed to parse response from server (${response.status} ${response.statusText})`,
    }));

    if (!response.ok || !data.success) {
      throw new ApiError(
        data.message || `Request failed with status ${response.status}`,
        response.status,
        data.errors
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network error or connection refused
    throw new ApiError(
      'Unable to connect to the server. Please check your internet connection or verify the backend server is running.',
      0
    );
  }
};

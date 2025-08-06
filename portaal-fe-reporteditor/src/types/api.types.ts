// API type definitions

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

export interface AuthToken {
  token: string;
  expiresAt: number;
  personId?: number;
  roles?: string[];
}

export interface ReportGenerateRequest {
  [key: string]: any; // Dynamic parameters based on report configuration
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  signal?: AbortSignal;
}
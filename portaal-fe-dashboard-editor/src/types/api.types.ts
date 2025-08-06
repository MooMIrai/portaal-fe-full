// Response types per API
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Widget API types
export interface CreateWidgetRequest {
  name: string;
  widgetType: string;
  config: any;
  reportId?: number;
  dashboardId?: string;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface UpdateWidgetRequest {
  name?: string;
  config?: any;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface GenerateWidgetDataRequest {
  reportId: number;
  parameters?: Record<string, any>;
  filters?: Record<string, any>;
  dateRange?: {
    from: string;
    to: string;
  };
}

// Dashboard API types
export interface CreateDashboardRequest {
  name: string;
  description?: string;
  layout: any;
  widgets?: string[];
  permissions?: string[];
}

export interface UpdateDashboardRequest {
  name?: string;
  description?: string;
  layout?: any;
  widgets?: string[];
  permissions?: string[];
}

// Report API types
export interface Report {
  id: number;
  name: string;
  query: string;
  parameters?: any[];
  widgetType?: string;
  createdAt: string;
  updatedAt: string;
}

// Template API types
export interface CreateTemplateRequest {
  name: string;
  description?: string;
  widgetType: string;
  config: any;
  thumbnail?: string;
  category?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface UpdateTemplateRequest {
  name?: string;
  description?: string;
  config?: any;
  thumbnail?: string;
  category?: string;
  tags?: string[];
  isPublic?: boolean;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}
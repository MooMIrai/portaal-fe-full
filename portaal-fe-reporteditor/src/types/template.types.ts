export interface QueryTemplate {
  id: number;
  name: string;
  description: string;
  category: TemplateCategory;
  sql: string;
  parameters: TemplateParameter[];
  previewImage?: string;
  tags: string[];
  usageCount: number;
  rating: number;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateParameter {
  name: string;
  label: string;
  type: string;
  required: boolean;
  defaultValue?: any;
  description?: string;
  example?: string;
}

export enum TemplateCategory {
  SALES = 'SALES',
  HR = 'HR',
  FINANCE = 'FINANCE',
  INVENTORY = 'INVENTORY',
  ANALYTICS = 'ANALYTICS',
  CUSTOM = 'CUSTOM'
}

export interface TemplateFilter {
  category?: TemplateCategory;
  tags?: string[];
  search?: string;
  author?: string;
  sortBy?: 'name' | 'usageCount' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface TemplateImportExport {
  version: string;
  templates: QueryTemplate[];
  exportedAt: Date;
  exportedBy: string;
}
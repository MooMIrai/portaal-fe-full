import axios from 'axios';
import { API_ENDPOINTS } from '../constants';
import { Widget, WidgetTemplate } from '../types/widget.types';
import { CreateWidgetRequest, UpdateWidgetRequest, GenerateWidgetDataRequest, ApiResponse } from '../types/api.types';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor per aggiungere token di autenticazione
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const widgetService = {
  // Widget CRUD
  async getWidgets(): Promise<Widget[]> {
    const response = await api.get<ApiResponse<Widget[]>>(API_ENDPOINTS.WIDGETS);
    return response.data.data;
  },

  async getWidget(id: number): Promise<Widget> {
    const response = await api.get<ApiResponse<Widget>>(`${API_ENDPOINTS.WIDGETS}/${id}`);
    return response.data.data;
  },

  async createWidget(data: CreateWidgetRequest): Promise<Widget> {
    const response = await api.post<ApiResponse<Widget>>(API_ENDPOINTS.WIDGETS, data);
    return response.data.data;
  },

  async updateWidget(id: number, data: UpdateWidgetRequest): Promise<Widget> {
    const response = await api.put<ApiResponse<Widget>>(`${API_ENDPOINTS.WIDGETS}/${id}`, data);
    return response.data.data;
  },

  async deleteWidget(id: number): Promise<void> {
    await api.delete(`${API_ENDPOINTS.WIDGETS}/${id}`);
  },

  // Generate widget data
  async generateWidgetData(reportId: number, params: GenerateWidgetDataRequest): Promise<any> {
    const response = await api.post(
      `${API_ENDPOINTS.WIDGETS}/${reportId}/structured`,
      params
    );
    return response.data;
  },

  // Test data source connection
  async testDataSource(endpoint: string, method: string, params?: any): Promise<any> {
    try {
      const response = await api.request({
        url: endpoint,
        method,
        data: method === 'POST' ? params : undefined,
        params: method === 'GET' ? params : undefined
      });
      return {
        success: true,
        data: response.data,
        fields: response.data?.data?.[0] ? Object.keys(response.data.data[0]) : []
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Widget templates
  async getTemplates(): Promise<WidgetTemplate[]> {
    const response = await api.get<ApiResponse<WidgetTemplate[]>>(API_ENDPOINTS.TEMPLATES);
    return response.data.data;
  },

  async getTemplate(id: string): Promise<WidgetTemplate> {
    const response = await api.get<ApiResponse<WidgetTemplate>>(`${API_ENDPOINTS.TEMPLATES}/${id}`);
    return response.data.data;
  },

  async createTemplate(template: Omit<WidgetTemplate, 'id' | 'createdAt'>): Promise<WidgetTemplate> {
    const response = await api.post<ApiResponse<WidgetTemplate>>(API_ENDPOINTS.TEMPLATES, template);
    return response.data.data;
  },

  async updateTemplate(id: string, updates: Partial<WidgetTemplate>): Promise<WidgetTemplate> {
    const response = await api.put<ApiResponse<WidgetTemplate>>(
      `${API_ENDPOINTS.TEMPLATES}/${id}`,
      updates
    );
    return response.data.data;
  },

  async deleteTemplate(id: string): Promise<void> {
    await api.delete(`${API_ENDPOINTS.TEMPLATES}/${id}`);
  },

  // Duplicate template
  async duplicateTemplate(id: string, newName: string): Promise<WidgetTemplate> {
    const response = await api.post<ApiResponse<WidgetTemplate>>(
      `${API_ENDPOINTS.TEMPLATES}/${id}/duplicate`,
      { name: newName }
    );
    return response.data.data;
  },

  // Export/Import
  async exportWidget(id: number): Promise<Blob> {
    const response = await api.get(`${API_ENDPOINTS.WIDGETS}/${id}/export`, {
      responseType: 'blob'
    });
    return response.data;
  },

  async importWidget(file: File): Promise<Widget> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<ApiResponse<Widget>>(
      `${API_ENDPOINTS.WIDGETS}/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data.data;
  }
};
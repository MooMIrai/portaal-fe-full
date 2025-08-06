import axios from 'axios';
import { API_ENDPOINTS } from '../constants';
import { DashboardConfig } from '../types/config.types';
import { ApiResponse, CreateDashboardRequest, UpdateDashboardRequest } from '../types/api.types';

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

export const dashboardService = {
  // Dashboard CRUD
  async getDashboards(): Promise<DashboardConfig[]> {
    const response = await api.get<ApiResponse<DashboardConfig[]>>(API_ENDPOINTS.DASHBOARDS);
    return response.data.data;
  },

  async getDashboard(id: string): Promise<DashboardConfig> {
    const response = await api.get<ApiResponse<DashboardConfig>>(`${API_ENDPOINTS.DASHBOARDS}/${id}`);
    return response.data.data;
  },

  async createDashboard(data: CreateDashboardRequest): Promise<DashboardConfig> {
    const response = await api.post<ApiResponse<DashboardConfig>>(API_ENDPOINTS.DASHBOARDS, data);
    return response.data.data;
  },

  async updateDashboard(id: string, data: UpdateDashboardRequest): Promise<DashboardConfig> {
    const response = await api.put<ApiResponse<DashboardConfig>>(
      `${API_ENDPOINTS.DASHBOARDS}/${id}`,
      data
    );
    return response.data.data;
  },

  async deleteDashboard(id: string): Promise<void> {
    await api.delete(`${API_ENDPOINTS.DASHBOARDS}/${id}`);
  },

  // Dashboard widget management
  async addWidgetToDashboard(dashboardId: string, widgetId: string, position: any): Promise<void> {
    await api.post(`${API_ENDPOINTS.DASHBOARDS}/${dashboardId}/widgets`, {
      widgetId,
      position
    });
  },

  async removeWidgetFromDashboard(dashboardId: string, widgetId: string): Promise<void> {
    await api.delete(`${API_ENDPOINTS.DASHBOARDS}/${dashboardId}/widgets/${widgetId}`);
  },

  async updateWidgetPosition(
    dashboardId: string,
    widgetId: string,
    position: any
  ): Promise<void> {
    await api.put(`${API_ENDPOINTS.DASHBOARDS}/${dashboardId}/widgets/${widgetId}/position`, {
      position
    });
  },

  // Dashboard layout
  async updateDashboardLayout(id: string, layout: any): Promise<void> {
    await api.put(`${API_ENDPOINTS.DASHBOARDS}/${id}/layout`, layout);
  },

  // Dashboard permissions
  async getDashboardPermissions(id: string): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>(
      `${API_ENDPOINTS.DASHBOARDS}/${id}/permissions`
    );
    return response.data.data;
  },

  async updateDashboardPermissions(id: string, permissions: string[]): Promise<void> {
    await api.put(`${API_ENDPOINTS.DASHBOARDS}/${id}/permissions`, { permissions });
  },

  // Dashboard sharing
  async shareDashboard(id: string, users: string[]): Promise<void> {
    await api.post(`${API_ENDPOINTS.DASHBOARDS}/${id}/share`, { users });
  },

  // Dashboard duplication
  async duplicateDashboard(id: string, newName: string): Promise<DashboardConfig> {
    const response = await api.post<ApiResponse<DashboardConfig>>(
      `${API_ENDPOINTS.DASHBOARDS}/${id}/duplicate`,
      { name: newName }
    );
    return response.data.data;
  },

  // Dashboard export/import
  async exportDashboard(id: string): Promise<Blob> {
    const response = await api.get(`${API_ENDPOINTS.DASHBOARDS}/${id}/export`, {
      responseType: 'blob'
    });
    return response.data;
  },

  async importDashboard(file: File): Promise<DashboardConfig> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<ApiResponse<DashboardConfig>>(
      `${API_ENDPOINTS.DASHBOARDS}/import`,
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
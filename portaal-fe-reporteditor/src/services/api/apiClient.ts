import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '../../types/api.types';
import authService from '../auth/authService';
import { dashboardConfig } from '../../config/dashboard.config';

class ApiClient {
  private instance: AxiosInstance;
  private static singleton: ApiClient;

  private constructor() {
    this.instance = axios.create({
      baseURL: dashboardConfig.api.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'x-tenant': dashboardConfig.api.tenant
      },
      timeout: 30000 // 30 seconds
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.singleton) {
      ApiClient.singleton = new ApiClient();
    }
    return ApiClient.singleton;
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = authService.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Debug logging
        if (dashboardConfig.debug.logApiCalls) {
          console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data);
        }
        
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors
    this.instance.interceptors.response.use(
      (response) => {
        // Debug logging
        if (dashboardConfig.debug.logApiCalls) {
          console.log(`[API] Response from ${response.config.url}`, response.data);
        }
        return response;
      },
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          console.error('Authentication error in dashboard:', error);
          // Don't redirect automatically - let the main app handle auth
          // authService.logout();
          // window.location.href = '/login';
        }

        // Transform to our ApiError format
        const apiError: ApiError = {
          status: error.response?.status || 0,
          message: this.getErrorMessage(error),
          details: error.response?.data
        };

        return Promise.reject(apiError);
      }
    );
  }

  private getErrorMessage(error: AxiosError): string {
    if (error.response?.data && typeof error.response.data === 'object') {
      const data = error.response.data as any;
      return data.message || data.error || 'Errore del server';
    }
    
    if (error.code === 'ECONNABORTED') {
      return 'Richiesta timeout - il server non risponde';
    }
    
    if (!error.response) {
      return 'Errore di connessione - verifica la tua connessione internet';
    }
    
    return `Errore ${error.response.status}: ${error.response.statusText}`;
  }

  get client(): AxiosInstance {
    return this.instance;
  }
}

export default ApiClient.getInstance();
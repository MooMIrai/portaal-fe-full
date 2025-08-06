import axios from 'axios';
import { Query, QueryParameter, QueryExecutionRequest, QueryExecutionResult, ParameterType } from '../../types/query.types';
import authService from 'common/services/AuthService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-tenant': process.env.REACT_APP_TENANT || 'NEXA'
  },
});

// Interceptor per aggiungere token di autenticazione
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const reportEditorApi = {
  // Query CRUD operations
  getQueries: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string;
  }): Promise<{ data: Query[]; total: number }> => {
    const response = await api.get('/query-report-editor/queries', { params });
    
    // The API returns an array directly, we need to wrap it
    let queries: Query[] = [];
    
    if (Array.isArray(response.data)) {
      queries = response.data.map((query: any) => {
        if (query.parameters && typeof query.parameters === 'object' && !Array.isArray(query.parameters)) {
          query.parameters = [];
        } else if (!query.parameters) {
          query.parameters = [];
        } else {
          query.parameters = Array.isArray(query.parameters) ? query.parameters : [];
        }
        return query;
      });
    }
    
    // For now, return all queries without server-side pagination
    // TODO: Update when backend supports pagination
    return {
      data: queries,
      total: queries.length
    };
  },

  getQuery: async (id: number): Promise<Query> => {
    const response = await api.get(`/query-report-editor/queries/${id}`);
    const query = response.data;
    
    // The backend returns parameters as an object, we need to convert it to array
    if (query.parameters && typeof query.parameters === 'object' && !Array.isArray(query.parameters)) {
      // If it's an empty object or any other object format, convert to empty array
      query.parameters = [];
    } else if (!query.parameters) {
      query.parameters = [];
    } else {
      // Ensure parameters is always an array
      query.parameters = Array.isArray(query.parameters) ? query.parameters : [];
    }
    
    // Try to load parameters from dedicated endpoint
    try {
      const params = await reportEditorApi.getParameters(id);
      if (Array.isArray(params) && params.length > 0) {
        query.parameters = params;
      }
    } catch (error) {
      console.log('No parameters loaded from dedicated endpoint');
    }
    
    return query;
  },

  createQuery: async (query: Omit<Query, 'id' | 'createdAt' | 'updatedAt'>): Promise<Query> => {
    // Remove parameters from payload as they are managed separately
    const { parameters, ...queryData } = query;
    const response = await api.post('/query-report-editor/queries', queryData);
    return response.data;
  },

  updateQuery: async (id: number, query: Partial<Query>): Promise<Query> => {
    // Remove id and parameters from the payload as per API documentation
    const { id: _, parameters, ...updateData } = query;
    const response = await api.put(`/query-report-editor/queries/${id}`, updateData);
    return response.data;
  },

  deleteQuery: async (id: number): Promise<void> => {
    await api.delete(`/query-report-editor/queries/${id}`);
  },

  // Query execution
  executeQuery: async (queryId: number, parameters: Record<string, any>, limit?: number): Promise<QueryExecutionResult> => {
    const response = await api.post(`/query-report-editor/queries/${queryId}/preview`, {
      parameters,
      limit: limit || 100
    });
    return response.data;
  },

  // Validate SQL
  validateSQL: async (sql: string): Promise<{ valid: boolean; errors?: string[] }> => {
    const response = await api.post('/query-report-editor/validate-sql', { sql });
    return response.data;
  },

  // Export query results
  exportQuery: async (queryId: number, format: 'excel' | 'csv' | 'pdf', parameters: Record<string, any>): Promise<Blob> => {
    const response = await api.post(
      `/query-report-editor/queries/${queryId}/export`,
      { format, parameters },
      { responseType: 'blob' }
    );
    return response.data;
  },

  // Templates
  getTemplates: async (): Promise<Query[]> => {
    const response = await api.get('/query-report-editor/templates');
    return response.data;
  },

  createTemplate: async (queryId: number): Promise<Query> => {
    const response = await api.post(`/query-report-editor/queries/${queryId}/make-template`);
    return response.data;
  },

  // Get available tables for autocomplete
  getAvailableTables: async (): Promise<string[]> => {
    const response = await api.get('/query-report-editor/available-tables');
    return response.data;
  },

  // Get table columns for autocomplete
  getTableColumns: async (tableName: string): Promise<{ name: string; type: string }[]> => {
    const response = await api.get(`/query-report-editor/tables/${tableName}/columns`);
    return response.data;
  },

  // Parameter management
  createParameter: async (queryId: number, parameter: Omit<QueryParameter, 'id'>): Promise<QueryParameter> => {
    // Map our structure to backend structure
    const backendParam = {
      name: parameter.name,
      label: parameter.label,
      type: parameter.type,
      mandatory: parameter.required,
      defaultValue: parameter.defaultValue || null,
    };
    
    const response = await api.post(`/query-report-editor/queries/${queryId}/parameters`, backendParam);
    
    // Map response back to our structure
    return {
      id: response.data.id?.toString() || `param_${Date.now()}_${parameter.name}`,
      name: response.data.name,
      label: response.data.label || response.data.name,
      type: response.data.type || ParameterType.STRING,
      required: response.data.mandatory || false,
      defaultValue: response.data.defaultValue || '',
    };
  },

  updateParameter: async (queryId: number, parameterId: string, parameter: Partial<QueryParameter>): Promise<QueryParameter> => {
    // Map our structure to backend structure
    const backendParam: any = {};
    if (parameter.name !== undefined) backendParam.name = parameter.name;
    if (parameter.label !== undefined) backendParam.label = parameter.label;
    if (parameter.type !== undefined) backendParam.type = parameter.type;
    if (parameter.required !== undefined) backendParam.mandatory = parameter.required;
    if (parameter.defaultValue !== undefined) backendParam.defaultValue = parameter.defaultValue;
    
    const response = await api.put(`/query-report-editor/queries/${queryId}/parameters/${parameterId}`, backendParam);
    
    // Map response back to our structure
    return {
      id: response.data.id?.toString() || parameterId,
      name: response.data.name,
      label: response.data.label || response.data.name,
      type: response.data.type || ParameterType.STRING,
      required: response.data.mandatory || false,
      defaultValue: response.data.defaultValue || '',
    };
  },

  deleteParameter: async (queryId: number, parameterId: string): Promise<void> => {
    await api.delete(`/query-report-editor/queries/${queryId}/parameters/${parameterId}`);
  },

  getParameters: async (queryId: number): Promise<QueryParameter[]> => {
    const response = await api.get(`/query-report-editor/queries/${queryId}/parameters`);
    
    // Map backend structure to our QueryParameter type
    if (Array.isArray(response.data)) {
      return response.data.map((param: any) => ({
        id: param.id?.toString() || `param_${Date.now()}_${param.name}`,
        name: param.name,
        label: param.label || param.name,
        type: param.type || ParameterType.STRING,
        required: param.mandatory || false,
        defaultValue: param.defaultValue || '',
        // Add any other mappings if needed
      }));
    }
    
    return [];
  },
};
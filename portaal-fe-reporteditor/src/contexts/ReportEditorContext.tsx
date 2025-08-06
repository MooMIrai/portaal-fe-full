import React, { createContext, useContext, useState, useCallback } from 'react';
import { Query, QueryExecutionResult } from '../types/query.types';
import { reportEditorApi } from '../services/api/reportEditorApi';

interface ReportEditorContextType {
  queries: Query[];
  selectedQuery: Query | null;
  loading: boolean;
  error: string | null;
  executionResult: QueryExecutionResult | null;
  
  // Actions
  loadQueries: () => Promise<void>;
  selectQuery: (query: Query | null) => void;
  saveQuery: (query: Query) => Promise<void>;
  deleteQuery: (id: number) => Promise<void>;
  executeQuery: (queryId: number, parameters: Record<string, any>) => Promise<void>;
}

const ReportEditorContext = createContext<ReportEditorContextType | undefined>(undefined);

export const useReportEditor = () => {
  const context = useContext(ReportEditorContext);
  if (!context) {
    throw new Error('useReportEditor must be used within ReportEditorProvider');
  }
  return context;
};

export const ReportEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<QueryExecutionResult | null>(null);

  const loadQueries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await reportEditorApi.getQueries();
      console.log('API getQueries response:', result);
      // Handle both array response and object with data property
      const queriesData = Array.isArray(result) ? result : (result.data || []);
      console.log('Queries data:', queriesData);
      setQueries(queriesData);
    } catch (err) {
      setError('Errore nel caricamento delle query');
      console.error('Error loading queries:', err);
      setQueries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectQuery = useCallback((query: Query | null) => {
    setSelectedQuery(query);
    setExecutionResult(null);
  }, []);

  const saveQuery = useCallback(async (query: Query) => {
    try {
      setLoading(true);
      setError(null);
      
      let savedQuery: Query;
      const parameters = query.parameters || [];
      
      if (query.id) {
        // Update existing query
        savedQuery = await reportEditorApi.updateQuery(query.id, query);
        
        // Get existing parameters
        const existingParams = await reportEditorApi.getParameters(query.id);
        
        // Delete removed parameters
        for (const existing of existingParams) {
          if (!parameters.find(p => p.id === existing.id)) {
            await reportEditorApi.deleteParameter(query.id, existing.id);
          }
        }
        
        // Update or create parameters
        for (const param of parameters) {
          if (param.id && existingParams.find(p => p.id === param.id)) {
            await reportEditorApi.updateParameter(query.id, param.id, param);
          } else {
            await reportEditorApi.createParameter(query.id, param);
          }
        }
      } else {
        // Create new query first
        savedQuery = await reportEditorApi.createQuery(query);
        console.log('Created query:', savedQuery);
        
        // Then create parameters
        for (const param of parameters) {
          await reportEditorApi.createParameter(savedQuery.id, param);
        }
      }
      
      // Reload query with parameters
      savedQuery = await reportEditorApi.getQuery(savedQuery.id);
      
      // Reload all queries to ensure consistency
      await loadQueries();
      
      setSelectedQuery(savedQuery);
      return savedQuery;
    } catch (err) {
      setError('Errore nel salvataggio della query');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteQuery = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      await reportEditorApi.deleteQuery(id);
      
      setQueries(prev => prev.filter(q => q.id !== id));
      if (selectedQuery?.id === id) {
        setSelectedQuery(null);
      }
    } catch (err) {
      setError('Errore nell\'eliminazione della query');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedQuery]);

  const executeQuery = useCallback(async (queryId: number, parameters: Record<string, any>) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await reportEditorApi.executeQuery(queryId, parameters);
      setExecutionResult(result);
    } catch (err) {
      setError('Errore nell\'esecuzione della query');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const value: ReportEditorContextType = {
    queries,
    selectedQuery,
    loading,
    error,
    executionResult,
    loadQueries,
    selectQuery,
    saveQuery,
    deleteQuery,
    executeQuery,
  };

  return (
    <ReportEditorContext.Provider value={value}>
      {children}
    </ReportEditorContext.Provider>
  );
};
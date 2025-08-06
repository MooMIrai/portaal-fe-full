import apiClient from './apiClient';
import { ReportGenerateRequest } from '../../types/api.types';

class ReportApi {
  private readonly basePath = '/report-operativo';

  /**
   * Generate a report with raw data
   */
  async generateRaw(reportId: number, parameters: ReportGenerateRequest): Promise<any> {
    try {
      const response = await apiClient.client.post(
        `${this.basePath}/${reportId}/generateraw`,
        parameters
      );
      return response.data;
    } catch (error) {
      console.error(`Error generating raw report ${reportId}:`, error);
      throw error;
    }
  }

  /**
   * Generate a formatted report (Excel, PDF, etc.)
   */
  async generateFormatted(
    reportId: number, 
    parameters: ReportGenerateRequest,
    format: 'excel' | 'pdf' = 'excel'
  ): Promise<Blob> {
    try {
      const response = await apiClient.client.post(
        `${this.basePath}/${reportId}/generate`,
        { ...parameters, format },
        {
          responseType: 'blob'
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error generating formatted report ${reportId}:`, error);
      throw error;
    }
  }

  /**
   * Export widget data to Excel
   */
  async exportWidgetData(
    widgetId: number, 
    parameters: ReportGenerateRequest,
    filename?: string
  ): Promise<void> {
    try {
      const blob = await this.generateFormatted(widgetId, parameters, 'excel');
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `widget_${widgetId}_${Date.now()}.xlsx`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Error exporting widget data for widget ${widgetId}:`, error);
      throw error;
    }
  }

  /**
   * Get report metadata
   */
  async getReportInfo(reportId: number): Promise<any> {
    try {
      const response = await apiClient.client.get(`${this.basePath}/${reportId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching report info for report ${reportId}:`, error);
      throw error;
    }
  }
}

export default new ReportApi();
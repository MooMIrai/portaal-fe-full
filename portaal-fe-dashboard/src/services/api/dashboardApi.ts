import apiClient from './apiClient';
import { Widget, WidgetData } from '../../types/widget.types';
import { DashboardUserConfig, WidgetOrderUpdate } from '../../types/dashboard.types';
import authService from '../auth/authService';
import { getAccountIdFromToken, getPersonIdFromToken } from '../../utils/authHelper';

class DashboardApi {
  private readonly basePath = '/dashboard';
  private widgetsCache: Widget[] | null = null;
  
  /**
   * Clear the widgets cache
   */
  clearCache(): void {
    this.widgetsCache = null;
  }

  /**
   * Get available widgets for the current user based on their roles
   */
  async getAvailableWidgets(forceRefresh = false): Promise<Widget[]> {
    try {
      if (!forceRefresh && this.widgetsCache) {
        return this.widgetsCache;
      }
      
      const response = await apiClient.client.get<Widget[]>(this.basePath);
      this.widgetsCache = response.data;
      return response.data;
    } catch (error) {
      console.error('Error fetching available widgets:', error);
      throw error;
    }
  }

  /**
   * Get widget data by generating the report
   */
  async getWidgetData(widgetId: number, parameters: Record<string, any>): Promise<WidgetData> {
    try {
      // Get widget definition to know which parameters are expected
      const widgets = await this.getAvailableWidgets();
      const widget = widgets.find(w => w.id === widgetId);
      
      // Inject user context parameters if needed
      const enrichedParams = this.enrichParameters(parameters, widget);
      
      const response = await apiClient.client.post<WidgetData>(
        `/report-operativo/${widgetId}/generateraw`,
        enrichedParams
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching widget data for widget ${widgetId}:`, error);
      throw error;
    }
  }

  /**
   * Save user preferences for a widget
   */
  async saveUserPreferences(widgetId: number, config: Partial<DashboardUserConfig>): Promise<void> {
    try {
      await apiClient.client.post(`${this.basePath}/user-config/${widgetId}`, config);
    } catch (error) {
      console.error(`Error saving user preferences for widget ${widgetId}:`, error);
      throw error;
    }
  }

  /**
   * Update widget order for the current user
   */
  async updateWidgetOrder(updates: WidgetOrderUpdate[]): Promise<void> {
    try {
      await apiClient.client.put(`${this.basePath}/user-config/order`, {
        widgets: updates
      });
    } catch (error) {
      console.error('Error updating widget order:', error);
      throw error;
    }
  }

  /**
   * Toggle widget visibility
   */
  async toggleWidgetVisibility(widgetId: number, isHidden: boolean): Promise<void> {
    try {
      await apiClient.client.patch(`${this.basePath}/user-config/${widgetId}/visibility`, {
        isHidden
      });
    } catch (error) {
      console.error(`Error toggling widget visibility for widget ${widgetId}:`, error);
      throw error;
    }
  }

  /**
   * Get user dashboard configuration
   */
  async getUserDashboardConfig(): Promise<DashboardUserConfig[]> {
    try {
      const response = await apiClient.client.get<DashboardUserConfig[]>(
        `${this.basePath}/user-config`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user dashboard config:', error);
      // If the endpoint doesn't exist, return empty array
      if ((error as any)?.status === 404) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Enrich parameters with user context (JWT claims, etc.)
   */
  private enrichParameters(parameters: Record<string, any>, widget?: Widget): Record<string, any> {
    const enriched = { ...parameters };

    // Check for JWT substitution patterns in parameters
    Object.entries(enriched).forEach(([key, value]) => {
      if (typeof value === 'string' && value.startsWith('${JWT.')) {
        const claim = value.match(/\${JWT\.([^}]+)}/)?.[1];
        if (claim) {
          const claimValue = authService.getJWTClaim(claim);
          if (claimValue !== null) {
            enriched[key] = claimValue;
          }
        }
      }
    });

    // Always add person_id from JWT
    const personId = getPersonIdFromToken();
    if (personId) {
      enriched.person_id = personId;
    }
    
    // Only add parameters that are defined for this widget
    if (widget?.parameters) {
      const paramNames = widget.parameters.map(p => p.name);
      
      // Add ACCOUNT_ID if it's a parameter for this widget and not already present
      if (paramNames.includes('ACCOUNT_ID') && !enriched.ACCOUNT_ID) {
        const accountId = getAccountIdFromToken();
        if (accountId) {
          enriched.ACCOUNT_ID = accountId;
        }
      }

      // Add current date parameters only if they are defined for this widget
      const now = new Date();
      if (paramNames.includes('ANNO') && !enriched.ANNO) {
        enriched.ANNO = now.getFullYear();
      }
      if (paramNames.includes('MESE') && !enriched.MESE) {
        enriched.MESE = now.getMonth() + 1; // JavaScript months are 0-indexed
      }
    }

    return enriched;
  }
}

export default new DashboardApi();
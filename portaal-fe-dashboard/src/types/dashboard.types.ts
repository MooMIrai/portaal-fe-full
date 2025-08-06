// Dashboard type definitions

import { Widget } from './widget.types';

export interface DashboardState {
  widgets: Widget[];
  loading: boolean;
  error: Error | null;
  editMode?: boolean;
}

export type DashboardAction =
  | { type: 'SET_WIDGETS'; payload: Widget[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'UPDATE_WIDGET_ORDER'; payload: Widget[] }
  | { type: 'TOGGLE_WIDGET_VISIBILITY'; payload: number }
  | { type: 'SET_EDIT_MODE'; payload: boolean }
  | { type: 'UPDATE_WIDGET_CONFIG'; payload: { widgetId: number; config: any } };

export interface DashboardUserConfig {
  widgetId: number;
  order?: number;
  config?: any;
  isHidden?: boolean;
}

export interface DashboardRoleConfig {
  roleId: number;
  widgetId: number;
  order: number;
  config?: any;
}

export interface WidgetOrderUpdate {
  widgetId: number;
  order: number;
}

export interface DashboardContextType {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
}

export interface DashboardFilter {
  startDate?: Date;
  endDate?: Date;
  personId?: number;
  [key: string]: any;
}
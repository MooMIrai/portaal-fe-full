import React, { useState } from 'react';
import clsx from 'clsx';
import { Widget } from '../../../types/widget.types';
import { dashboardConfig } from '../../../config/dashboard.config';
import { WidgetFilters } from '../../widgets/WidgetFilters';
import './styles.css';

interface WidgetHeaderProps {
  widget: Widget;
  onRefresh: () => void;
  onHide: () => void;
  onExport: () => void;
  onCustomize: () => void;
  onFilterApply?: (filters: Record<string, any>) => void;
  onFilterReset?: () => void;
  currentFilters?: Record<string, any>;
  isLoading: boolean;
}

export const WidgetHeader: React.FC<WidgetHeaderProps> = ({
  widget,
  onRefresh,
  onHide,
  onExport,
  onCustomize,
  onFilterApply,
  onFilterReset,
  currentFilters = {},
  isLoading
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleAction = (action: () => void) => {
    action();
    setShowMenu(false);
  };

  return (
    <div className="widget-header bg-gray-50 border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isLoading && (
            <div className="widget-header__loading">
              <svg
                className="animate-spin h-4 w-4 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {onFilterApply && onFilterReset && widget.parameters && widget.parameters.length > 0 && (
            <WidgetFilters
              widget={widget}
              currentValues={currentFilters}
              onApply={onFilterApply}
              onReset={onFilterReset}
              isLoading={isLoading}
              displayMode={widget.parameters.length <= 2 ? 'inline' : 'popup'}
              autoApply={widget.parameters.length <= 3} // Auto-apply for widgets with 3 or fewer parameters
            />
          )}

          <div className="relative">
          <button
            onClick={handleMenuToggle}
            className="widget-header__menu-button p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-label="Widget options"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="widget-header__menu absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                <div className="py-1" role="menu">
                  <button
                    onClick={() => handleAction(onRefresh)}
                    className="widget-header__menu-item w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                  >
                    <svg
                      className="inline-block w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Aggiorna
                  </button>

                  {dashboardConfig.features.export && widget.config.exportable && (
                    <button
                      onClick={() => handleAction(onExport)}
                      className="widget-header__menu-item w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      <svg
                        className="inline-block w-4 h-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Esporta
                    </button>
                  )}

                  {dashboardConfig.features.widgetCustomization && widget.config.customizable && (
                    <button
                      onClick={() => handleAction(onCustomize)}
                      className="widget-header__menu-item w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      <svg
                        className="inline-block w-4 h-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                      </svg>
                      Personalizza
                    </button>
                  )}

                  <div className="border-t border-gray-100 my-1" />

                  <button
                    onClick={() => handleAction(onHide)}
                    className="widget-header__menu-item w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                  >
                    <svg
                      className="inline-block w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                    Nascondi
                  </button>
                </div>
              </div>
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};
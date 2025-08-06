import React, { useMemo } from 'react';
import { useDashboard } from '../../../contexts/DashboardContext';
import { LoadingSpinner, EmptyState, EmptyStateIcons, DashboardErrorBoundary } from '../../common';
import { WidgetGrid } from '../WidgetGrid';
import { ChartStyleSelector } from '../../chartStyles';
import { ChartStyleProvider } from '../../../contexts/ChartStyleContext';
import './styles.css';

export const DashboardContent: React.FC = () => {
  const {
    widgets,
    userConfigs,
    isLoadingWidgets,
    autoRefreshEnabled,
    setAutoRefreshEnabled,
    refreshInterval,
    setRefreshInterval,
    loadWidgets
  } = useDashboard();

  if (isLoadingWidgets) {
    return (
      <div className="dashboard-loading h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Caricamento dashboard..." />
      </div>
    );
  }

  const visibleWidgets = widgets.filter(
    widget => !userConfigs[widget.id]?.isHidden
  );

  // Calcola statistiche per l'header
  const stats = useMemo(() => {
    const date = new Date();
    const currentMonth = date.toLocaleString('it-IT', { month: 'long', year: 'numeric' });
    
    return {
      totalWidgets: visibleWidgets.length,
      activeWidgets: visibleWidgets.filter(w => w.isActive !== false).length,
      currentMonth,
      lastUpdate: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
    };
  }, [visibleWidgets]);

  return (
    <DashboardErrorBoundary>
      <ChartStyleProvider>
        <div className="dashboard-content min-h-screen bg-gray-50" style={{ marginTop: 0, paddingTop: 0 }}>
          <div className="dashboard-header px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="rounded-xl bg-white/80 backdrop-blur-sm shadow-2xl p-8 relative" style={{
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5)'
            }}>
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-3xl font-black mb-2" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    letterSpacing: '-0.02em'
                  }}>
                    Dashboard Analytics
                  </h1>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full animate-pulse" style={{
                      background: 'linear-gradient(45deg, #00ff88, #00cc66)',
                      boxShadow: '0 0 10px rgba(0, 255, 136, 0.5)'
                    }}></div>
                    <p className="text-base font-semibold" style={{
                      background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      Monitoraggio in tempo reale • {stats.currentMonth}
                    </p>
                  </div>
                  
                  <ChartStyleSelector />
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-body px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {visibleWidgets.length === 0 ? (
              <EmptyState
                icon={EmptyStateIcons.NoWidgets}
                title="Nessun widget disponibile"
                description="Non ci sono widget da visualizzare. Contatta l'amministratore per abilitare i widget."
                className="mt-8"
              />
            ) : (
              <WidgetGrid widgets={visibleWidgets} />
            )}
          </div>
        </div>
      </ChartStyleProvider>
    </DashboardErrorBoundary>
  );
};
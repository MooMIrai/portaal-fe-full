import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Switch } from '@progress/kendo-react-inputs';
import { fullScreenIcon, refreshIcon, settingsIcon } from '@progress/kendo-svg-icons';
import WidgetPreview from '../../components/WidgetPreview/component';
import { Widget } from '../../types/widget.types';
// import Loader from 'common/Loader';

const PreviewPage: React.FC = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    loadWidgets();
  }, []);

  useEffect(() => {
    if (!autoRefresh || !selectedWidget) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, selectedWidget]);

  const loadWidgets = async () => {
    setLoading(true);
    try {
      // TODO: Caricare widget da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dati di esempio
      const mockWidgets: Widget[] = [
        {
          id: 1,
          name: 'Progetti Attivi',
          widgetType: 'gantt',
          config: {
            useStructuredFormat: true,
            structuredEndpoint: '/api/v1/structured-widget/1/structured'
          }
        },
        {
          id: 2,
          name: 'Vendite per Categoria',
          widgetType: 'pie',
          config: {
            useStructuredFormat: true,
            structuredEndpoint: '/api/v1/structured-widget/2/structured'
          }
        }
      ];
      
      setWidgets(mockWidgets);
      if (mockWidgets.length > 0) {
        setSelectedWidget(mockWidgets[0]);
      }
    } catch (error) {
      console.error('Error loading widgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    console.log('Refreshing widget data...');
    // TODO: Ricaricare dati del widget
  };

  const handleFullScreen = () => {
    setFullScreen(!fullScreen);
    if (!fullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const getPreviewContainerClass = () => {
    switch (viewMode) {
      case 'tablet':
        return 'max-w-3xl mx-auto';
      case 'mobile':
        return 'max-w-sm mx-auto';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${fullScreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Preview Widget</h1>
            <div className="flex items-center gap-4">
              {/* View Mode Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Vista:</span>
                <DropDownList
                  data={[
                    { value: 'desktop', label: 'Desktop' },
                    { value: 'tablet', label: 'Tablet' },
                    { value: 'mobile', label: 'Mobile' }
                  ]}
                  textField="label"
                  dataItemKey="value"
                  value={{ value: viewMode, label: viewMode }}
                  onChange={(e) => setViewMode(e.value.value)}
                  style={{ width: '120px' }}
                />
              </div>

              {/* Auto Refresh */}
              <div className="flex items-center gap-2">
                <Switch
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.value)}
                />
                <span className="text-sm text-gray-600">
                  Auto-refresh ({refreshInterval}s)
                </span>
              </div>

              {/* Actions */}
              <Button
                icon={refreshIcon}
                onClick={handleRefresh}
                disabled={!selectedWidget}
                title="Aggiorna dati"
              />
              <Button
                icon={fullScreenIcon}
                onClick={handleFullScreen}
                title={fullScreen ? 'Esci da schermo intero' : 'Schermo intero'}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {/* Widget Selector */}
          <div className="mb-6">
            <DropDownList
              data={widgets}
              textField="name"
              dataItemKey="id"
              value={selectedWidget}
              onChange={(e) => setSelectedWidget(e.value)}
              placeholder="Seleziona un widget..."
              style={{ width: '300px' }}
            />
          </div>

          {/* Preview Container */}
          {selectedWidget && (
            <div className={`transition-all duration-300 ${getPreviewContainerClass()}`}>
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <WidgetPreview
                  widgetType={selectedWidget.widgetType}
                  config={selectedWidget.config}
                  fullSize
                />
              </div>
            </div>
          )}

          {!selectedWidget && (
            <div className="text-center py-12 text-gray-500">
              <p>Seleziona un widget per visualizzare l'anteprima</p>
            </div>
          )}

          {/* Device Frame for Mobile/Tablet */}
          {viewMode !== 'desktop' && selectedWidget && (
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Vista {viewMode === 'mobile' ? 'Mobile' : 'Tablet'}</p>
              <p className="text-xs mt-1">
                {viewMode === 'mobile' ? '375 x 667' : '768 x 1024'} px
              </p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default PreviewPage;
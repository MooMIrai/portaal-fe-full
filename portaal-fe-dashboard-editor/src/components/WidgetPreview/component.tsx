import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { refreshIcon, dataIcon } from '@progress/kendo-svg-icons';
import { WidgetType, WidgetConfig, WidgetData } from '../../types/widget.types';
import { DataSourceConfig } from '../../types/config.types';
import { generateSampleData } from '../../utils/sampleDataGenerator';
// import Loader from 'common/Loader';

// Import dinamico dei componenti widget dal dashboard
const loadWidgetComponent = async (widgetType: WidgetType) => {
  try {
    // TODO: Importare i componenti reali dal modulo dashboard
    // Per ora restituiamo un placeholder
    return () => <div>Widget {widgetType} - Componente da importare da dashboard</div>;
  } catch (error) {
    console.error(`Failed to load widget component for ${widgetType}:`, error);
    return null;
  }
};

interface WidgetPreviewProps {
  widgetType: WidgetType;
  config: Partial<WidgetConfig>;
  dataSource?: DataSourceConfig;
  isLivePreview?: boolean;
  fullSize?: boolean;
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({
  widgetType,
  config,
  dataSource,
  isLivePreview = false,
  fullSize = false
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [WidgetComponent, setWidgetComponent] = useState<React.ComponentType<any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSampleData, setShowSampleData] = useState(!dataSource);

  // Carica il componente widget
  useEffect(() => {
    const loadComponent = async () => {
      const component = await loadWidgetComponent(widgetType);
      setWidgetComponent(() => component);
    };
    loadComponent();
  }, [widgetType]);

  // Genera o carica dati
  useEffect(() => {
    if (showSampleData || !dataSource) {
      // Usa dati di esempio
      const sampleData = generateSampleData(widgetType);
      setData(sampleData);
    } else {
      // Carica dati reali
      loadRealData();
    }
  }, [widgetType, dataSource, showSampleData]);

  const loadRealData = async () => {
    if (!dataSource?.endpoint) return;

    setLoading(true);
    setError(null);
    try {
      // TODO: Implementare chiamata API reale
      console.log('Loading data from:', dataSource.endpoint);
      
      // Simulazione caricamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Per ora usa dati di esempio
      const sampleData = generateSampleData(widgetType);
      setData(sampleData);
    } catch (err: any) {
      setError(err.message || 'Errore nel caricamento dei dati');
    } finally {
      setLoading(false);
    }
  };

  const widgetData: WidgetData = useMemo(() => ({
    widgetType,
    data,
    config: config as WidgetConfig,
    computed: {
      // TODO: Calcolare valori computed basati sul tipo di widget
    },
    metadata: {
      lastUpdated: new Date().toISOString(),
      dataSource: showSampleData ? 'sample' : 'api'
    }
  }), [widgetType, data, config, showSampleData]);

  const containerClass = fullSize 
    ? 'h-full' 
    : isLivePreview 
      ? 'h-[400px]' 
      : 'h-[500px]';

  return (
    <div className={`widget-preview ${containerClass}`}>
      {!isLivePreview && (
        <div className="widget-preview-header flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            Anteprima: {config.title || 'Senza titolo'}
          </h3>
          <div className="flex gap-2">
            <Button
              size="small"
              icon={dataIcon}
              onClick={() => setShowSampleData(!showSampleData)}
              selected={showSampleData}
            >
              Dati esempio
            </Button>
            <Button
              size="small"
              icon={refreshIcon}
              onClick={loadRealData}
              disabled={loading || showSampleData}
            >
              Aggiorna
            </Button>
          </div>
        </div>
      )}

      <div className="widget-preview-content h-full">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div>Loading...</div>
          </div>
        )}

        {error && (
          <Card className="h-full">
            <CardBody>
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadRealData}>Riprova</Button>
              </div>
            </CardBody>
          </Card>
        )}

        {!loading && !error && WidgetComponent && (
          <Card className="h-full">
            {config.showTitle !== false && config.title && (
              <CardHeader>
                <h4 className="font-medium">{config.title}</h4>
                {config.description && (
                  <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                )}
              </CardHeader>
            )}
            <CardBody className="overflow-auto">
              <WidgetComponent {...widgetData} />
            </CardBody>
          </Card>
        )}

        {!loading && !error && !WidgetComponent && (
          <Card className="h-full">
            <CardBody>
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="bg-gray-100 rounded-lg p-8 max-w-md">
                  <h4 className="text-lg font-medium mb-2">
                    Widget {widgetType}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Il componente per questo tipo di widget verrà importato dal modulo dashboard.
                  </p>
                  <div className="text-xs text-gray-500 font-mono bg-gray-50 p-3 rounded">
                    <p>Config: {JSON.stringify(config, null, 2)}</p>
                    <p className="mt-2">Data items: {data.length}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WidgetPreview;
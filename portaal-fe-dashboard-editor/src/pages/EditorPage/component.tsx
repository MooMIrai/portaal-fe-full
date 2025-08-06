import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { saveIcon, cancelIcon, previewIcon } from '@progress/kendo-svg-icons';
import WidgetTypeSelector from '../../components/WidgetTypeSelector/component';
import WidgetConfigurator from '../../components/WidgetConfigurator/component';
import WidgetPreview from '../../components/WidgetPreview/component';
import { WidgetType, WidgetConfig } from '../../types/widget.types';
import { EditorState } from '../../types/config.types';
import { useNavigate } from 'react-router-dom';
// import Loader from 'common/Loader';
import { HelpTrigger, HelpTooltip } from '../../components/Help';

const EditorPage: React.FC = () => {
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState<EditorState>({
    selectedWidgetType: undefined,
    currentConfig: {},
    isDirty: false
  });
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleWidgetTypeSelect = useCallback((type: WidgetType) => {
    setEditorState(prev => ({
      ...prev,
      selectedWidgetType: type,
      currentConfig: {},
      isDirty: true
    }));
    setPreviewMode(false);
  }, []);

  const handleConfigChange = useCallback((config: Partial<WidgetConfig>) => {
    setEditorState(prev => ({
      ...prev,
      currentConfig: config,
      isDirty: true
    }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!editorState.selectedWidgetType) return;

    setLoading(true);
    try {
      // TODO: Implementare salvataggio via API
      console.log('Saving widget:', {
        type: editorState.selectedWidgetType,
        config: editorState.currentConfig
      });
      
      // Simulazione salvataggio
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEditorState(prev => ({ ...prev, isDirty: false }));
      // TODO: Mostrare notifica di successo
    } catch (error) {
      console.error('Error saving widget:', error);
      // TODO: Mostrare notifica di errore
    } finally {
      setLoading(false);
    }
  }, [editorState]);

  const handleCancel = useCallback(() => {
    if (editorState.isDirty) {
      // TODO: Chiedere conferma prima di cancellare
      const confirmed = window.confirm('Sei sicuro di voler annullare le modifiche?');
      if (!confirmed) return;
    }
    
    setEditorState({
      selectedWidgetType: undefined,
      currentConfig: {},
      isDirty: false
    });
    setPreviewMode(false);
  }, [editorState.isDirty]);

  const togglePreview = useCallback(() => {
    setPreviewMode(prev => !prev);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="widget-editor h-full flex flex-col">
      {/* Header */}
      <div className="widget-editor-header flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Dashboard Widget Editor
        </h1>
        <div className="flex gap-2">
          {editorState.selectedWidgetType && (
            <>
              <HelpTooltip
                id="preview-button"
                title="Preview Toggle"
                content="Switch between configuration and preview modes to see how your widget will look"
                position="bottom"
              >
                <Button
                  icon={previewIcon}
                  themeColor="info"
                  onClick={togglePreview}
                >
                  {previewMode ? 'Configurazione' : 'Anteprima'}
                </Button>
              </HelpTooltip>
              <HelpTooltip
                id="save-button"
                title="Save Widget"
                content="Save your widget configuration. You can also save it as a template for future use"
                position="bottom"
              >
                <Button
                  icon={saveIcon}
                  themeColor="primary"
                  onClick={handleSave}
                  disabled={!editorState.isDirty}
                  data-help-id="save-button"
                >
                  Salva
                </Button>
              </HelpTooltip>
              <HelpTooltip
                id="cancel-button"
                title="Cancel Changes"
                content="Discard all unsaved changes and return to the initial state"
                position="bottom"
              >
                <Button
                  icon={cancelIcon}
                  themeColor="base"
                  onClick={handleCancel}
                >
                  Annulla
                </Button>
              </HelpTooltip>
            </>
          )}
          <HelpTrigger />
        </div>
      </div>

      {/* Content */}
      <div className="widget-editor-content flex-1 flex">
        {!editorState.selectedWidgetType ? (
          // Widget Type Selection
          <div className="w-full p-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-medium">Seleziona il tipo di widget</h2>
              </CardHeader>
              <CardBody>
                <HelpTooltip
                  id="widget-type-selector"
                  title="Widget Type Selection"
                  content="Choose the type of widget you want to create. Each type is optimized for different kinds of data visualization."
                  position="right"
                >
                  <div data-help-id="widget-type-selector">
                    <WidgetTypeSelector onSelect={handleWidgetTypeSelect} />
                  </div>
                </HelpTooltip>
              </CardBody>
            </Card>
          </div>
        ) : previewMode ? (
          // Preview Mode
          <div className="w-full p-6">
            <HelpTooltip
              id="widget-preview"
              title="Widget Preview"
              content="This is how your widget will appear in the final dashboard. Use this view to verify your configuration."
              position="top"
            >
              <div data-help-id="widget-preview">
                <WidgetPreview
                  widgetType={editorState.selectedWidgetType}
                  config={editorState.currentConfig}
                  dataSource={editorState.dataSource}
                />
              </div>
            </HelpTooltip>
          </div>
        ) : (
          // Configuration Mode
          <>
            {/* Sidebar - Configuration */}
            <div className="widget-editor-sidebar">
              <HelpTooltip
                id="widget-configurator"
                title="Widget Configuration"
                content="Configure your widget's data sources, appearance, and behavior settings here."
                position="right"
              >
                <div data-help-id="widget-configurator">
                  <WidgetConfigurator
                    widgetType={editorState.selectedWidgetType}
                    initialConfig={editorState.currentConfig}
                    onChange={handleConfigChange}
                    onDataSourceChange={(dataSource) => 
                      setEditorState(prev => ({ ...prev, dataSource }))
                    }
                    onDataMappingChange={(dataMapping) =>
                      setEditorState(prev => ({ ...prev, dataMapping }))
                    }
                  />
                </div>
              </HelpTooltip>
            </div>

            {/* Main - Live Preview */}
            <div className="widget-editor-main">
              <Card className="h-full">
                <CardHeader>
                  <h3 className="text-lg font-medium">Anteprima Live</h3>
                </CardHeader>
                <CardBody>
                  <HelpTooltip
                    id="live-preview"
                    title="Live Preview"
                    content="See your changes in real-time as you configure your widget. This helps you understand how your settings affect the final result."
                    position="top"
                  >
                    <div data-help-id="widget-preview">
                      <WidgetPreview
                        widgetType={editorState.selectedWidgetType}
                        config={editorState.currentConfig}
                        dataSource={editorState.dataSource}
                        isLivePreview
                      />
                    </div>
                  </HelpTooltip>
                </CardBody>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditorPage;
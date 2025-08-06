import React, { useState, useEffect, useMemo } from 'react';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Input } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Switch } from '@progress/kendo-react-inputs';
import { ColorPicker } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { WIDGET_INFO, DEFAULT_COLORS, DATE_FORMATS, BASE_UNITS, LEGEND_POSITIONS } from '../../constants';
import { WidgetType, WidgetConfig } from '../../types/widget.types';
import { DataSourceConfig, DataMapping } from '../../types/config.types';
import { HelpTooltip } from '../Help';
import DataSourceMapper from '../DataSourceMapper/component';
import { getWidgetConfigFields } from '../../utils/widgetHelpers';

interface WidgetConfiguratorProps {
  widgetType: WidgetType;
  initialConfig: Partial<WidgetConfig>;
  onChange: (config: Partial<WidgetConfig>) => void;
  onDataSourceChange?: (dataSource: DataSourceConfig) => void;
  onDataMappingChange?: (mapping: DataMapping[]) => void;
}

const WidgetConfigurator: React.FC<WidgetConfiguratorProps> = ({
  widgetType,
  initialConfig,
  onChange,
  onDataSourceChange,
  onDataMappingChange
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [formData, setFormData] = useState(initialConfig);
  const [dataSource, setDataSource] = useState<DataSourceConfig>({
    type: 'api',
    endpoint: '',
    method: 'POST'
  });

  useEffect(() => {
    setFormData(initialConfig);
  }, [initialConfig]);

  const widgetInfo = WIDGET_INFO[widgetType];
  const configFields = useMemo(() => getWidgetConfigFields(widgetType), [widgetType]);

  const handleFormChange = (event: any) => {
    const newData = { ...formData, ...event.values };
    setFormData(newData);
    onChange(newData);
  };

  const renderField = (field: any) => {
    switch (field.type) {
      case 'text':
        return (
          <Field
            key={field.name}
            name={field.name}
            label={field.label}
            component={Input}
            placeholder={field.placeholder}
          />
        );
      
      case 'number':
        return (
          <Field
            key={field.name}
            name={field.name}
            label={field.label}
            component={Input}
            type="number"
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );
      
      case 'select':
        return (
          <Field
            key={field.name}
            name={field.name}
            label={field.label}
            component={DropDownList}
            data={field.options}
            textField="label"
            dataItemKey="value"
          />
        );
      
      case 'checkbox':
        return (
          <Field
            key={field.name}
            name={field.name}
            label={field.label}
            component={Switch}
          />
        );
      
      case 'color':
        return (
          <Field
            key={field.name}
            name={field.name}
            label={field.label}
            component={ColorPicker}
            format="hex"
            palette={DEFAULT_COLORS}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="widget-configurator p-4">
      <h3 className="text-lg font-semibold mb-4">
        Configurazione {widgetInfo.name}
      </h3>

      <HelpTooltip
        id="widget-config-tabs"
        title="Configuration Tabs"
        content="Navigate through different configuration sections: General settings, specific widget configuration, data source setup, styling options, and advanced features."
        position="right"
      >
        <TabStrip selected={selectedTab} onSelect={(e) => setSelectedTab(e.selected)} data-help-id="widget-config-tabs">
          <TabStripTab title="Generale">
            <div className="p-4">
              <Form
                initialValues={formData}
                onSubmit={handleFormChange}
                render={(formRenderProps) => (
                  <FormElement>
                    <div className="space-y-4">
                      <HelpTooltip
                        id="widget-title"
                        title="Widget Title"
                        content="Give your widget a descriptive title that will be displayed in the dashboard header."
                        position="right"
                      >
                        <Field
                          name="title"
                          label="Titolo"
                          component={Input}
                          placeholder="Inserisci il titolo del widget"
                          data-help-id="widget-title"
                        />
                      </HelpTooltip>
                      
                      <HelpTooltip
                        id="widget-description"
                        title="Widget Description"
                        content="Optional description to provide additional context about what this widget displays."
                        position="right"
                      >
                        <Field
                          name="description"
                          label="Descrizione"
                          component={Input}
                          placeholder="Descrizione opzionale"
                          data-help-id="widget-description"
                        />
                      </HelpTooltip>
                      
                      <HelpTooltip
                        id="refresh-interval"
                        title="Refresh Interval"
                        content="Set how often the widget should automatically refresh its data (in seconds). Set to 0 to disable auto-refresh."
                        position="right"
                      >
                        <Field
                          name="refreshInterval"
                          label="Intervallo aggiornamento (secondi)"
                          component={Input}
                          type="number"
                          min={0}
                          defaultValue={0}
                          data-help-id="refresh-interval"
                        />
                      </HelpTooltip>
                      
                      <HelpTooltip
                        id="widget-height"
                        title="Widget Height"
                        content="Set the height of the widget in pixels. This affects how much vertical space the widget takes up in the dashboard."
                        position="right"
                      >
                        <Field
                          name="height"
                          label="Altezza (px)"
                          component={Input}
                          type="number"
                          min={200}
                          max={1000}
                          defaultValue={400}
                          data-help-id="widget-height"
                        />
                      </HelpTooltip>
                    </div>
                  </FormElement>
                )}
              />
            </div>
          </TabStripTab>

        <TabStripTab title="Configurazione">
          <div className="p-4">
            <Form
              initialValues={formData}
              onSubmit={handleFormChange}
              render={(formRenderProps) => (
                <FormElement>
                  <div className="space-y-4">
                    {configFields.general?.map(renderField)}
                  </div>
                </FormElement>
              )}
            />
          </div>
        </TabStripTab>

        <TabStripTab title="Dati">
          <div className="p-4">
            <HelpTooltip
              id="data-source-mapper"
              title="Data Source Configuration"
              content="Configure how your widget connects to data sources and map fields to visualization properties like axes, series, and filters."
              position="top"
            >
              <div data-help-id="data-source-mapper">
                <DataSourceMapper
                  widgetType={widgetType}
                  onDataSourceChange={(ds) => {
                    setDataSource(ds);
                    onDataSourceChange?.(ds);
                  }}
                  onMappingChange={onDataMappingChange}
                />
              </div>
            </HelpTooltip>
          </div>
        </TabStripTab>

        <TabStripTab title="Stile">
          <div className="p-4">
            <Form
              initialValues={formData}
              onSubmit={handleFormChange}
              render={(formRenderProps) => (
                <FormElement>
                  <div className="space-y-4">
                    {configFields.style?.map(renderField)}
                  </div>
                </FormElement>
              )}
            />
          </div>
        </TabStripTab>

        <TabStripTab title="Avanzate">
          <div className="p-4">
            <Form
              initialValues={formData}
              onSubmit={handleFormChange}
              render={(formRenderProps) => (
                <FormElement>
                  <div className="space-y-4">
                    {configFields.advanced?.map(renderField)}
                    
                    <div className="mt-6">
                      <HelpTooltip
                        id="json-config"
                        title="JSON Configuration"
                        content="Advanced users can directly edit the widget configuration as JSON. Be careful with syntax - invalid JSON will be ignored."
                        position="left"
                      >
                        <div data-help-id="json-config">
                          <label className="block text-sm font-medium mb-2">
                            Configurazione JSON
                          </label>
                          <textarea
                            className="w-full h-40 p-2 border border-gray-300 rounded-md font-mono text-sm"
                            value={JSON.stringify(formData, null, 2)}
                            onChange={(e) => {
                              try {
                                const parsed = JSON.parse(e.target.value);
                                setFormData(parsed);
                                onChange(parsed);
                              } catch (error) {
                                // Invalid JSON, ignore
                              }
                            }}
                          />
                        </div>
                      </HelpTooltip>
                    </div>
                  </div>
                </FormElement>
              )}
            />
          </div>
        </TabStripTab>
      </TabStrip>
      </HelpTooltip>
    </div>
  );
};

export default WidgetConfigurator;
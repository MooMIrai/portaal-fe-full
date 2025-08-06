import React, { useState, useMemo } from 'react';
import { Card, CardBody } from '@progress/kendo-react-layout';
import { ButtonGroup, Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import { searchIcon } from '@progress/kendo-svg-icons';
import { WIDGET_INFO, WIDGET_CATEGORIES, WIDGET_TYPES } from '../../constants';
import { WidgetType, WidgetCategory } from '../../types/widget.types';
import { HelpTooltip } from '../Help';
import * as icons from '@progress/kendo-svg-icons';

interface WidgetTypeSelectorProps {
  onSelect: (type: WidgetType) => void;
  selectedType?: WidgetType;
}

const WidgetTypeSelector: React.FC<WidgetTypeSelectorProps> = ({ onSelect, selectedType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WidgetCategory | 'all'>('all');

  const categories = useMemo(() => [
    { value: 'all', label: 'Tutti' },
    { value: WIDGET_CATEGORIES.CHARTS, label: 'Grafici' },
    { value: WIDGET_CATEGORIES.METRICS, label: 'Metriche' },
    { value: WIDGET_CATEGORIES.TABLES, label: 'Tabelle' },
    { value: WIDGET_CATEGORIES.TIMELINE, label: 'Timeline' }
  ], []);

  const filteredWidgets = useMemo(() => {
    return Object.entries(WIDGET_INFO).filter(([type, info]) => {
      const matchesSearch = searchTerm === '' || 
        info.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        info.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || info.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const getIconComponent = (iconName: string) => {
    // Map icon names to actual icon components
    const iconMap: Record<string, any> = {
      ganttIcon: icons.ganttIcon,
      pieChartIcon: icons.pieChartIcon,
      barChartIcon: icons.barChartIcon,
      lineChartIcon: icons.lineChartIcon,
      areaChartIcon: icons.areaChartIcon,
      tableIcon: icons.tableIcon,
      kpiIcon: icons.kpiIcon,
      gaugeIcon: icons.gaugeIcon,
      donutChartIcon: icons.donutChartIcon,
      scatterChartIcon: icons.scatterChartIcon,
      heatmapIcon: icons.gridIcon,
      timelineIcon: icons.clockIcon
    };
    
    return iconMap[iconName] || icons.widgetIcon;
  };

  return (
    <div className="widget-type-selector">
      {/* Filtri */}
      <div className="mb-6 space-y-4">
        <HelpTooltip
          id="widget-search"
          title="Search Widgets"
          content="Search through available widget types by name or description to quickly find what you need."
          position="bottom"
        >
          <Input
            placeholder="Cerca widget..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.value || '')}
            suffix={() => <span className="k-icon">{searchIcon}</span>}
            data-help-id="widget-search"
          />
        </HelpTooltip>
        
        <HelpTooltip
          id="widget-categories"
          title="Widget Categories"
          content="Filter widgets by category: Charts for data visualization, Metrics for KPIs, Tables for data display, and Timeline for time-based data."
          position="bottom"
        >
          <ButtonGroup data-help-id="widget-categories">
            {categories.map(cat => (
              <Button
                key={cat.value}
                selected={selectedCategory === cat.value}
                onClick={() => setSelectedCategory(cat.value as WidgetCategory | 'all')}
              >
                {cat.label}
              </Button>
            ))}
          </ButtonGroup>
        </HelpTooltip>
      </div>

      {/* Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredWidgets.map(([type, info]) => {
          const Icon = getIconComponent(info.icon);
          const isSelected = selectedType === type;
          
          return (
            <HelpTooltip
              key={type}
              id={`widget-type-${type}`}
              title={info.name}
              content={`${info.description} Best used for: ${info.category} scenarios.`}
              position="top"
            >
              <Card
                className={`widget-type-card cursor-pointer transition-all ${
                  isSelected ? 'selected' : ''
                }`}
                onClick={() => onSelect(type as WidgetType)}
                data-help-id={`widget-type-${type}`}
              >
                <CardBody>
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`p-4 rounded-full ${
                      isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon size="xlarge" />
                    </div>
                    <h3 className="font-semibold text-lg">{info.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {info.description}
                    </p>
                    <div className="pt-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        isSelected ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {info.category}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </HelpTooltip>
          );
        })}
      </div>

      {filteredWidgets.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Nessun widget trovato per "{searchTerm}"</p>
          <Button
            className="mt-4"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
          >
            Cancella filtri
          </Button>
        </div>
      )}
    </div>
  );
};

export default WidgetTypeSelector;
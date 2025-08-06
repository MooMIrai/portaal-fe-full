import { WidgetType } from '../types/widget.types';
import { FormFieldConfig } from '../types/config.types';
import { DATE_FORMATS, BASE_UNITS, LEGEND_POSITIONS, CHART_ORIENTATIONS, DEFAULT_COLORS } from '../constants';

export const getWidgetConfigFields = (widgetType: WidgetType): {
  general?: FormFieldConfig[];
  style?: FormFieldConfig[];
  advanced?: FormFieldConfig[];
} => {
  const commonFields: FormFieldConfig[] = [
    {
      name: 'showTitle',
      label: 'Mostra titolo',
      type: 'checkbox',
      defaultValue: true
    },
    {
      name: 'showDescription',
      label: 'Mostra descrizione',
      type: 'checkbox',
      defaultValue: false
    }
  ];

  switch (widgetType) {
    case 'gantt':
      return {
        general: [
          {
            name: 'categoryField',
            label: 'Campo categoria',
            type: 'text',
            required: true,
            placeholder: 'es. taskcategory'
          },
          {
            name: 'fromField',
            label: 'Campo data inizio',
            type: 'text',
            required: true,
            placeholder: 'es. startdate'
          },
          {
            name: 'toField',
            label: 'Campo data fine',
            type: 'text',
            required: true,
            placeholder: 'es. enddate'
          },
          {
            name: 'dateFormat',
            label: 'Formato data',
            type: 'select',
            options: DATE_FORMATS,
            defaultValue: 'MMM yyyy'
          },
          {
            name: 'baseUnit',
            label: 'Unità base',
            type: 'select',
            options: BASE_UNITS,
            defaultValue: 'months'
          }
        ],
        style: [
          {
            name: 'color',
            label: 'Colore barre',
            type: 'color',
            defaultValue: '#3498db'
          },
          {
            name: 'reverseCategories',
            label: 'Inverti categorie',
            type: 'checkbox',
            defaultValue: true
          }
        ],
        advanced: [
          ...commonFields,
          {
            name: 'showTooltip',
            label: 'Mostra tooltip',
            type: 'checkbox',
            defaultValue: true
          },
          {
            name: 'tooltipFormat',
            label: 'Formato tooltip',
            type: 'text',
            placeholder: '{category}: {from:dd/MM} - {to:dd/MM}'
          }
        ]
      };

    case 'pie':
    case 'donut':
      return {
        general: [
          {
            name: 'categoryField',
            label: 'Campo categoria',
            type: 'text',
            required: true,
            placeholder: 'es. category'
          },
          {
            name: 'valueField',
            label: 'Campo valore',
            type: 'text',
            required: true,
            placeholder: 'es. value'
          },
          {
            name: 'showLabels',
            label: 'Mostra etichette',
            type: 'checkbox',
            defaultValue: true
          },
          {
            name: 'labelPosition',
            label: 'Posizione etichette',
            type: 'select',
            options: [
              { value: 'inside', label: 'Dentro' },
              { value: 'outside', label: 'Fuori' }
            ],
            defaultValue: 'outside',
            dependsOn: { field: 'showLabels', value: true }
          }
        ],
        style: [
          {
            name: 'showLegend',
            label: 'Mostra legenda',
            type: 'checkbox',
            defaultValue: true
          },
          {
            name: 'legendPosition',
            label: 'Posizione legenda',
            type: 'select',
            options: LEGEND_POSITIONS,
            defaultValue: 'bottom',
            dependsOn: { field: 'showLegend', value: true }
          },
          ...(widgetType === 'donut' ? [{
            name: 'holeSize',
            label: 'Dimensione buco (%)',
            type: 'number',
            validation: { min: 0, max: 90 },
            defaultValue: 60
          } as FormFieldConfig] : [])
        ],
        advanced: [
          ...commonFields,
          {
            name: 'tooltipFormat',
            label: 'Formato tooltip',
            type: 'text',
            placeholder: '{category}: {value}%'
          }
        ]
      };

    case 'bar':
    case 'line':
    case 'area':
      return {
        general: [
          {
            name: 'categoryField',
            label: 'Campo categoria',
            type: 'text',
            required: true,
            placeholder: 'es. month'
          },
          {
            name: 'valueField',
            label: 'Campo valore',
            type: 'text',
            required: true,
            placeholder: 'es. sales',
            helpText: 'Puoi inserire più campi separati da virgola'
          },
          ...(widgetType === 'bar' ? [{
            name: 'orientation',
            label: 'Orientamento',
            type: 'select',
            options: CHART_ORIENTATIONS,
            defaultValue: 'vertical'
          } as FormFieldConfig] : []),
          ...(widgetType === 'bar' || widgetType === 'area' ? [{
            name: 'stacked',
            label: 'Impilato',
            type: 'checkbox',
            defaultValue: false
          } as FormFieldConfig] : [])
        ],
        style: [
          ...(widgetType === 'line' || widgetType === 'area' ? [{
            name: 'smooth',
            label: 'Linee morbide',
            type: 'checkbox',
            defaultValue: true
          } as FormFieldConfig] : []),
          ...(widgetType === 'line' ? [
            {
              name: 'markers',
              label: 'Mostra marcatori',
              type: 'checkbox',
              defaultValue: true
            },
            {
              name: 'markerSize',
              label: 'Dimensione marcatori',
              type: 'number',
              validation: { min: 2, max: 10 },
              defaultValue: 4,
              dependsOn: { field: 'markers', value: true }
            }
          ] as FormFieldConfig[] : []),
          ...(widgetType === 'area' ? [{
            name: 'opacity',
            label: 'Opacità',
            type: 'number',
            validation: { min: 0.1, max: 1 },
            defaultValue: 0.7
          } as FormFieldConfig] : [])
        ],
        advanced: [
          ...commonFields,
          {
            name: 'showValueLabels',
            label: 'Mostra valori',
            type: 'checkbox',
            defaultValue: false
          }
        ]
      };

    case 'kpi':
      return {
        general: [
          {
            name: 'valueField',
            label: 'Campo valore',
            type: 'text',
            required: true,
            placeholder: 'es. totalSales'
          },
          {
            name: 'format',
            label: 'Formato valore',
            type: 'text',
            placeholder: '€ {0:n0}',
            defaultValue: '{0:n0}'
          },
          {
            name: 'icon',
            label: 'Icona',
            type: 'text',
            placeholder: 'fas fa-euro-sign'
          }
        ],
        style: [
          {
            name: 'trend.field',
            label: 'Campo confronto',
            type: 'text',
            placeholder: 'es. previousValue'
          },
          {
            name: 'trend.positiveColor',
            label: 'Colore trend positivo',
            type: 'color',
            defaultValue: '#27ae60'
          },
          {
            name: 'trend.negativeColor',
            label: 'Colore trend negativo',
            type: 'color',
            defaultValue: '#e74c3c'
          }
        ],
        advanced: [
          ...commonFields,
          {
            name: 'comparison.type',
            label: 'Tipo confronto',
            type: 'select',
            options: [
              { value: 'percentage', label: 'Percentuale' },
              { value: 'absolute', label: 'Assoluto' }
            ],
            defaultValue: 'percentage'
          }
        ]
      };

    case 'gauge':
      return {
        general: [
          {
            name: 'valueField',
            label: 'Campo valore',
            type: 'text',
            required: true
          },
          {
            name: 'min',
            label: 'Valore minimo',
            type: 'number',
            required: true,
            defaultValue: 0
          },
          {
            name: 'max',
            label: 'Valore massimo',
            type: 'number',
            required: true,
            defaultValue: 100
          },
          {
            name: 'format',
            label: 'Formato valore',
            type: 'text',
            placeholder: '{0}%',
            defaultValue: '{0}'
          }
        ],
        style: [
          {
            name: 'pointer.color',
            label: 'Colore indicatore',
            type: 'color',
            defaultValue: '#34495e'
          }
        ],
        advanced: commonFields
      };

    case 'table':
      return {
        general: [
          {
            name: 'pageSize',
            label: 'Righe per pagina',
            type: 'number',
            validation: { min: 5, max: 100 },
            defaultValue: 20
          },
          {
            name: 'sortable',
            label: 'Ordinabile',
            type: 'checkbox',
            defaultValue: true
          },
          {
            name: 'filterable',
            label: 'Filtrabile',
            type: 'checkbox',
            defaultValue: true
          }
        ],
        style: [
          {
            name: 'resizable',
            label: 'Colonne ridimensionabili',
            type: 'checkbox',
            defaultValue: true
          },
          {
            name: 'reorderable',
            label: 'Colonne riordinabili',
            type: 'checkbox',
            defaultValue: true
          }
        ],
        advanced: [
          ...commonFields,
          {
            name: 'groupable',
            label: 'Raggruppabile',
            type: 'checkbox',
            defaultValue: false
          }
        ]
      };

    default:
      return {
        general: [],
        style: [],
        advanced: commonFields
      };
  }
};

export const validateWidgetConfig = (widgetType: WidgetType, config: any): string[] => {
  const errors: string[] = [];
  const requiredFields = getRequiredFieldsForWidget(widgetType);

  requiredFields.forEach(field => {
    if (!config[field]) {
      errors.push(`Il campo "${field}" è obbligatorio`);
    }
  });

  return errors;
};

export const getRequiredFieldsForWidget = (widgetType: WidgetType): string[] => {
  switch (widgetType) {
    case 'gantt':
      return ['categoryField', 'fromField', 'toField'];
    case 'pie':
    case 'donut':
    case 'bar':
    case 'line':
    case 'area':
      return ['categoryField', 'valueField'];
    case 'kpi':
      return ['valueField'];
    case 'gauge':
      return ['valueField', 'min', 'max'];
    case 'scatter':
      return ['xField', 'yField'];
    case 'heatmap':
      return ['xField', 'yField', 'valueField'];
    case 'timeline':
      return ['dateField', 'titleField'];
    case 'table':
      return ['columns'];
    default:
      return [];
  }
};
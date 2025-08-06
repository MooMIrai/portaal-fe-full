import { HelpTour } from '../../../types/help.types';

export const helpTours: HelpTour[] = [
  {
    id: 'first-time-user',
    name: 'First Time User Tour',
    description: 'Get familiar with the Dashboard Editor interface and basic features',
    category: 'getting-started',
    steps: [
      {
        id: 'welcome',
        target: '.main-content',
        title: 'Welcome to Dashboard Editor',
        content: 'This is your workspace for creating and editing dashboard widgets. Let\'s explore the key areas!',
        position: 'bottom'
      },
      {
        id: 'widget-selector',
        target: '[data-help-id="widget-type-selector"]',
        title: 'Widget Type Selector',
        content: 'Start by selecting the type of widget you want to create. Choose from charts, tables, KPIs, and more.',
        position: 'right'
      },
      {
        id: 'data-mapper',
        target: '[data-help-id="data-source-mapper"]',
        title: 'Data Source Configuration',
        content: 'Connect your widget to data sources and map fields to create meaningful visualizations.',
        position: 'left'
      },
      {
        id: 'widget-preview',
        target: '[data-help-id="widget-preview"]',
        title: 'Live Preview',
        content: 'See your widget update in real-time as you make changes. This helps you visualize the final result.',
        position: 'top'
      },
      {
        id: 'help-system',
        target: '[data-help-id="help-trigger"]',
        title: 'Help System',
        content: 'Access help anytime using this button, or press F1 to enable Help Mode for interactive tooltips.',
        position: 'left'
      }
    ]
  },
  
  {
    id: 'creating-chart-widget',
    name: 'Creating Your First Chart',
    description: 'Step-by-step guide to create a chart widget from scratch',
    category: 'widgets',
    steps: [
      {
        id: 'select-chart-type',
        target: '[data-help-id="widget-type-selector"]',
        title: 'Select Chart Type',
        content: 'Click here to open the widget type selector and choose "Line Chart" for this tutorial.',
        position: 'right',
        action: () => {
          // This would trigger opening the widget type selector
          console.log('Opening widget type selector');
        }
      },
      {
        id: 'choose-data-source',
        target: '[data-help-id="data-source-dropdown"]',
        title: 'Choose Data Source',
        content: 'Select a data source from the dropdown. For this example, we\'ll use the "Sales Data" source.',
        position: 'bottom'
      },
      {
        id: 'map-x-axis',
        target: '[data-help-id="x-axis-field"]',
        title: 'Map X-Axis Field',
        content: 'Select the field for the X-axis. Choose "Date" to show data over time.',
        position: 'right'
      },
      {
        id: 'map-y-axis',
        target: '[data-help-id="y-axis-field"]',
        title: 'Map Y-Axis Field',
        content: 'Select the field for the Y-axis. Choose "Revenue" to display sales revenue.',
        position: 'right'
      },
      {
        id: 'configure-series',
        target: '[data-help-id="series-field"]',
        title: 'Configure Series (Optional)',
        content: 'Add a series field to group data by categories, such as "Product Category".',
        position: 'right'
      },
      {
        id: 'preview-chart',
        target: '[data-help-id="widget-preview"]',
        title: 'Preview Your Chart',
        content: 'Your chart should now appear here! You can see how your data is visualized.',
        position: 'top'
      },
      {
        id: 'customize-appearance',
        target: '[data-help-id="appearance-settings"]',
        title: 'Customize Appearance',
        content: 'Fine-tune colors, labels, and other visual elements to match your design requirements.',
        position: 'left'
      },
      {
        id: 'save-widget',
        target: '[data-help-id="save-button"]',
        title: 'Save Your Widget',
        content: 'Click Save to store your widget configuration. You can also save it as a template for reuse.',
        position: 'top'
      }
    ]
  },

  {
    id: 'data-source-setup',
    name: 'Setting up Data Sources',
    description: 'Learn how to connect and configure data sources for your widgets',
    category: 'data',
    steps: [
      {
        id: 'open-data-sources',
        target: '[data-help-id="data-sources-tab"]',
        title: 'Data Sources Tab',
        content: 'Navigate to the Data Sources section to manage your data connections.',
        position: 'bottom'
      },
      {
        id: 'add-new-source',
        target: '[data-help-id="add-data-source"]',
        title: 'Add New Data Source',
        content: 'Click here to add a new data source. You can connect to APIs, databases, or upload files.',
        position: 'left'
      },
      {
        id: 'configure-connection',
        target: '[data-help-id="connection-config"]',
        title: 'Configure Connection',
        content: 'Enter your connection details such as API endpoint, authentication, or database credentials.',
        position: 'right'
      },
      {
        id: 'test-connection',
        target: '[data-help-id="test-connection"]',
        title: 'Test Connection',
        content: 'Always test your connection to ensure data can be retrieved successfully.',
        position: 'top'
      },
      {
        id: 'preview-data',
        target: '[data-help-id="data-preview"]',
        title: 'Preview Data',
        content: 'Review the data structure and fields available from your data source.',
        position: 'top'
      },
      {
        id: 'save-data-source',
        target: '[data-help-id="save-data-source"]',
        title: 'Save Data Source',
        content: 'Save your data source configuration to make it available for widget creation.',
        position: 'left'
      }
    ]
  },

  {
    id: 'layout-management-tour',
    name: 'Managing Widget Layouts',
    description: 'Learn how to arrange widgets in responsive grid layouts',
    category: 'layout',
    steps: [
      {
        id: 'layout-overview',
        target: '[data-help-id="layout-manager"]',
        title: 'Layout Manager',
        content: 'This is where you arrange your widgets in a responsive grid system.',
        position: 'bottom'
      },
      {
        id: 'grid-system',
        target: '[data-help-id="grid-container"]',
        title: 'Grid System',
        content: 'Our 12-column grid system adapts to different screen sizes automatically.',
        position: 'top'
      },
      {
        id: 'drag-drop',
        target: '[data-help-id="widget-placeholder"]',
        title: 'Drag & Drop',
        content: 'Drag widgets from the sidebar and drop them into the grid positions.',
        position: 'right'
      },
      {
        id: 'resize-widgets',
        target: '[data-help-id="resize-handle"]',
        title: 'Resize Widgets',
        content: 'Use the resize handles to adjust widget dimensions within the grid.',
        position: 'left'
      },
      {
        id: 'responsive-preview',
        target: '[data-help-id="responsive-controls"]',
        title: 'Responsive Preview',
        content: 'Use these controls to preview how your layout looks on different devices.',
        position: 'bottom'
      },
      {
        id: 'spacing-controls',
        target: '[data-help-id="spacing-controls"]',
        title: 'Spacing Controls',
        content: 'Adjust margins and padding between widgets for optimal visual balance.',
        position: 'left'
      }
    ]
  },

  {
    id: 'template-workflow',
    name: 'Working with Templates',
    description: 'Learn how to create, save, and reuse widget templates',
    category: 'templates',
    steps: [
      {
        id: 'template-library',
        target: '[data-help-id="template-library"]',
        title: 'Template Library',
        content: 'Access pre-built templates and your saved configurations here.',
        position: 'right'
      },
      {
        id: 'browse-templates',
        target: '[data-help-id="template-categories"]',
        title: 'Browse Templates',
        content: 'Templates are organized by category. Browse or search to find what you need.',
        position: 'bottom'
      },
      {
        id: 'preview-template',
        target: '[data-help-id="template-preview"]',
        title: 'Preview Template',
        content: 'Click on any template to see a preview of its configuration and appearance.',
        position: 'left'
      },
      {
        id: 'apply-template',
        target: '[data-help-id="apply-template"]',
        title: 'Apply Template',
        content: 'Use this button to create a new widget based on the selected template.',
        position: 'top'
      },
      {
        id: 'customize-template',
        target: '[data-help-id="widget-configurator"]',
        title: 'Customize Template',
        content: 'After applying a template, you can modify it to fit your specific needs.',
        position: 'right'
      },
      {
        id: 'save-as-template',
        target: '[data-help-id="save-template"]',
        title: 'Save as Template',
        content: 'Save your customized widget as a new template for future use.',
        position: 'left'
      }
    ]
  },

  {
    id: 'advanced-features',
    name: 'Advanced Features Tour',
    description: 'Explore advanced customization and integration options',
    category: 'advanced',
    steps: [
      {
        id: 'advanced-config',
        target: '[data-help-id="advanced-settings"]',
        title: 'Advanced Settings',
        content: 'Access advanced configuration options for power users and developers.',
        position: 'bottom'
      },
      {
        id: 'custom-styling',
        target: '[data-help-id="custom-css"]',
        title: 'Custom Styling',
        content: 'Add custom CSS classes or inline styles to override default appearance.',
        position: 'right'
      },
      {
        id: 'data-transformations',
        target: '[data-help-id="data-transforms"]',
        title: 'Data Transformations',
        content: 'Apply custom JavaScript functions to transform your data before visualization.',
        position: 'left'
      },
      {
        id: 'event-handlers',
        target: '[data-help-id="event-config"]',
        title: 'Event Handlers',
        content: 'Configure custom responses to user interactions like clicks or hovers.',
        position: 'top'
      },
      {
        id: 'api-settings',
        target: '[data-help-id="api-config"]',
        title: 'API Configuration',
        content: 'Fine-tune API requests with custom headers, parameters, and error handling.',
        position: 'right'
      },
      {
        id: 'export-import',
        target: '[data-help-id="export-import"]',
        title: 'Export/Import',
        content: 'Export widget configurations as JSON or import existing configurations.',
        position: 'left'
      }
    ]
  }
];
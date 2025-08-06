import { HelpContent } from '../../../types/help.types';

export const helpContent: HelpContent[] = [
  // Getting Started
  {
    id: 'getting-started-overview',
    title: 'Dashboard Editor Overview',
    category: 'getting-started',
    tags: ['basics', 'introduction', 'overview'],
    searchKeywords: ['dashboard', 'editor', 'start', 'begin', 'overview'],
    content: `
      <p>Welcome to the Dashboard Widget Editor! This powerful tool allows you to create, customize, and manage dashboard widgets for your application.</p>
      
      <h3>Key Features</h3>
      <ul>
        <li><strong>Widget Types:</strong> Choose from various chart types, data tables, KPIs, and custom widgets</li>
        <li><strong>Data Mapping:</strong> Connect your widgets to data sources and configure field mappings</li>
        <li><strong>Layout Management:</strong> Arrange widgets in responsive grid layouts</li>
        <li><strong>Template Library:</strong> Save and reuse widget configurations as templates</li>
        <li><strong>Live Preview:</strong> See your changes in real-time as you edit</li>
      </ul>

      <h3>Getting Started</h3>
      <ol>
        <li>Select a widget type from the Widget Type Selector</li>
        <li>Configure your data source and field mappings</li>
        <li>Customize the widget appearance and behavior</li>
        <li>Preview your widget to see how it looks</li>
        <li>Save as a template for future use</li>
      </ol>

      <div class="help-note info">
        <strong>Tip:</strong> Use the guided tours to learn specific workflows step by step.
      </div>
    `
  },
  
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    category: 'getting-started',
    tags: ['shortcuts', 'keyboard', 'hotkeys'],
    searchKeywords: ['keyboard', 'shortcuts', 'hotkeys', 'keys', 'quick'],
    content: `
      <p>Use these keyboard shortcuts to work more efficiently in the Dashboard Editor:</p>
      
      <h3>Help System</h3>
      <ul>
        <li><code>F1</code> - Toggle Help Mode (shows interactive tooltips)</li>
        <li><code>Ctrl + Shift + H</code> - Open/Close Help Panel</li>
        <li><code>Escape</code> - Close help panel or exit tours</li>
      </ul>

      <h3>General</h3>
      <ul>
        <li><code>Ctrl + S</code> - Save current widget configuration</li>
        <li><code>Ctrl + Z</code> - Undo last action</li>
        <li><code>Ctrl + Y</code> - Redo last action</li>
        <li><code>Ctrl + D</code> - Duplicate selected widget</li>
      </ul>

      <h3>Navigation</h3>
      <ul>
        <li><code>Tab</code> - Navigate between form fields</li>
        <li><code>Shift + Tab</code> - Navigate backwards</li>
        <li><code>Enter</code> - Activate buttons or confirm selections</li>
      </ul>

      <div class="help-note">
        <strong>Note:</strong> Some shortcuts may vary depending on your operating system.
      </div>
    `
  },

  // Widget Configuration
  {
    id: 'widget-types',
    title: 'Widget Types',
    category: 'widgets',
    tags: ['widgets', 'types', 'charts', 'tables'],
    searchKeywords: ['widget', 'chart', 'table', 'kpi', 'gauge', 'types'],
    content: `
      <p>The Dashboard Editor supports various widget types to visualize your data effectively:</p>

      <h3>Chart Widgets</h3>
      <ul>
        <li><strong>Line Chart:</strong> Show trends over time</li>
        <li><strong>Bar Chart:</strong> Compare categories or values</li>
        <li><strong>Pie Chart:</strong> Display proportions and percentages</li>
        <li><strong>Area Chart:</strong> Show cumulative data over time</li>
        <li><strong>Scatter Plot:</strong> Show relationships between variables</li>
      </ul>

      <h3>Data Widgets</h3>
      <ul>
        <li><strong>Data Table:</strong> Display tabular data with sorting and filtering</li>
        <li><strong>KPI Card:</strong> Show key performance indicators</li>
        <li><strong>Metric Tile:</strong> Display single values with context</li>
      </ul>

      <h3>Specialized Widgets</h3>
      <ul>
        <li><strong>Gauge:</strong> Show progress or performance metrics</li>
        <li><strong>Heat Map:</strong> Visualize data density or intensity</li>
        <li><strong>Timeline:</strong> Display events over time</li>
      </ul>

      <div class="help-note info">
        <strong>Tip:</strong> Choose the widget type that best represents your data story.
      </div>
    `
  },

  {
    id: 'data-mapping',
    title: 'Data Source Mapping',
    category: 'widgets',
    tags: ['data', 'mapping', 'fields', 'source'],
    searchKeywords: ['data', 'mapping', 'source', 'fields', 'connect'],
    content: `
      <p>Connect your widgets to data sources and map fields to create meaningful visualizations:</p>

      <h3>Data Source Types</h3>
      <ul>
        <li><strong>API Endpoints:</strong> Connect to REST APIs</li>
        <li><strong>Database Queries:</strong> Use SQL queries</li>
        <li><strong>Static Data:</strong> Upload CSV or JSON files</li>
        <li><strong>Real-time Streams:</strong> Connect to live data feeds</li>
      </ul>

      <h3>Field Mapping</h3>
      <ol>
        <li>Select your data source</li>
        <li>Preview the available fields</li>
        <li>Map fields to widget properties:
          <ul>
            <li><strong>X-Axis:</strong> Categorical or time data</li>
            <li><strong>Y-Axis:</strong> Numerical values</li>
            <li><strong>Series:</strong> Data grouping</li>
            <li><strong>Filters:</strong> Data filtering criteria</li>
          </ul>
        </li>
        <li>Configure data transformations if needed</li>
      </ol>

      <h3>Data Transformations</h3>
      <ul>
        <li><strong>Aggregation:</strong> Sum, average, count, min, max</li>
        <li><strong>Filtering:</strong> Include/exclude data based on criteria</li>
        <li><strong>Sorting:</strong> Order data by specific fields</li>
        <li><strong>Grouping:</strong> Group data by categories</li>
      </ul>

      <pre><code>// Example data mapping configuration
{
  "dataSource": "sales-api",
  "fields": {
    "x": "date",
    "y": "revenue",
    "series": "product_category",
    "filter": "region"
  },
  "transformations": {
    "aggregation": "sum",
    "groupBy": "month"
  }
}</code></pre>
    `
  },

  // Layout and Design
  {
    id: 'layout-management',
    title: 'Layout Management',
    category: 'layout',
    tags: ['layout', 'grid', 'responsive', 'arrangement'],
    searchKeywords: ['layout', 'grid', 'arrange', 'position', 'responsive'],
    content: `
      <p>Arrange your widgets in responsive grid layouts that work across all screen sizes:</p>

      <h3>Grid System</h3>
      <ul>
        <li><strong>12-Column Grid:</strong> Flexible column-based layout</li>
        <li><strong>Responsive Breakpoints:</strong> Adapt to different screen sizes</li>
        <li><strong>Drag & Drop:</strong> Easy widget positioning</li>
        <li><strong>Auto-resize:</strong> Widgets adjust to available space</li>
      </ul>

      <h3>Layout Controls</h3>
      <ul>
        <li><strong>Widget Size:</strong> Set width and height in grid units</li>
        <li><strong>Position:</strong> Specify exact grid coordinates</li>
        <li><strong>Spacing:</strong> Control gaps between widgets</li>
        <li><strong>Alignment:</strong> Align widgets within their containers</li>
      </ul>

      <h3>Responsive Behavior</h3>
      <ul>
        <li><strong>Desktop (1200px+):</strong> Full 12-column layout</li>
        <li><strong>Tablet (768px-1199px):</strong> Adaptive column count</li>
        <li><strong>Mobile (767px and below):</strong> Single column stack</li>
      </ul>

      <div class="help-note warning">
        <strong>Best Practice:</strong> Test your layouts on different screen sizes to ensure optimal user experience.
      </div>
    `
  },

  // Templates
  {
    id: 'template-library',
    title: 'Template Library',
    category: 'templates',
    tags: ['templates', 'library', 'save', 'reuse'],
    searchKeywords: ['template', 'library', 'save', 'reuse', 'presets'],
    content: `
      <p>Save and reuse widget configurations as templates to speed up dashboard creation:</p>

      <h3>Creating Templates</h3>
      <ol>
        <li>Configure your widget completely</li>
        <li>Click "Save as Template" in the widget configurator</li>
        <li>Provide a descriptive name and category</li>
        <li>Add tags for easy searching</li>
        <li>Save the template to your library</li>
      </ol>

      <h3>Using Templates</h3>
      <ol>
        <li>Open the Template Library</li>
        <li>Browse or search for templates</li>
        <li>Preview template configurations</li>
        <li>Apply template to create new widget</li>
        <li>Customize as needed for your specific use case</li>
      </ol>

      <h3>Template Categories</h3>
      <ul>
        <li><strong>Sales Dashboards:</strong> Revenue, performance, forecasting</li>
        <li><strong>Analytics:</strong> User behavior, conversion funnels</li>
        <li><strong>Operations:</strong> KPIs, monitoring, alerts</li>
        <li><strong>Financial:</strong> Budget tracking, expense analysis</li>
        <li><strong>Custom:</strong> Your organization-specific templates</li>
      </ul>

      <h3>Sharing Templates</h3>
      <ul>
        <li><strong>Export:</strong> Save templates as JSON files</li>
        <li><strong>Import:</strong> Load templates from files</li>
        <li><strong>Team Library:</strong> Share templates with your team</li>
      </ul>
    `
  },

  // Advanced Features
  {
    id: 'advanced-configuration',
    title: 'Advanced Configuration',
    category: 'advanced',
    tags: ['advanced', 'configuration', 'customization'],
    searchKeywords: ['advanced', 'custom', 'configuration', 'api', 'scripting'],
    content: `
      <p>Advanced configuration options for power users:</p>

      <h3>Custom Styling</h3>
      <ul>
        <li><strong>CSS Classes:</strong> Apply custom CSS classes</li>
        <li><strong>Inline Styles:</strong> Override default styling</li>
        <li><strong>Theme Variables:</strong> Use design system tokens</li>
        <li><strong>Conditional Formatting:</strong> Style based on data values</li>
      </ul>

      <h3>Scripting and Logic</h3>
      <ul>
        <li><strong>Data Transformations:</strong> Custom JavaScript functions</li>
        <li><strong>Event Handlers:</strong> Respond to user interactions</li>
        <li><strong>Computed Fields:</strong> Derive values from existing data</li>
        <li><strong>Conditional Logic:</strong> Show/hide based on conditions</li>
      </ul>

      <h3>API Integration</h3>
      <ul>
        <li><strong>Custom Headers:</strong> Authentication and metadata</li>
        <li><strong>Request Parameters:</strong> Dynamic query parameters</li>
        <li><strong>Response Processing:</strong> Transform API responses</li>
        <li><strong>Error Handling:</strong> Graceful error management</li>
      </ul>

      <pre><code>// Example custom transformation
function transformData(data) {
  return data.map(item => ({
    ...item,
    revenue_usd: item.revenue * 1.2, // Convert to USD
    growth_rate: calculateGrowth(item.current, item.previous)
  }));
}</code></pre>

      <div class="help-note error">
        <strong>Warning:</strong> Advanced features require JavaScript knowledge and should be tested thoroughly.
      </div>
    `
  },

  // Troubleshooting
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    category: 'help',
    tags: ['troubleshooting', 'issues', 'problems', 'errors'],
    searchKeywords: ['troubleshooting', 'problem', 'error', 'issue', 'bug', 'fix'],
    content: `
      <p>Common issues and their solutions:</p>

      <h3>Data Issues</h3>
      <ul>
        <li><strong>No Data Showing:</strong>
          <ul>
            <li>Check data source connectivity</li>
            <li>Verify field mappings are correct</li>
            <li>Ensure data source returns results</li>
          </ul>
        </li>
        <li><strong>Incorrect Chart Display:</strong>
          <ul>
            <li>Verify data types match widget requirements</li>
            <li>Check for null or undefined values</li>
            <li>Review aggregation settings</li>
          </ul>
        </li>
      </ul>

      <h3>Performance Issues</h3>
      <ul>
        <li><strong>Slow Loading:</strong>
          <ul>
            <li>Optimize data queries</li>
            <li>Implement data pagination</li>
            <li>Use appropriate chart types for data size</li>
          </ul>
        </li>
        <li><strong>Browser Freezing:</strong>
          <ul>
            <li>Reduce data points in charts</li>
            <li>Enable data sampling</li>
            <li>Use virtualization for large tables</li>
          </ul>
        </li>
      </ul>

      <h3>Layout Issues</h3>
      <ul>
        <li><strong>Widgets Overlapping:</strong>
          <ul>
            <li>Check grid positioning</li>
            <li>Ensure adequate spacing</li>
            <li>Review responsive settings</li>
          </ul>
        </li>
        <li><strong>Responsive Problems:</strong>
          <ul>
            <li>Test on actual devices</li>
            <li>Adjust breakpoint settings</li>
            <li>Simplify layouts for mobile</li>
          </ul>
        </li>
      </ul>

      <h3>Getting Help</h3>
      <ul>
        <li>Use the browser console to check for errors</li>
        <li>Enable debug mode for detailed logging</li>
        <li>Contact support with error details and screenshots</li>
      </ul>
    `
  }
];
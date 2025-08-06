import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.scss"; // Includes Tailwind and widget-specific styles
import { registerCustomComponents } from "./services/chartTemplate/registerCustomComponents";

// Global error handler for Chart.js errors
window.addEventListener('error', (event) => {
  if (event.error?.stack?.includes('chart.js') || event.error?.message?.includes('spacing')) {
    console.error('[Bootstrap] Caught Chart.js error:', {
      message: event.error.message,
      stack: event.error.stack,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      timestamp: new Date().toISOString()
    });
    
    // Store for debugging
    (window as any).__lastChartError = {
      error: event.error,
      timestamp: new Date().toISOString()
    };
    
    // Prevent default error handling to avoid crashes
    event.preventDefault();
  }
});


// Import and register Chart.js globally with ALL necessary controllers
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  RadialLinearScale,
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  PointElement, 
  LineElement, 
  ArcElement, 
  Filler,
  // Controllers - CRITICAL for preventing "spacing" error
  PieController,
  DoughnutController,
  BarController,
  LineController,
  ScatterController,
  BubbleController,
  PolarAreaController,
  RadarController
} from 'chart.js';

// Define the element options guard plugin
const elementOptionsGuardPlugin = {
  id: 'elementOptionsGuard',
  
  // USE afterUpdate INSTEAD OF beforeEvent
  // This is executed every time the chart has been drawn/updated.
  afterUpdate(chart: any, args: any, options: any) {
    try {
      const metaData = chart.getSortedVisibleDatasetMetas();
      
      metaData.forEach((meta: any) => {
        if (meta.data && Array.isArray(meta.data)) {
          meta.data.forEach((element: any) => {
            if (element && !element.options) {
              console.warn('[PluginGuard-afterUpdate] Found element without options. Applying defaults.', {
                element: element,
                type: element.constructor?.name
              });
              // Apply defaults taken from the chart configuration itself
              element.options = chart.options.elements[element.constructor.id] || {
                 spacing: 0,
                 borderWidth: 1,
                 borderAlign: 'center'
              };
            }
          });
        }
      });
    } catch (e) {
      console.error('Error in afterUpdate plugin', e);
    }
  }
};

// Wrap Chart.js registration in try-catch to prevent crashes
try {
  // Register FIRST our security plugin
  ChartJS.register(elementOptionsGuardPlugin);
  console.log('[Bootstrap] Security plugin for elements registered.');
  
  // Then register all components including controllers
  ChartJS.register(
    // Scales
    CategoryScale, 
    LinearScale,
    RadialLinearScale,
    // Elements
    BarElement, 
    PointElement, 
    LineElement,
    ArcElement,
    // Plugins
    Title, 
    Tooltip, 
    Legend,
    Filler,
    // Controllers - MUST be registered for each chart type
    PieController,
    DoughnutController,
    BarController,
    LineController,
    ScatterController,
    BubbleController,
    PolarAreaController,
    RadarController
  );
  console.log('[Dashboard] Chart.js components and controllers registered successfully');
  
  // Set default options for arc elements to prevent spacing errors
  ChartJS.defaults.elements.arc = {
    ...ChartJS.defaults.elements.arc,
    spacing: 0,
    borderWidth: 1,
    borderAlign: 'center' as const
  };
  console.log('[Dashboard] Default arc element options set');
} catch (error) {
  console.error('[Dashboard] Failed to register Chart.js components:', error);
}

// Make Chart.js available globally for HTML scripts from backend
if (typeof window !== 'undefined') {
  (window as any).Chart = ChartJS;
  console.log('[Bootstrap] Chart.js made available globally');
}

// Register custom components for chart templates
try {
  registerCustomComponents();
  console.log('[Dashboard] Custom components registered successfully');
} catch (error) {
  console.error('[Dashboard] Failed to register custom components:', error);
}

// Initialize Chart.js error prevention after everything is set up
import('./utils/chartErrorPrevention').then(({ chartErrorPrevention }) => {
  chartErrorPrevention.initialize();
  console.log('[Dashboard] Chart.js error prevention initialized');
}).catch(error => {
  console.error('[Dashboard] Failed to initialize chart error prevention:', error);
});

// Remove any external Dashboard title from module federation if present
if (typeof document !== 'undefined') {
  // Add global styles to hide external titles
  const style = document.createElement('style');
  style.textContent = `
    /* Hide any h1 with exactly "Dashboard" text that's not in our component */
    h1:not(.dashboard-header h1):not(.dashboard-content h1) {
      display: none !important;
    }
    
    /* More aggressive hiding for red Dashboard title */
    body > h1,
    #root > h1,
    body > div > h1:first-child,
    [style*="color: red"] h1,
    h1[style*="color: red"] {
      display: none !important;
    }
    
    /* Hide Debug Panel */
    [class*="debug-panel"],
    [class*="debugPanel"],
    [class*="debug-console"],
    [id*="debug-panel"],
    [id*="debugPanel"],
    div:has(> div:contains("Debug Panel")),
    .debug-panel,
    #debug-panel {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
  
  // Also try to hide dynamically
  const hideExternalElements = () => {
    // Hide Dashboard title
    const allH1s = document.querySelectorAll('h1');
    allH1s.forEach(h1 => {
      if (h1.textContent?.trim() === 'Dashboard' && 
          !h1.closest('.dashboard-header') && 
          !h1.closest('.dashboard-content')) {
        h1.style.display = 'none';
        h1.remove(); // Remove it completely
      }
    });
    
    // Hide Debug Panel
    const debugPanels = document.querySelectorAll('[class*="debug"], [id*="debug"], div:has(button:contains("Clear"))');
    debugPanels.forEach(panel => {
      if (panel.textContent?.includes('Debug Panel') || 
          panel.textContent?.includes('DeclarativeChartWidget')) {
        panel.style.display = 'none';
        panel.remove();
      }
    });
    
    // Try to click the close button if it exists
    const closeButtons = document.querySelectorAll('button');
    closeButtons.forEach(btn => {
      if (btn.textContent === '×' || btn.textContent === 'x' || btn.textContent === 'X') {
        const parent = btn.closest('div');
        if (parent && parent.textContent?.includes('Debug Panel')) {
          btn.click();
        }
      }
    });
  };
  
  hideExternalElements();
  document.addEventListener('DOMContentLoaded', hideExternalElements);
  setTimeout(hideExternalElements, 100);
  setTimeout(hideExternalElements, 500);
  setTimeout(hideExternalElements, 1000);
}

const root = createRoot(document.getElementById("root")!);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
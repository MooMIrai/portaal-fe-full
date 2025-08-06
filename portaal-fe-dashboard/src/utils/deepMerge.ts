/**
 * Deep merge utility for safely merging Chart.js options
 * Preserves all original properties while applying style overrides
 */

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Check if a value is a plain object (not array, null, Date, etc.)
 */
function isPlainObject(value: any): boolean {
  if (!value || typeof value !== 'object') return false;
  if (value.constructor === undefined) return true;
  if (value.constructor.prototype !== Object.prototype) return false;
  return true;
}

/**
 * Deep merge two objects, with source overriding target properties
 * Arrays are replaced, not merged
 * Functions and special objects are preserved from source
 */
export function deepMerge<T extends object>(
  target: T,
  source: DeepPartial<T>
): T {
  // Handle null/undefined cases
  if (!source) return target;
  if (!target) return source as T;

  // Create a new object to avoid mutations
  const result = { ...target };

  Object.keys(source).forEach(key => {
    const sourceValue = (source as any)[key];
    const targetValue = (target as any)[key];

    // Skip undefined values in source
    if (sourceValue === undefined) return;

    // If source value is null, use it (allows clearing values)
    if (sourceValue === null) {
      (result as any)[key] = null;
      return;
    }

    // If both values are plain objects, merge recursively
    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      (result as any)[key] = deepMerge(targetValue, sourceValue);
    } else {
      // Otherwise, replace with source value
      // This handles arrays, functions, dates, and primitive values
      (result as any)[key] = sourceValue;
    }
  });

  return result;
}

/**
 * Specialized merge for Chart.js options
 * Ensures critical properties are never lost
 */
export function mergeChartOptions(
  baseOptions: any,
  styleOptions: any
): any {
  // Ensure we have valid objects
  const safeBase = baseOptions || {};
  const safeStyle = styleOptions || {};

  // Perform deep merge
  const merged = deepMerge(safeBase, safeStyle);

  // Ensure critical properties are preserved
  // These should never be removed by style changes
  const criticalProps = [
    'responsive',
    'maintainAspectRatio',
    'onClick',
    'onHover',
    'interaction',
    'animation'
  ];

  criticalProps.forEach(prop => {
    if (safeBase[prop] !== undefined && merged[prop] === undefined) {
      merged[prop] = safeBase[prop];
    }
  });

  // Special handling for scales - ensure they're not completely replaced
  if (safeBase.scales && safeStyle.scales) {
    merged.scales = {};
    
    // Merge each scale individually
    Object.keys(safeBase.scales).forEach(scaleKey => {
      merged.scales[scaleKey] = deepMerge(
        safeBase.scales[scaleKey] || {},
        safeStyle.scales?.[scaleKey] || {}
      );
    });
    
    // Add any new scales from style
    Object.keys(safeStyle.scales || {}).forEach(scaleKey => {
      if (!merged.scales[scaleKey]) {
        merged.scales[scaleKey] = safeStyle.scales[scaleKey];
      }
    });
  }

  // Special handling for plugins
  if (safeBase.plugins && safeStyle.plugins) {
    merged.plugins = {};
    
    // Merge each plugin configuration
    const allPluginKeys = new Set([
      ...Object.keys(safeBase.plugins || {}),
      ...Object.keys(safeStyle.plugins || {})
    ]);
    
    allPluginKeys.forEach(pluginKey => {
      if (safeBase.plugins[pluginKey] || safeStyle.plugins[pluginKey]) {
        merged.plugins[pluginKey] = deepMerge(
          safeBase.plugins[pluginKey] || {},
          safeStyle.plugins[pluginKey] || {}
        );
      }
    });
  }

  // Ensure elements configuration for pie/doughnut charts
  if (merged.elements?.arc && !merged.elements.arc.spacing !== undefined) {
    merged.elements.arc.spacing = merged.elements.arc.spacing ?? 0;
  }

  return merged;
}

/**
 * Extract only style-related properties from chart options
 * This helps identify what should be applied as style vs configuration
 */
export function extractStyleProperties(options: any): any {
  const styleProps = {
    plugins: {
      legend: options.plugins?.legend ? {
        labels: {
          color: options.plugins.legend.labels?.color,
          font: options.plugins.legend.labels?.font
        }
      } : undefined,
      title: options.plugins?.title ? {
        color: options.plugins.title.color,
        font: options.plugins.title.font
      } : undefined,
      tooltip: options.plugins?.tooltip ? {
        backgroundColor: options.plugins.tooltip.backgroundColor,
        titleColor: options.plugins.tooltip.titleColor,
        bodyColor: options.plugins.tooltip.bodyColor,
        borderColor: options.plugins.tooltip.borderColor,
        borderWidth: options.plugins.tooltip.borderWidth
      } : undefined
    },
    scales: {}
  };

  // Extract scale styling
  if (options.scales) {
    Object.keys(options.scales).forEach(scaleKey => {
      const scale = options.scales[scaleKey];
      if (scale) {
        styleProps.scales[scaleKey] = {
          ticks: scale.ticks ? {
            color: scale.ticks.color,
            font: scale.ticks.font
          } : undefined,
          grid: scale.grid ? {
            color: scale.grid.color,
            borderColor: scale.grid.borderColor,
            borderWidth: scale.grid.borderWidth
          } : undefined,
          title: scale.title ? {
            color: scale.title.color,
            font: scale.title.font
          } : undefined
        };
      }
    });
  }

  // Clean up undefined values
  return JSON.parse(JSON.stringify(styleProps));
}
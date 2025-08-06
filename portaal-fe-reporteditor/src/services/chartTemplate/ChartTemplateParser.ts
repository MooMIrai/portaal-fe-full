import React from 'react';
import {
  Chart,
  ChartTitle,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartValueAxis,
  ChartValueAxisItem,
  ChartTooltip,
  ChartArea
} from '@progress/kendo-react-charts';
import { SafeXMLParser, ParsedNode } from './SafeXMLParser';
import { ComponentRegistry } from './ComponentRegistry';

// Create global component registry
const globalRegistry = new ComponentRegistry();

// Register default Kendo Chart components
globalRegistry.registerComponents({
  Chart,
  ChartTitle,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartValueAxis,
  ChartValueAxisItem,
  ChartTooltip,
  ChartArea
});

export interface ChartTemplateParserOptions {
  strict?: boolean;
  allowedComponents?: string[];
}

export class ChartTemplateParser {
  private options: ChartTemplateParserOptions;
  private xmlParser: SafeXMLParser;
  private registry: ComponentRegistry;
  
  constructor(options: ChartTemplateParserOptions = {}) {
    this.options = {
      strict: true,
      allowedComponents: [],
      ...options
    };
    this.xmlParser = new SafeXMLParser();
    this.registry = globalRegistry;
  }

  /**
   * Register a custom component
   */
  registerComponent(name: string, component: React.ComponentType<any>): void {
    this.registry.registerComponent(name, component);
  }

  /**
   * Register multiple custom components
   */
  registerComponents(components: Record<string, React.ComponentType<any>>): void {
    this.registry.registerComponents(components);
  }

  /**
   * Parse a chart template string and return React elements
   */
  parse(template: string, data: any[] | any): React.ReactElement {
    try {
      // Parse the template into a node structure
      const parsedNode = this.xmlParser.parse(template);
      
      // Validate the parsed structure
      this.validateNode(parsedNode);
      
      // Convert to React elements with data
      return this.createReactElement(parsedNode, data);
    } catch (error) {
      console.error('Chart template parsing error:', error);
      throw new Error(`Failed to parse chart template: ${error.message}`);
    }
  }

  /**
   * Validate the parsed node structure
   */
  private validateNode(node: ParsedNode): void {
    if (!this.registry.hasComponent(node.type)) {
      throw new Error(`Component "${node.type}" is not registered. Available components: ${this.registry.getComponentNames().join(', ')}`);
    }

    // Validate children recursively
    if (node.children) {
      node.children.forEach(child => {
        if (typeof child !== 'string') {
          this.validateNode(child);
        }
      });
    }
  }

  /**
   * Create React elements from parsed structure
   */
  private createReactElement(node: ParsedNode, data?: any[]): React.ReactElement {
    const Component = this.registry.getComponent(node.type);
    
    if (!Component) {
      throw new Error(`Component "${node.type}" not found in component registry`);
    }

    // Process props
    const processedProps = this.processProps(node.props, data);
    
    // Add default style to Chart component to ensure it fills container
    if (node.type === 'Chart' && !processedProps.style) {
      processedProps.style = { width: '100%', height: '100%', minHeight: '400px' };
    }

    // Process children
    let children: React.ReactNode = undefined;
    if (node.children && node.children.length > 0) {
      children = node.children.map((child, index) => {
        if (typeof child === 'string') {
          return child;
        }
        return React.cloneElement(
          this.createReactElement(child, data),
          { key: `${child.type}-${index}` }
        );
      });
    }

    return React.createElement(Component, processedProps, children);
  }

  /**
   * Process props and replace placeholders
   */
  private processProps(props: Record<string, any>, data?: any[] | any): Record<string, any> {
    const processed: Record<string, any> = {};

    Object.entries(props).forEach(([key, value]) => {
      if (value && typeof value === 'object' && value.__placeholder) {
        // Replace placeholders based on type
        switch (value.__placeholder) {
          case 'data':
            // If data is an object with 'data' property, use that array
            processed[key] = Array.isArray(data) ? data : (data?.data || data);
            break;
          case 'minDate':
            // Convert mindate to Date object if it's a string
            if (data && !Array.isArray(data) && data.mindate) {
              processed[key] = new Date(data.mindate);
            }
            break;
          case 'maxDate':
            // Convert maxdate to Date object if it's a string
            if (data && !Array.isArray(data) && data.maxdate) {
              processed[key] = new Date(data.maxdate);
            }
            break;
          default:
            processed[key] = value;
        }
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Recursively process nested objects
        processed[key] = this.processProps(value, data);
      } else {
        // Use value as-is
        processed[key] = value;
      }
    });

    return processed;
  }
}

// Export a singleton instance for convenience
export const chartTemplateParser = new ChartTemplateParser();
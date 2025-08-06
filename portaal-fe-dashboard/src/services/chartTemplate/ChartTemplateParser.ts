import React from 'react';
import { SafeXMLParser, ParsedNode } from './SafeXMLParser';
import { ComponentRegistry } from './ComponentRegistry';

// Create global component registry
const globalRegistry = new ComponentRegistry();

// Note: ChartTemplateParser is temporarily disabled as it uses KendoReact components
// This functionality needs to be reimplemented with Chart.js or another charting library

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
   * Currently returns a placeholder as KendoReact components are not available
   */
  parse(template: string, data: any[] | any): React.ReactElement {
    console.warn('ChartTemplateParser is temporarily disabled during migration from KendoReact to Chart.js');
    
    // Return a placeholder component
    return React.createElement('div', {
      style: {
        width: '100%',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        padding: '24px'
      }
    }, 
      React.createElement('div', { style: { textAlign: 'center' } },
        React.createElement('p', { style: { color: '#666', marginBottom: '8px' } }, 
          'Template-based charts temporarily unavailable'
        ),
        React.createElement('p', { style: { color: '#999', fontSize: '14px' } }, 
          'ChartTemplateParser needs to be reimplemented for Chart.js'
        )
      )
    );
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
        // Handle dynamic placeholders with case-insensitive matching
        const placeholderName = value.__placeholder;
        
        // If data is an array, use it directly
        if (Array.isArray(data)) {
          processed[key] = data;
        } else if (data && typeof data === 'object') {
          // Find matching key in data object (case-insensitive)
          const dataKeys = Object.keys(data);
          const matchingKey = dataKeys.find(k => 
            k.toLowerCase() === placeholderName.toLowerCase()
          );
          
          if (matchingKey) {
            const foundValue = data[matchingKey];
            
            console.log(`Placeholder "${placeholderName}" matched with key "${matchingKey}", value:`, foundValue);
            
            // If value looks like an ISO date string, convert to Date object
            if (typeof foundValue === 'string' && 
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(foundValue)) {
              processed[key] = new Date(foundValue);
              console.log(`Converted "${foundValue}" to Date object`);
            } else {
              processed[key] = foundValue;
            }
          } else {
            // Placeholder not found in data
            console.warn(`Placeholder "${placeholderName}" not found in data. Available keys:`, Object.keys(data));
            processed[key] = undefined;
          }
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
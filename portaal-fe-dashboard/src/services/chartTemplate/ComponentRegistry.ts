import React from 'react';

/**
 * Registry for managing allowed components in templates
 */
export class ComponentRegistry {
  private components: Map<string, React.ComponentType<any>>;

  constructor() {
    this.components = new Map();
  }

  /**
   * Register a single component
   */
  registerComponent(name: string, component: React.ComponentType<any>): void {
    if (!name || !component) {
      throw new Error('Component name and component are required');
    }
    this.components.set(name, component);
  }

  /**
   * Register multiple components at once
   */
  registerComponents(components: Record<string, React.ComponentType<any>>): void {
    Object.entries(components).forEach(([name, component]) => {
      this.registerComponent(name, component);
    });
  }

  /**
   * Check if a component is registered
   */
  hasComponent(name: string): boolean {
    return this.components.has(name);
  }

  /**
   * Get a registered component
   */
  getComponent(name: string): React.ComponentType<any> | undefined {
    return this.components.get(name);
  }

  /**
   * Get all registered component names
   */
  getComponentNames(): string[] {
    return Array.from(this.components.keys());
  }

  /**
   * Clear all registered components
   */
  clear(): void {
    this.components.clear();
  }
}
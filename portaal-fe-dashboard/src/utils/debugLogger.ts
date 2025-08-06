/**
 * Advanced debug logging system for dashboard
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  component: string;
  message: string;
  data?: any;
  widgetId?: string;
  error?: Error;
  stack?: string;
}

class DebugLogger {
  private static instance: DebugLogger;
  private logs: LogEntry[] = [];
  private maxLogs = 500;
  private consoleEnabled = true;
  private storageKey = 'dashboardDebugLogs';
  
  private constructor() {
    // Enable debug mode from localStorage or URL params
    const urlParams = new URLSearchParams(window.location.search);
    const debugMode = urlParams.get('debug') === 'true' || 
                     localStorage.getItem('debugMode') === 'true';
    
    if (debugMode) {
      this.enableDebugMode();
    }
    
    // Load existing logs from storage
    this.loadLogsFromStorage();
  }

  static getInstance(): DebugLogger {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger();
    }
    return DebugLogger.instance;
  }

  private loadLogsFromStorage() {
    try {
      const stored = sessionStorage.getItem(this.storageKey);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load debug logs from storage:', e);
    }
  }

  private saveLogsToStorage() {
    try {
      sessionStorage.setItem(this.storageKey, JSON.stringify(this.logs));
    } catch (e) {
      console.error('Failed to save debug logs to storage:', e);
    }
  }

  private formatMessage(entry: LogEntry): string {
    const levelEmoji = {
      [LogLevel.DEBUG]: '🔍',
      [LogLevel.INFO]: 'ℹ️',
      [LogLevel.WARN]: '⚠️',
      [LogLevel.ERROR]: '❌',
      [LogLevel.CRITICAL]: '🚨'
    };
    
    const levelName = LogLevel[entry.level];
    const widgetInfo = entry.widgetId ? ` [Widget: ${entry.widgetId}]` : '';
    
    return `${levelEmoji[entry.level]} [${entry.timestamp}] [${levelName}] [${entry.component}]${widgetInfo} ${entry.message}`;
  }

  private log(level: LogLevel, component: string, message: string, data?: any, widgetId?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      component,
      message,
      data,
      widgetId
    };

    // Add error details if data is an Error
    if (data instanceof Error) {
      entry.error = data;
      entry.stack = data.stack;
    }

    // Add to logs array
    this.logs.push(entry);
    
    // Trim logs if too many
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Save to storage
    this.saveLogsToStorage();

    // Console output if enabled
    if (this.consoleEnabled) {
      const formattedMessage = this.formatMessage(entry);
      
      switch (level) {
        case LogLevel.DEBUG:
          console.log(formattedMessage, data || '');
          break;
        case LogLevel.INFO:
          console.info(formattedMessage, data || '');
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage, data || '');
          break;
        case LogLevel.ERROR:
          console.error(formattedMessage, data || '');
          if (entry.stack) {
            console.error('Stack trace:', entry.stack);
          }
          break;
        case LogLevel.CRITICAL:
          console.error(`🚨🚨🚨 CRITICAL ERROR 🚨🚨🚨`);
          console.error(formattedMessage, data || '');
          if (entry.stack) {
            console.error('Stack trace:', entry.stack);
          }
          break;
      }
    }

    // Emit custom event for monitoring tools
    window.dispatchEvent(new CustomEvent('dashboardLog', { detail: entry }));
  }

  // Public logging methods
  debug(component: string, message: string, data?: any, widgetId?: string) {
    this.log(LogLevel.DEBUG, component, message, data, widgetId);
  }

  info(component: string, message: string, data?: any, widgetId?: string) {
    this.log(LogLevel.INFO, component, message, data, widgetId);
  }

  warn(component: string, message: string, data?: any, widgetId?: string) {
    this.log(LogLevel.WARN, component, message, data, widgetId);
  }

  error(component: string, message: string, data?: any, widgetId?: string) {
    this.log(LogLevel.ERROR, component, message, data, widgetId);
  }

  critical(component: string, message: string, data?: any, widgetId?: string) {
    this.log(LogLevel.CRITICAL, component, message, data, widgetId);
  }

  // Widget-specific logging
  widgetLog(widgetId: string, level: LogLevel, message: string, data?: any) {
    const component = `Widget`;
    this.log(level, component, message, data, widgetId);
  }

  // Get logs
  getLogs(level?: LogLevel, component?: string, widgetId?: string): LogEntry[] {
    let filtered = [...this.logs];
    
    if (level !== undefined) {
      filtered = filtered.filter(l => l.level >= level);
    }
    
    if (component) {
      filtered = filtered.filter(l => l.component === component);
    }
    
    if (widgetId) {
      filtered = filtered.filter(l => l.widgetId === widgetId);
    }
    
    return filtered;
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    this.saveLogsToStorage();
    console.log('Debug logs cleared');
  }

  // Show the debug panel
  showPanel() {
    const panel = document.getElementById('debug-panel');
    if (panel) {
      panel.style.display = 'block';
    }
  }

  // Hide the debug panel (but keep it available)
  hidePanel() {
    const panel = document.getElementById('debug-panel');
    if (panel) {
      panel.style.display = 'none';
    }
  }

  // Toggle the debug panel visibility
  togglePanel() {
    const panel = document.getElementById('debug-panel');
    if (panel) {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
  }

  // Enable/disable console output
  setConsoleEnabled(enabled: boolean) {
    this.consoleEnabled = enabled;
  }

  // Enable debug mode
  enableDebugMode() {
    this.consoleEnabled = true;
    localStorage.setItem('debugMode', 'true');
    console.log('🔧 Debug mode enabled');
    
    // Add debug panel to page
    this.createDebugPanel();
  }

  // Disable debug mode
  disableDebugMode() {
    localStorage.removeItem('debugMode');
    console.log('Debug mode disabled');
    this.removeDebugPanel();
  }

  // Create a floating debug panel
  private createDebugPanel() {
    if (document.getElementById('debug-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'debug-panel';
    panel.innerHTML = `
      <style>
        #debug-panel {
          position: fixed;
          bottom: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 10px;
          border-radius: 5px;
          font-family: monospace;
          font-size: 12px;
          max-width: 400px;
          max-height: 300px;
          overflow-y: auto;
          z-index: 999999;
          display: none; /* Hidden by default, can be shown with debugLogger.showPanel() */
        }
        #debug-panel-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          border-bottom: 1px solid #444;
          padding-bottom: 5px;
        }
        #debug-panel-logs {
          max-height: 250px;
          overflow-y: auto;
        }
        .debug-log-entry {
          margin: 2px 0;
          padding: 2px;
          border-left: 2px solid #666;
          padding-left: 5px;
        }
        .debug-log-error { border-left-color: #ff4444; color: #ff6666; }
        .debug-log-warn { border-left-color: #ffaa00; color: #ffcc44; }
        .debug-log-info { border-left-color: #4444ff; color: #8888ff; }
        .debug-log-debug { border-left-color: #888; color: #aaa; }
      </style>
      <div id="debug-panel-header">
        <span>🔧 Debug Panel</span>
        <button onclick="debugLogger.clearLogs()" style="background: #444; color: white; border: none; padding: 2px 5px; cursor: pointer;">Clear</button>
        <button onclick="debugLogger.removeDebugPanel()" style="background: #444; color: white; border: none; padding: 2px 5px; cursor: pointer; margin-left: 5px;">×</button>
      </div>
      <div id="debug-panel-logs"></div>
    `;
    
    document.body.appendChild(panel);
    this.updateDebugPanel();
    
    // Update panel every second
    setInterval(() => this.updateDebugPanel(), 1000);
  }

  private removeDebugPanel() {
    const panel = document.getElementById('debug-panel');
    if (panel) {
      panel.remove();
    }
  }

  private updateDebugPanel() {
    const logsContainer = document.getElementById('debug-panel-logs');
    if (!logsContainer) return;

    const recentLogs = this.logs.slice(-20).reverse();
    
    logsContainer.innerHTML = recentLogs.map(log => {
      const levelClass = `debug-log-${LogLevel[log.level].toLowerCase()}`;
      const time = new Date(log.timestamp).toLocaleTimeString();
      const widgetInfo = log.widgetId ? ` [W:${log.widgetId}]` : '';
      return `<div class="debug-log-entry ${levelClass}">${time} [${log.component}]${widgetInfo} ${log.message}</div>`;
    }).join('');
  }

  // Export logs as JSON
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Download logs as file
  downloadLogs() {
    const dataStr = this.exportLogs();
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `dashboard-logs-${new Date().toISOString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
}

// Create singleton instance
const debugLogger = DebugLogger.getInstance();

// Expose to window for debugging
if (typeof window !== 'undefined') {
  (window as any).debugLogger = debugLogger;
}

export { debugLogger, DebugLogger };
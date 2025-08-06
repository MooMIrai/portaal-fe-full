import { ChartConfiguration, ChartType, ChartData, ChartOptions } from 'chart.js';
import { chartStyles, ChartStyleDefinition } from './StyleDefinitions';
import { dropShadowPlugin } from './ChartPlugins';

/**
 * Sistema principale per gestire e applicare gli stili ai grafici
 */
export class ChartStyleSystem {
  private static instance: ChartStyleSystem;
  private currentStyle: string = 'default';
  
  private constructor() {
    // Carica lo stile salvato nel localStorage
    this.loadSavedStyle();
  }
  
  public static getInstance(): ChartStyleSystem {
    if (!ChartStyleSystem.instance) {
      ChartStyleSystem.instance = new ChartStyleSystem();
    }
    return ChartStyleSystem.instance;
  }
  
  /**
   * Ottiene lo stile corrente
   */
  public getCurrentStyle(): string {
    return this.currentStyle;
  }
  
  /**
   * Imposta lo stile corrente e lo salva nel localStorage
   */
  public setCurrentStyle(styleName: string): void {
    if (chartStyles[styleName]) {
      this.currentStyle = styleName;
      this.saveStyle();
    }
  }
  
  /**
   * Carica lo stile salvato dal localStorage
   */
  private loadSavedStyle(): void {
    const savedStyle = localStorage.getItem('dashboard-chart-style');
    if (savedStyle && chartStyles[savedStyle]) {
      this.currentStyle = savedStyle;
    }
  }
  
  /**
   * Salva lo stile corrente nel localStorage
   */
  private saveStyle(): void {
    localStorage.setItem('dashboard-chart-style', this.currentStyle);
  }
  
  /**
   * Crea un gradiente lineare
   */
  private createGradient(
    ctx: CanvasRenderingContext2D, 
    chartArea: any, 
    colors: string[]
  ): CanvasGradient {
    if (!chartArea) return colors[0] as any;
    
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });
    return gradient;
  }
  
  /**
   * Applica lo stile corrente a un dataset di Bar Chart
   */
  public applyBarStyle(
    dataset: any,
    ctx?: CanvasRenderingContext2D,
    chartArea?: any,
    dataIndex?: number
  ): any {
    const style = chartStyles[this.currentStyle];
    if (!style) return dataset;
    
    // Applica i colori
    if (style.useGradient && Array.isArray(style.barColors[0])) {
      // Se gradient ma senza ctx, usa il colore medio del gradient
      if (!ctx || !chartArea) {
        const gradientColors = style.barColors[0];
        dataset.backgroundColor = gradientColors[Math.floor(gradientColors.length / 2)];
      } else {
        dataset.backgroundColor = this.createGradient(ctx, chartArea, style.barColors[0]);
      }
    } else if (style.useDataDriven && typeof style.barColors === 'function') {
      dataset.backgroundColor = style.barColors;
    } else if (Array.isArray(style.barColors)) {
      // Per array di colori, usa modulo per ciclare attraverso i colori
      if (dataIndex !== undefined) {
        dataset.backgroundColor = style.barColors[dataIndex % style.barColors.length];
      } else {
        dataset.backgroundColor = style.barColors;
      }
    } else {
      dataset.backgroundColor = style.barColors;
    }
    
    // Applica i bordi
    if (style.useDataDriven && typeof style.barBorderColors === 'function') {
      dataset.borderColor = style.barBorderColors;
    } else if (style.barBorderColors) {
      if (Array.isArray(style.barBorderColors) && dataIndex !== undefined) {
        dataset.borderColor = style.barBorderColors[dataIndex % style.barBorderColors.length];
      } else {
        dataset.borderColor = style.barBorderColors;
      }
    } else if (Array.isArray(style.barColors) && dataIndex !== undefined) {
      dataset.borderColor = style.barColors[dataIndex % style.barColors.length];
    } else {
      dataset.borderColor = style.barColors;
    }
    
    dataset.borderWidth = style.barBorderWidth ?? 1;
    dataset.borderRadius = style.barBorderRadius ?? 0;
    
    if (style.barThickness) {
      dataset.barThickness = style.barThickness;
    }
    
    if (style.barPercentage) {
      dataset.barPercentage = style.barPercentage;
    }
    
    return dataset;
  }
  
  /**
   * Applica lo stile corrente a un dataset di Line Chart
   */
  public applyLineStyle(
    dataset: any,
    ctx?: CanvasRenderingContext2D,
    chartArea?: any
  ): any {
    const style = chartStyles[this.currentStyle];
    if (!style) return dataset;
    
    dataset.borderColor = style.lineColor;
    
    // Applica il background
    if (style.lineBgGradient) {
      if (!ctx || !chartArea) {
        // Use middle color if no context available
        dataset.backgroundColor = style.lineBgGradient[Math.floor(style.lineBgGradient.length / 2)];
      } else {
        dataset.backgroundColor = this.createGradient(ctx, chartArea, style.lineBgGradient);
      }
      dataset.fill = true;
    } else if (style.lineBgColor) {
      dataset.backgroundColor = style.lineBgColor;
      dataset.fill = style.lineBgColor !== 'transparent';
    }
    
    dataset.tension = style.lineTension ?? 0.1;
    dataset.borderWidth = style.lineBorderWidth ?? 2;
    
    if (style.linePointRadius !== undefined) {
      dataset.pointRadius = style.linePointRadius;
    }
    
    if (typeof style.linePointBackgroundColor === 'function') {
      dataset.pointBackgroundColor = style.linePointBackgroundColor;
    } else if (style.linePointBackgroundColor) {
      dataset.pointBackgroundColor = style.linePointBackgroundColor;
    } else {
      dataset.pointBackgroundColor = style.lineColor;
    }
    
    dataset.pointBorderColor = style.lineColor;
    
    if (style.linePointBorderWidth) {
      dataset.pointBorderWidth = style.linePointBorderWidth;
    }
    
    return dataset;
  }
  
  /**
   * Applica lo stile corrente a un dataset di Pie/Donut Chart
   */
  public applyPieStyle(
    dataset: any,
    ctx?: CanvasRenderingContext2D,
    chartArea?: any
  ): any {
    const style = chartStyles[this.currentStyle];
    if (!style) return dataset;
    
    // Applica i colori
    if (style.pieUseGradient && typeof style.pieColors === 'function') {
      dataset.backgroundColor = style.pieColors;
    } else if (style.pieColors) {
      dataset.backgroundColor = style.pieColors;
    }
    
    // Applica i bordi
    if (style.pieBorderColors) {
      dataset.borderColor = style.pieBorderColors;
    } else if (style.pieBorderColor) {
      dataset.borderColor = style.pieBorderColor;
    } else {
      dataset.borderColor = '#fff';
    }
    
    dataset.borderWidth = style.pieBorderWidth ?? 1;
    dataset.hoverOffset = style.pieHoverOffset ?? 4;
    
    return dataset;
  }
  
  /**
   * Ottiene le opzioni di configurazione per lo stile corrente
   */
  public getStyleOptions(): Partial<ChartOptions> {
    const style = chartStyles[this.currentStyle];
    if (!style) return {};
    
    const options: any = {
      plugins: {
        legend: {
          display: !style.hideLegend
        }
      }
    };
    
    if (style.hideScales) {
      options.scales = {
        x: { display: false },
        y: { display: false }
      };
    }
    
    if (style.animationDuration) {
      options.animation = {
        duration: style.animationDuration
      };
    }
    
    if (style.useDropShadow && style.dropShadowOptions) {
      options.plugins.dropShadow = style.dropShadowOptions;
    }
    
    return options;
  }
  
  /**
   * Ottiene i plugin necessari per lo stile corrente
   */
  public getRequiredPlugins(): any[] {
    const style = chartStyles[this.currentStyle];
    if (!style) return [];
    
    const plugins = [];
    
    if (style.useDropShadow) {
      plugins.push(dropShadowPlugin);
    }
    
    return plugins;
  }
  
  /**
   * Applica lo stile a una configurazione completa del grafico
   */
  public applyStyleToChartConfig(
    config: ChartConfiguration,
    ctx?: CanvasRenderingContext2D,
    chartArea?: any
  ): ChartConfiguration {
    const chartType = config.type;
    
    // Applica lo stile ai dataset
    if (config.data?.datasets) {
      config.data.datasets = config.data.datasets.map((dataset, index) => {
        switch (chartType) {
          case 'bar':
            return this.applyBarStyle(dataset, ctx, chartArea, index);
          case 'line':
            return this.applyLineStyle(dataset, ctx, chartArea);
          case 'pie':
          case 'doughnut':
            return this.applyPieStyle(dataset, ctx, chartArea);
          default:
            return dataset;
        }
      });
    }
    
    // Merge delle opzioni
    const styleOptions = this.getStyleOptions();
    config.options = {
      ...config.options,
      ...styleOptions,
      plugins: {
        ...config.options?.plugins,
        ...styleOptions.plugins
      }
    };
    
    // Aggiungi i plugin richiesti
    const requiredPlugins = this.getRequiredPlugins();
    if (requiredPlugins.length > 0) {
      config.plugins = [...(config.plugins || []), ...requiredPlugins];
    }
    
    return config;
  }
  
  /**
   * Ottiene la definizione dello stile corrente
   */
  public getCurrentStyleDefinition(): ChartStyleDefinition {
    return chartStyles[this.currentStyle] || chartStyles.default;
  }
  
  /**
   * Ottiene tutte le definizioni degli stili disponibili
   */
  public getAllStyles(): Record<string, ChartStyleDefinition> {
    return chartStyles;
  }
}
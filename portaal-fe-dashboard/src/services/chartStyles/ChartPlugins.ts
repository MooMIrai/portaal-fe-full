import { Chart, Plugin } from 'chart.js';

/**
 * Plugin per aggiungere ombre 3D ai grafici
 */
export const dropShadowPlugin: Plugin = {
  id: 'dropShadow',
  beforeDatasetsDraw: (chart: Chart, args: any, options: any) => {
    const { ctx } = chart;
    ctx.save();
    
    // Apply shadow settings
    ctx.shadowColor = options.shadowColor || 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = options.shadowBlur || 20;
    ctx.shadowOffsetX = options.shadowOffsetX || 10;
    ctx.shadowOffsetY = options.shadowOffsetY || 10;
    
    ctx.restore();
  }
};

/**
 * Plugin per effetti glow/neon
 */
export const glowPlugin: Plugin = {
  id: 'glow',
  beforeDatasetsDraw: (chart: Chart, args: any, options: any) => {
    const { ctx } = chart;
    ctx.save();
    
    // Apply glow effect
    ctx.shadowColor = options.glowColor || '#00ffff';
    ctx.shadowBlur = options.glowIntensity || 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.restore();
  }
};

/**
 * Registra tutti i plugin custom
 */
export const registerCustomPlugins = () => {
  Chart.register(dropShadowPlugin, glowPlugin);
};
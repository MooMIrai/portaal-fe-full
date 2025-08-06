import { ChartConfiguration, ChartType, ChartOptions } from 'chart.js';

export interface ChartStyleDefinition {
  name: string;
  description?: string;
  useGradient?: boolean;
  useDataDriven?: boolean;
  useDropShadow?: boolean;
  pieUseGradient?: boolean;
  
  // Bar chart styles
  barColors?: any;
  barBorderColors?: any;
  barBorderWidth?: number;
  barBorderRadius?: number | any;
  barThickness?: number;
  barPercentage?: number;
  
  // Line chart styles
  lineColor?: string;
  lineBgColor?: string;
  lineBgGradient?: string[];
  lineTension?: number;
  lineBorderWidth?: number;
  linePointRadius?: number;
  linePointBackgroundColor?: any;
  linePointBorderWidth?: number;
  
  // Pie/Donut chart styles
  pieColors?: any;
  pieBorderColor?: string;
  pieBorderColors?: string[];
  pieBorderWidth?: number;
  pieHoverOffset?: number;
  
  // Options
  hideLegend?: boolean;
  hideScales?: boolean;
  dropShadowOptions?: any;
  animationDuration?: number;
}

export const chartStyles: Record<string, ChartStyleDefinition> = {
  default: {
    name: 'Default',
    description: 'Stile standard di Chart.js',
    barColors: ['rgba(54, 162, 235, 0.5)'],
    barBorderColors: ['rgba(54, 162, 235, 1)'],
    barBorderWidth: 1,
    barBorderRadius: 0,
    lineColor: 'rgb(75, 192, 192)',
    lineBgColor: 'rgba(75, 192, 192, 0.2)',
    lineTension: 0.1,
    pieColors: [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)'
    ],
    pieBorderWidth: 1
  },
  
  gradient: {
    name: 'Gradient',
    description: 'Gradienti colorati eleganti',
    useGradient: true,
    barColors: [
      ['rgba(54, 162, 235, 0.1)', 'rgba(54, 162, 235, 0.5)', 'rgba(54, 162, 235, 0.9)']
    ],
    barBorderWidth: 0,
    barBorderRadius: 5,
    lineColor: 'rgb(75, 192, 192)',
    lineBgGradient: ['rgba(75, 192, 192, 0)', 'rgba(75, 192, 192, 0.6)'],
    lineTension: 0.4,
    pieColors: [
      'rgba(255, 99, 132, 0.9)',
      'rgba(54, 162, 235, 0.9)',
      'rgba(255, 206, 86, 0.9)',
      'rgba(75, 192, 192, 0.9)',
      'rgba(153, 102, 255, 0.9)',
      'rgba(255, 159, 64, 0.9)'
    ],
    pieBorderWidth: 2,
    pieBorderColor: '#fff'
  },
  
  glass: {
    name: 'Glassmorphism',
    description: 'Effetto vetro trasparente',
    barColors: [
      'rgba(99, 102, 241, 0.35)', 
      'rgba(168, 85, 247, 0.35)', 
      'rgba(236, 72, 153, 0.35)', 
      'rgba(59, 130, 246, 0.35)', 
      'rgba(16, 185, 129, 0.35)', 
      'rgba(245, 158, 11, 0.35)'
    ],
    barBorderColors: [
      'rgba(99, 102, 241, 0.8)', 
      'rgba(168, 85, 247, 0.8)', 
      'rgba(236, 72, 153, 0.8)', 
      'rgba(59, 130, 246, 0.8)', 
      'rgba(16, 185, 129, 0.8)', 
      'rgba(245, 158, 11, 0.8)'
    ],
    barBorderWidth: 2,
    barBorderRadius: 10,
    lineColor: 'rgba(99, 102, 241, 0.9)',
    lineBgColor: 'rgba(99, 102, 241, 0.25)',
    lineTension: 0.4,
    lineBorderWidth: 3,
    pieColors: [
      'rgba(99, 102, 241, 0.4)',
      'rgba(168, 85, 247, 0.4)',
      'rgba(236, 72, 153, 0.4)',
      'rgba(59, 130, 246, 0.4)',
      'rgba(16, 185, 129, 0.4)',
      'rgba(245, 158, 11, 0.4)'
    ],
    pieBorderColor: 'rgba(255, 255, 255, 0.7)',
    pieBorderWidth: 2
  },
  
  neon: {
    name: 'Neon Glow',
    description: 'Colori neon brillanti',
    barColors: ['rgba(0, 255, 255, 0.5)'],
    barBorderColors: ['#00ffff'],
    barBorderWidth: 2,
    barBorderRadius: 5,
    lineColor: '#00ff00',
    lineBgColor: 'rgba(0, 255, 0, 0.2)',
    lineTension: 0.4,
    lineBorderWidth: 3,
    pieColors: [
      'rgba(255, 0, 255, 0.7)',
      'rgba(0, 255, 255, 0.7)',
      'rgba(255, 255, 0, 0.7)',
      'rgba(0, 255, 0, 0.7)',
      'rgba(255, 0, 0, 0.7)',
      'rgba(255, 127, 0, 0.7)'
    ],
    pieBorderColors: ['#ff00ff', '#00ffff', '#ffff00', '#00ff00', '#ff0000', '#ff7f00'],
    pieBorderWidth: 2
  },
  
  material: {
    name: 'Material Design',
    description: 'Colori Material Design di Google',
    barColors: ['#4285F4', '#DB4437', '#F4B400', '#0F9D58', '#AB47BC', '#00ACC1'],
    barBorderWidth: 0,
    barBorderRadius: 4,
    lineColor: '#4285F4',
    lineBgColor: 'rgba(66, 133, 244, 0.1)',
    lineTension: 0.4,
    lineBorderWidth: 2,
    pieColors: ['#4285F4', '#DB4437', '#F4B400', '#0F9D58', '#AB47BC', '#00ACC1'],
    pieBorderWidth: 0
  },
  
  neumorphism: {
    name: 'Neumorphism',
    description: 'Effetto 3D morbido',
    barColors: ['#9baacf', '#8d9db5', '#8093a8', '#7485a0', '#677898', '#5a6a8f'],
    barBorderWidth: 0,
    barBorderRadius: 10,
    lineColor: '#7485a0',
    lineBgColor: 'rgba(116, 133, 160, 0.3)',
    lineTension: 0.4,
    lineBorderWidth: 3,
    pieColors: ['#9baacf', '#8d9db5', '#8093a8', '#7485a0', '#677898', '#5a6a8f'],
    pieBorderWidth: 0
  },
  
  minimal: {
    name: 'Minimal',
    description: 'Design minimalista',
    barColors: ['#000000'],
    barBorderWidth: 0,
    barBorderRadius: 0,
    barThickness: 2,
    lineColor: '#000000',
    lineBgColor: 'transparent',
    lineTension: 0,
    lineBorderWidth: 1,
    linePointRadius: 0,
    pieColors: ['#000', '#2d2d2d', '#404040', '#595959', '#737373', '#8c8c8c'],
    pieBorderWidth: 5,
    pieBorderColor: '#ffffff',
    hideLegend: true,
    hideScales: true
  },
  
  dark: {
    name: 'Dark Mode',
    description: 'Tema scuro con colori vivaci',
    barColors: [
      'rgba(139, 92, 246, 0.8)',
      'rgba(236, 72, 153, 0.8)',
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)'
    ],
    barBorderColors: [
      'rgb(139, 92, 246)',
      'rgb(236, 72, 153)',
      'rgb(59, 130, 246)',
      'rgb(16, 185, 129)',
      'rgb(245, 158, 11)',
      'rgb(239, 68, 68)'
    ],
    barBorderWidth: 2,
    barBorderRadius: 8,
    lineColor: 'rgb(139, 92, 246)',
    lineBgColor: 'rgba(139, 92, 246, 0.1)',
    lineTension: 0.4,
    lineBorderWidth: 2,
    pieColors: [
      'rgba(139, 92, 246, 0.8)',
      'rgba(236, 72, 153, 0.8)',
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)'
    ],
    pieBorderColor: '#1a1a1a',
    pieBorderWidth: 2
  },
  
  rounded: {
    name: 'Rounded & Colorful',
    description: 'Bordi arrotondati e colori vivaci',
    barColors: [
      'rgba(255, 99, 132, 0.8)',
      'rgba(255, 159, 64, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(153, 102, 255, 0.8)'
    ],
    barBorderWidth: 0,
    barBorderRadius: 20,
    barPercentage: 0.6,
    lineColor: 'rgb(255, 99, 132)',
    lineBgColor: 'rgba(255, 99, 132, 0.2)',
    lineTension: 0.5,
    lineBorderWidth: 3,
    linePointRadius: 8,
    pieColors: [
      'rgba(255, 99, 132, 0.8)',
      'rgba(255, 159, 64, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(104, 132, 245, 0.8)'
    ],
    pieBorderWidth: 5,
    pieBorderColor: '#fff',
    pieHoverOffset: 10
  },
  
  // Advanced Styles
  shadow3d: {
    name: '3D Shadow',
    description: 'Ombre 3D professionali',
    barColors: [
      'rgba(99, 102, 241, 0.9)',
      'rgba(168, 85, 247, 0.9)',
      'rgba(236, 72, 153, 0.9)',
      'rgba(59, 130, 246, 0.9)',
      'rgba(16, 185, 129, 0.9)',
      'rgba(245, 158, 11, 0.9)'
    ],
    barBorderWidth: 0,
    barBorderRadius: 8,
    lineColor: 'rgb(99, 102, 241)',
    lineBgColor: 'rgba(99, 102, 241, 0.2)',
    lineTension: 0.4,
    lineBorderWidth: 3,
    pieColors: [
      'rgba(99, 102, 241, 0.9)',
      'rgba(168, 85, 247, 0.9)',
      'rgba(236, 72, 153, 0.9)',
      'rgba(59, 130, 246, 0.9)',
      'rgba(16, 185, 129, 0.9)',
      'rgba(245, 158, 11, 0.9)'
    ],
    pieBorderWidth: 0,
    useDropShadow: true,
    dropShadowOptions: {
      shadowColor: 'rgba(0, 0, 0, 0.4)',
      shadowBlur: 15,
      shadowOffsetX: 8,
      shadowOffsetY: 8
    }
  },
  
  volume3d: {
    name: 'Volume 3D',
    description: 'Effetto volumetrico con gradienti',
    useGradient: true,
    barColors: [
      ['rgba(240, 147, 251, 0.2)', 'rgba(240, 147, 251, 0.6)', 'rgba(245, 87, 108, 0.9)']
    ],
    barBorderColors: ['rgba(245, 87, 108, 1)'],
    barBorderWidth: 2,
    barBorderRadius: 12,
    lineColor: 'rgb(245, 87, 108)',
    lineBgGradient: ['rgba(240, 147, 251, 0)', 'rgba(245, 87, 108, 0.4)'],
    lineTension: 0.4,
    lineBorderWidth: 3,
    pieColors: [
      'rgba(240, 147, 251, 0.8)',
      'rgba(245, 87, 108, 0.8)',
      'rgba(255, 154, 0, 0.8)',
      'rgba(123, 31, 162, 0.8)',
      'rgba(32, 201, 151, 0.8)',
      'rgba(255, 215, 0, 0.8)'
    ],
    pieBorderWidth: 2,
    pieBorderColor: '#fff',
    useDropShadow: true,
    dropShadowOptions: {
      shadowColor: 'rgba(245, 87, 108, 0.4)',
      shadowBlur: 20,
      shadowOffsetX: 10,
      shadowOffsetY: 15
    }
  },
  
  datadriven: {
    name: 'Data-Driven',
    description: 'Colori basati sui valori dei dati',
    useDataDriven: true,
    barColors: (context: any) => {
      const value = context.parsed?.y || 0;
      if (value > 70) return 'rgba(16, 185, 129, 0.8)';
      if (value > 50) return 'rgba(59, 130, 246, 0.8)';
      if (value > 30) return 'rgba(245, 158, 11, 0.8)';
      return 'rgba(239, 68, 68, 0.8)';
    },
    barBorderColors: (context: any) => {
      const value = context.parsed?.y || 0;
      if (value > 70) return 'rgb(16, 185, 129)';
      if (value > 50) return 'rgb(59, 130, 246)';
      if (value > 30) return 'rgb(245, 158, 11)';
      return 'rgb(239, 68, 68)';
    },
    barBorderWidth: 2,
    barBorderRadius: 6,
    lineColor: 'rgb(79, 172, 254)',
    lineBgColor: 'rgba(79, 172, 254, 0.2)',
    lineTension: 0.3,
    linePointBackgroundColor: (context: any) => {
      const value = context.parsed?.y || 0;
      if (value > 70) return 'rgb(16, 185, 129)';
      if (value > 50) return 'rgb(59, 130, 246)';
      if (value > 30) return 'rgb(245, 158, 11)';
      return 'rgb(239, 68, 68)';
    },
    linePointRadius: 6,
    pieColors: [
      'rgba(79, 172, 254, 0.8)',
      'rgba(0, 242, 254, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)',
      'rgba(153, 102, 255, 0.8)'
    ],
    pieBorderWidth: 2,
    pieBorderColor: '#fff'
  },
  
  dynamicgradient: {
    name: 'Dynamic Gradient',
    description: 'Gradienti dinamici adattivi',
    useGradient: true,
    barColors: [
      ['rgba(67, 233, 123, 0.2)', 'rgba(67, 233, 123, 0.6)', 'rgba(56, 249, 215, 0.9)']
    ],
    barBorderWidth: 0,
    barBorderRadius: 15,
    lineColor: 'rgb(56, 249, 215)',
    lineBgGradient: ['rgba(67, 233, 123, 0.2)', 'rgba(56, 249, 215, 0.7)'],
    lineTension: 0.5,
    lineBorderWidth: 4,
    linePointRadius: 0,
    pieUseGradient: true,
    pieColors: (context: any) => {
      const chart = context.chart;
      const {ctx, chartArea} = chart;
      if (!chartArea) return 'rgba(67, 233, 123, 0.8)';
      
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      const r = Math.min(
        (chartArea.right - chartArea.left) / 2,
        (chartArea.bottom - chartArea.top) / 2
      );
      
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
      gradient.addColorStop(0, 'rgba(67, 233, 123, 0.9)');
      gradient.addColorStop(0.5, 'rgba(56, 249, 215, 0.8)');
      gradient.addColorStop(1, 'rgba(56, 249, 215, 0.5)');
      return gradient;
    },
    pieBorderWidth: 3,
    pieBorderColor: 'rgba(255, 255, 255, 0.8)',
    animationDuration: 2000
  },
  
  advanced3d: {
    name: 'Advanced 3D',
    description: 'Effetti 3D avanzati combinati',
    useGradient: true,
    barColors: [
      ['rgba(250, 112, 154, 0.3)', 'rgba(250, 112, 154, 0.7)', 'rgba(254, 225, 64, 0.9)']
    ],
    barBorderColors: ['rgba(254, 225, 64, 1)'],
    barBorderWidth: 3,
    barBorderRadius: {
      topLeft: 20,
      topRight: 20,
      bottomLeft: 0,
      bottomRight: 0
    },
    lineColor: 'rgb(250, 112, 154)',
    lineBgGradient: ['rgba(250, 112, 154, 0)', 'rgba(254, 225, 64, 0.5)'],
    lineTension: 0.4,
    lineBorderWidth: 4,
    linePointRadius: 8,
    linePointBackgroundColor: 'white',
    linePointBorderWidth: 3,
    pieColors: [
      'rgba(250, 112, 154, 0.9)',
      'rgba(254, 225, 64, 0.9)',
      'rgba(255, 154, 0, 0.9)',
      'rgba(237, 117, 23, 0.9)',
      'rgba(201, 42, 42, 0.9)',
      'rgba(142, 68, 173, 0.9)'
    ],
    pieBorderWidth: 4,
    pieBorderColor: '#fff',
    pieHoverOffset: 15,
    useDropShadow: true,
    dropShadowOptions: {
      shadowColor: 'rgba(250, 112, 154, 0.5)',
      shadowBlur: 25,
      shadowOffsetX: 12,
      shadowOffsetY: 20
    }
  }
};

// Helper per ottenere tutti i nomi degli stili
export const getStyleNames = (): string[] => Object.keys(chartStyles);

// Helper per ottenere lo stile di default
export const getDefaultStyle = (): string => 'default';

// Helper per verificare se uno stile è "avanzato"
export const isAdvancedStyle = (styleName: string): boolean => {
  const advancedStyles = ['shadow3d', 'volume3d', 'datadriven', 'dynamicgradient', 'advanced3d'];
  return advancedStyles.includes(styleName);
};
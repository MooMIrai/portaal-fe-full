import { useEffect, useState, useCallback, useMemo } from 'react';
import { ChartOptions } from 'chart.js';

interface ResponsiveChartOptions {
  baseOptions?: ChartOptions;
  mobileBreakpoint?: number;
  tabletBreakpoint?: number;
}

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

export const useResponsiveChart = ({
  baseOptions = {},
  mobileBreakpoint = 640,
  tabletBreakpoint = 1024,
}: ResponsiveChartOptions = {}) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => ({
    isMobile: window.innerWidth <= mobileBreakpoint,
    isTablet: window.innerWidth > mobileBreakpoint && window.innerWidth <= tabletBreakpoint,
    isDesktop: window.innerWidth > tabletBreakpoint,
    width: window.innerWidth,
    height: window.innerHeight,
  }));

  // Update device info on resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setDeviceInfo({
        isMobile: width <= mobileBreakpoint,
        isTablet: width > mobileBreakpoint && width <= tabletBreakpoint,
        isDesktop: width > tabletBreakpoint,
        width,
        height: window.innerHeight,
      });
    };

    // Debounce resize events
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [mobileBreakpoint, tabletBreakpoint]);

  // Generate responsive chart options
  const responsiveOptions = useMemo<ChartOptions>(() => {
    const { isMobile, isTablet } = deviceInfo;

    // Base responsive configuration
    const options: ChartOptions = {
      ...baseOptions,
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: isMobile ? 10 : isTablet ? 15 : 20,
      },
      plugins: {
        ...baseOptions.plugins,
        legend: {
          ...baseOptions.plugins?.legend,
          display: isMobile ? false : (baseOptions.plugins?.legend?.display ?? true),
          position: isMobile ? 'bottom' : (baseOptions.plugins?.legend?.position ?? 'top'),
          labels: {
            ...baseOptions.plugins?.legend?.labels,
            boxWidth: isMobile ? 12 : isTablet ? 15 : 20,
            padding: isMobile ? 8 : isTablet ? 10 : 15,
            font: {
              ...baseOptions.plugins?.legend?.labels?.font,
              size: isMobile ? 10 : isTablet ? 11 : 12,
            },
          },
        },
        tooltip: {
          ...baseOptions.plugins?.tooltip,
          enabled: true,
          titleFont: {
            ...baseOptions.plugins?.tooltip?.titleFont,
            size: isMobile ? 11 : isTablet ? 12 : 14,
          },
          bodyFont: {
            ...baseOptions.plugins?.tooltip?.bodyFont,
            size: isMobile ? 10 : isTablet ? 11 : 12,
          },
          padding: isMobile ? 8 : isTablet ? 10 : 12,
          cornerRadius: isMobile ? 3 : 4,
        },
        title: {
          ...baseOptions.plugins?.title,
          font: {
            ...baseOptions.plugins?.title?.font,
            size: isMobile ? 14 : isTablet ? 16 : 18,
          },
          padding: isMobile ? 8 : isTablet ? 10 : 15,
        },
      },
    };

    // Scale-specific responsive settings
    if (options.scales) {
      // X-axis configuration
      if (options.scales.x) {
        options.scales.x = {
          ...options.scales.x,
          ticks: {
            ...options.scales.x.ticks,
            maxRotation: isMobile ? 45 : 0,
            minRotation: isMobile ? 45 : 0,
            maxTicksLimit: isMobile ? 5 : isTablet ? 8 : undefined,
            font: {
              ...((options.scales.x.ticks as any)?.font || {}),
              size: isMobile ? 9 : isTablet ? 10 : 11,
            },
            padding: isMobile ? 3 : 5,
          },
          grid: {
            ...options.scales.x.grid,
            display: !isMobile,
            drawBorder: true,
            drawTicks: true,
          },
        };
      }

      // Y-axis configuration
      if (options.scales.y) {
        options.scales.y = {
          ...options.scales.y,
          ticks: {
            ...options.scales.y.ticks,
            maxTicksLimit: isMobile ? 5 : isTablet ? 7 : undefined,
            font: {
              ...((options.scales.y.ticks as any)?.font || {}),
              size: isMobile ? 9 : isTablet ? 10 : 11,
            },
            padding: isMobile ? 3 : 5,
          },
          grid: {
            ...options.scales.y.grid,
            drawBorder: true,
            drawTicks: true,
          },
        };
      }
    }

    // Chart type specific optimizations
    const chartType = (baseOptions as any).type;
    
    if (chartType === 'pie' || chartType === 'doughnut') {
      options.plugins = {
        ...options.plugins,
        legend: {
          ...options.plugins?.legend,
          display: !isMobile, // Hide legend on mobile for pie/doughnut
          position: isMobile ? 'bottom' : isTablet ? 'right' : 'top',
        },
      };
    }

    if (chartType === 'bar') {
      // Adjust bar thickness for mobile
      if (options.datasets) {
        options.datasets = {
          ...options.datasets,
          bar: {
            ...((options.datasets as any)?.bar || {}),
            barThickness: isMobile ? 20 : isTablet ? 30 : undefined,
            maxBarThickness: isMobile ? 30 : isTablet ? 40 : 50,
          },
        };
      }
    }

    return options;
  }, [baseOptions, deviceInfo]);

  // Helper function to format data labels based on device
  const formatDataLabel = useCallback((value: number, maxLength?: number): string => {
    const { isMobile } = deviceInfo;
    
    if (isMobile && maxLength) {
      const stringValue = value.toString();
      if (stringValue.length > maxLength) {
        // Abbreviate large numbers on mobile
        if (value >= 1000000) {
          return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
          return `${(value / 1000).toFixed(1)}K`;
        }
      }
    }
    
    return value.toLocaleString();
  }, [deviceInfo]);

  // Helper function to get optimal chart height
  const getChartHeight = useCallback((): number => {
    const { isMobile, isTablet } = deviceInfo;
    
    if (isMobile) {
      return 250; // Compact height for mobile
    } else if (isTablet) {
      return 350; // Medium height for tablet
    } else {
      return 400; // Full height for desktop
    }
  }, [deviceInfo]);

  // Helper function to get optimal number of data points
  const getOptimalDataPoints = useCallback((totalPoints: number): number => {
    const { isMobile, isTablet } = deviceInfo;
    
    if (isMobile) {
      return Math.min(totalPoints, 10); // Max 10 points on mobile
    } else if (isTablet) {
      return Math.min(totalPoints, 20); // Max 20 points on tablet
    } else {
      return totalPoints; // All points on desktop
    }
  }, [deviceInfo]);

  // Touch event handlers for mobile interactions
  const getTouchHandlers = useCallback(() => {
    if (!deviceInfo.isMobile && !deviceInfo.isTablet) {
      return {};
    }

    return {
      onTouchStart: (e: TouchEvent) => {
        // Handle touch start for tooltips
        e.preventDefault();
      },
      onTouchMove: (e: TouchEvent) => {
        // Handle touch move for pan/zoom
        e.preventDefault();
      },
      onTouchEnd: (e: TouchEvent) => {
        // Handle touch end
        e.preventDefault();
      },
    };
  }, [deviceInfo]);

  return {
    responsiveOptions,
    deviceInfo,
    formatDataLabel,
    getChartHeight,
    getOptimalDataPoints,
    getTouchHandlers,
  };
};

// Export helper function for static chart configuration
export const getResponsiveChartConfig = (
  type: string,
  isMobile: boolean,
  isTablet: boolean
): Partial<ChartOptions> => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: !isMobile || type === 'line',
        position: isMobile ? 'bottom' : 'top',
        labels: {
          boxWidth: isMobile ? 12 : 15,
          font: {
            size: isMobile ? 10 : isTablet ? 11 : 12,
          },
        },
      },
      tooltip: {
        enabled: true,
        mode: 'index' as const,
        intersect: false,
        titleFont: {
          size: isMobile ? 11 : 12,
        },
        bodyFont: {
          size: isMobile ? 10 : 11,
        },
      },
    },
    scales: type !== 'pie' && type !== 'doughnut' ? {
      x: {
        ticks: {
          maxRotation: isMobile ? 45 : 0,
          font: {
            size: isMobile ? 9 : 10,
          },
        },
        grid: {
          display: !isMobile,
        },
      },
      y: {
        ticks: {
          font: {
            size: isMobile ? 9 : 10,
          },
        },
      },
    } : undefined,
  };
};
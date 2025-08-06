import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ChartStyleSystem, ChartStyleDefinition } from '../services/chartStyles';

interface ChartStyleContextValue {
  currentStyle: string;
  styleDefinition: ChartStyleDefinition;
  setStyle: (styleName: string) => void;
  getAllStyles: () => Record<string, ChartStyleDefinition>;
  styleSystem: ChartStyleSystem;
}

export const ChartStyleContext = createContext<ChartStyleContextValue | undefined>(undefined);

export const useChartStyle = (): ChartStyleContextValue => {
  const context = useContext(ChartStyleContext);
  if (!context) {
    throw new Error('useChartStyle must be used within a ChartStyleProvider');
  }
  return context;
};

interface ChartStyleProviderProps {
  children: React.ReactNode;
}

export const ChartStyleProvider: React.FC<ChartStyleProviderProps> = ({ children }) => {
  const styleSystem = ChartStyleSystem.getInstance();
  const [currentStyle, setCurrentStyle] = useState<string>(styleSystem.getCurrentStyle());
  const [styleDefinition, setStyleDefinition] = useState<ChartStyleDefinition>(
    styleSystem.getCurrentStyleDefinition()
  );
  
  const setStyle = useCallback((styleName: string) => {
    styleSystem.setCurrentStyle(styleName);
    setCurrentStyle(styleName);
    setStyleDefinition(styleSystem.getCurrentStyleDefinition());
    
    // Dispatch custom event for style change
    window.dispatchEvent(new CustomEvent('chartStyleChanged', { 
      detail: { style: styleName } 
    }));
  }, [styleSystem]);
  
  const getAllStyles = useCallback(() => {
    return styleSystem.getAllStyles();
  }, [styleSystem]);
  
  // Listen for style changes from other components
  useEffect(() => {
    const handleStyleChange = (event: CustomEvent) => {
      const newStyle = event.detail.style;
      if (newStyle !== currentStyle) {
        setCurrentStyle(newStyle);
        setStyleDefinition(styleSystem.getCurrentStyleDefinition());
      }
    };
    
    window.addEventListener('chartStyleChanged' as any, handleStyleChange);
    
    return () => {
      window.removeEventListener('chartStyleChanged' as any, handleStyleChange);
    };
  }, [currentStyle, styleSystem]);
  
  const value: ChartStyleContextValue = {
    currentStyle,
    styleDefinition,
    setStyle,
    getAllStyles,
    styleSystem
  };
  
  return (
    <ChartStyleContext.Provider value={value}>
      {children}
    </ChartStyleContext.Provider>
  );
};
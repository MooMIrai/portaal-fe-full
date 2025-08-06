import React, { useState, useRef, useEffect } from 'react';
import { useChartStyle } from '../../contexts/ChartStyleContext';
import { isAdvancedStyle } from '../../services/chartStyles';
import { StylePreviewCanvas } from './StylePreviewCanvas';
import './ChartStyleSelector.css';

export const ChartStyleSelector: React.FC = () => {
  const { currentStyle, setStyle, getAllStyles } = useChartStyle();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const styles = getAllStyles();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  const handleStyleSelect = (styleName: string) => {
    console.log(`[ChartStyleSelector] Changing style from ${currentStyle} to ${styleName}`);
    setStyle(styleName);
    setIsOpen(false);
  };
  
  const currentStyleDef = styles[currentStyle];
  
  // Separate base and advanced styles
  const baseStyles = Object.entries(styles).filter(([key]) => !isAdvancedStyle(key));
  const advancedStyles = Object.entries(styles).filter(([key]) => isAdvancedStyle(key));
  
  return (
    <div className="chart-style-selector" ref={dropdownRef}>
      <button
        className="chart-style-selector__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="chart-style-selector__icon">🎨</span>
        <span className="chart-style-selector__label">
          Style: <strong>{currentStyleDef.name}</strong>
        </span>
        <svg
          className={`chart-style-selector__arrow ${isOpen ? 'chart-style-selector__arrow--open' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 4L6 8L10 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="chart-style-selector__dropdown">
          <div className="chart-style-selector__dropdown-inner">
            {/* Base Styles */}
            <div className="chart-style-selector__section">
              <h4 className="chart-style-selector__section-title">Base Styles</h4>
              {baseStyles.map(([key, style]) => (
                <button
                  key={key}
                  className={`chart-style-selector__option ${
                    currentStyle === key ? 'chart-style-selector__option--active' : ''
                  }`}
                  onClick={() => handleStyleSelect(key)}
                >
                  <div className="chart-style-selector__preview">
                    <StylePreviewCanvas styleName={key} width={40} height={30} />
                  </div>
                  <div className="chart-style-selector__option-content">
                    <span className="chart-style-selector__option-name">
                      {style.name}
                    </span>
                    {style.description && (
                      <span className="chart-style-selector__option-desc">
                        {style.description}
                      </span>
                    )}
                  </div>
                  {currentStyle === key && (
                    <svg
                      className="chart-style-selector__check"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M13.5 4.5L6 12L2.5 8.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            
            {/* Advanced Styles */}
            {advancedStyles.length > 0 && (
              <>
                <div className="chart-style-selector__divider">
                  <span className="chart-style-selector__divider-text">Advanced Styles</span>
                </div>
                <div className="chart-style-selector__section">
                  {advancedStyles.map(([key, style]) => (
                    <button
                      key={key}
                      className={`chart-style-selector__option chart-style-selector__option--advanced ${
                        currentStyle === key ? 'chart-style-selector__option--active' : ''
                      }`}
                      onClick={() => handleStyleSelect(key)}
                    >
                      <div className="chart-style-selector__preview">
                        <StylePreviewCanvas styleName={key} width={40} height={30} />
                      </div>
                      <div className="chart-style-selector__option-content">
                        <span className="chart-style-selector__option-name">
                          {style.name}
                          <span className="chart-style-selector__badge">🚀</span>
                        </span>
                        {style.description && (
                          <span className="chart-style-selector__option-desc">
                            {style.description}
                          </span>
                        )}
                      </div>
                      {currentStyle === key && (
                        <svg
                          className="chart-style-selector__check"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M13.5 4.5L6 12L2.5 8.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
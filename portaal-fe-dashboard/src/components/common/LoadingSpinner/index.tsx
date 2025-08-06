import React from 'react';
import clsx from 'clsx';
import './styles.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullscreen?: boolean;
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  fullscreen = false,
  message,
  className
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const spinner = (
    <div className={clsx('loading-spinner-container', className)}>
      <div
        className={clsx(
          'loading-spinner',
          sizeClasses[size],
          'border-2 border-gray-200 border-t-primary-600 rounded-full animate-spin'
        )}
      />
      {message && (
        <p className="loading-spinner-message text-gray-600 mt-3">
          {message}
        </p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="loading-spinner-fullscreen fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
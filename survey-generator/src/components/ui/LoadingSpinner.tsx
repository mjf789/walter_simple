import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };
  
  const glowSizes = {
    small: 'shadow-glow-sm',
    medium: 'shadow-glow',
    large: 'shadow-glow-lg'
  };

  return (
    <div className="flex justify-center items-center">
      <div className="relative">
        {/* Outer glow ring */}
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-accent-blue/20 
                        blur-xl animate-glow-pulse`} />
        
        {/* Spinning ring */}
        <div className={`relative ${sizeClasses[size]} animate-spin rounded-full 
                        bg-gradient-to-r from-accent-glow via-accent-blue to-transparent
                        ${glowSizes[size]}`}>
          <div className="absolute inset-[2px] rounded-full bg-bg-primary" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
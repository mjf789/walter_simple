import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`relative group ${className}`}
      onClick={onClick}
    >
      {/* Glass effect background */}
      <div className="absolute inset-0 bg-glass-medium backdrop-blur-lg rounded-2xl 
                      border border-glass-border shadow-glass
                      transition-all duration-300 group-hover:bg-glass-heavy
                      group-hover:shadow-glow-sm" />
      
      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                      shadow-inner-glow transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
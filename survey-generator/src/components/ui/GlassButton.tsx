import React from 'react';

interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  className = '',
  type = 'button'
}) => {
  const baseClasses = `
    relative px-6 py-3 rounded-xl font-medium text-white
    transition-all duration-200 ease-out
    transform hover:scale-[1.02] active:scale-[0.98]
    focus:outline-none focus:ring-2 focus:ring-accent-glow focus:ring-offset-2 
    focus:ring-offset-bg-primary
  `;
  
  const primaryClasses = `
    bg-gradient-to-r from-accent-blue to-accent-deep
    border border-accent-blue/30
    shadow-glow hover:shadow-glow-lg
    hover:border-accent-glow/50
    before:absolute before:inset-0 before:rounded-xl
    before:bg-gradient-to-r before:from-accent-glow/20 before:to-transparent
    before:opacity-0 hover:before:opacity-100 before:transition-opacity
  `;
  
  const secondaryClasses = `
    bg-glass-medium backdrop-blur-md
    border border-glass-border
    hover:bg-glass-heavy hover:border-accent-blue/30
    hover:shadow-glow-sm
  `;
  
  const variantClasses = variant === 'primary' ? primaryClasses : secondaryClasses;
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${disabledClasses} ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default GlassButton;
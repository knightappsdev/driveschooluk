import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  style
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-primary hover:bg-gradient-primary-hover text-white focus:ring-primary-100',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white focus:ring-secondary-100',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-gradient-primary hover:text-white hover:border-transparent focus:ring-primary-100'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;

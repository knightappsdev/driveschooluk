import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  style
}) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-lg p-6 ${hover ? 'hover:shadow-xl transition-shadow duration-300' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;

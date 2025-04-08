import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  icon, 
  iconPosition = 'left', 
  className = '',
  ...props 
}) => {
  const baseClasses = `btn btn-${variant} ${className}`;
  
  return (
    <button 
      className={baseClasses} 
      onClick={onClick}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <FontAwesomeIcon icon={icon} className="mr-2" />
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <FontAwesomeIcon icon={icon} className="ml-2" />
      )}
    </button>
  );
};

export default Button;
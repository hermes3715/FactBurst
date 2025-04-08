import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IconButton = ({ 
  icon, 
  onClick, 
  className = '', 
  variant = 'default',
  active = false,
  ...props 
}) => {
  const variantClasses = {
    default: 'bg-white text-secondary-600 hover:bg-secondary-100',
    primary: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
    success: 'bg-green-100 text-green-700 hover:bg-green-200',
    danger: 'bg-red-100 text-red-700 hover:bg-red-200',
  };
  
  const activeClasses = active ? 'ring-2 ring-primary-500' : '';
  
  return (
    <button
      className={`icon-button ${variantClasses[variant]} ${activeClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
};

export default IconButton;
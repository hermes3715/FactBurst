import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Loader = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-3xl',
  };
  
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <FontAwesomeIcon 
        icon={faSpinner} 
        className={`animate-spin ${sizeClasses[size]}`} 
      />
    </div>
  );
};

export default Loader;
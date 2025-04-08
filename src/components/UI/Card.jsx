import React from 'react';

const Card = ({ children, className = '', fun = true, ...props }) => {
  return (
    <div 
      className={`card ${fun ? 'card-fun' : ''} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
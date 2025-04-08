import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBook, faRandom, faHeart, faChartLine } from '@fortawesome/free-solid-svg-icons';


const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: faHome, label: 'Categories' },
    { path: '/facts', icon: faBook, label: 'Facts' },
    { path: '/flashcards', icon: faRandom, label: 'Flashcards' },
    { path: '/favorites', icon: faHeart, label: 'Favorites' },
    { path: '/progress', icon: faChartLine, label: 'Progress' }
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-secondary-200 shadow-elegant z-10">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-3 ${
                isActive 
                  ? 'text-primary-600' 
                  : 'text-secondary-500 hover:text-secondary-700'
              }`}
            >
              <FontAwesomeIcon 
                icon={item.icon} 
                className={`text-lg ${isActive ? 'text-primary-600' : ''}`} 
              />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
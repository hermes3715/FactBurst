import React, { useState, useContext, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faMagic, faFire, faTree, faWater, faBolt, faNeuter, faCar, faPalette } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../contexts/ThemeContext';

const ThemeSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, changeTheme, themes } = useContext(ThemeContext);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
 // Map theme IDs to icons with more related names
const themeIcons = {
    light: faSun,      // Light theme -> sun icon
    dark: faMoon,      // Dark theme -> moon icon
    cosmic: faMagic,   // Cosmic theme -> magic wand icon
    sunset: faFire,    // Sunset theme -> fire icon
    forest: faTree,    // Forest theme -> tree icon
    ocean: faWater,    // Ocean theme -> water icon
    neon: faBolt,      // Neon theme -> lightning bolt (neon lights)
    cyberpunk: faNeuter, // Cyberpunk theme -> "neuter" (futuristic tech vibe)
    retro: faCar,    // Retro theme -> retro icon
    pastel: faPalette  // Pastel theme -> palette icon (represents soft, colorful tones)
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`p-2 rounded-full ${currentTheme.cardBg} flex items-center justify-center hover:bg-opacity-90 transition-colors`}
        aria-label="Change theme"
      >
        <FontAwesomeIcon 
          icon={themeIcons[currentTheme.id] || faPalette} 
          className={currentTheme.primaryText}
        />
      </button>
      
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-48 ${currentTheme.cardBg} rounded-md shadow-lg py-1 z-30 backdrop-blur-sm`}>
          {Object.values(themes).map((theme) => (
            <button
              key={theme.id}
              className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                currentTheme.id === theme.id 
                  ? `${currentTheme.primaryColor} text-white` 
                  : `${currentTheme.navText} hover:${currentTheme.primaryText} hover:bg-opacity-10`
              }`}
              onClick={() => {
                changeTheme(theme.id);
                setIsOpen(false);
              }}
            >
              <FontAwesomeIcon 
                icon={themeIcons[theme.id] || faPalette} 
                className="mr-2"
              />
              {theme.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
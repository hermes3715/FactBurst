import React, { createContext, useState, useEffect } from 'react';

// Create theme context
export const ThemeContext = createContext();
// Available themes
const themes = {
    light: {
      id: 'light',
      name: 'Light',
      backgroundColor: 'bg-playful',
      textColor: 'text-gray-800',
      cardBg: 'bg-white/80',
      primaryColor: 'bg-blue-600',
      primaryText: 'text-blue-600',
      buttonHover: 'hover:bg-blue-700',
      navBg: 'bg-white',
      navText: 'text-gray-500',
      navTextActive: 'text-blue-600',
    },
    dark: {
      id: 'dark',
      name: 'Dark',
      backgroundColor: 'bg-playful-dark',
      textColor: 'text-gray-200',
      cardBg: 'bg-gray-800/90',
      primaryColor: 'bg-blue-500',
      primaryText: 'text-blue-400',
      buttonHover: 'hover:bg-blue-600',
      navBg: 'bg-gray-900',
      navText: 'text-gray-400',
      navTextActive: 'text-blue-400',
    },
    cosmic: {
      id: 'cosmic',
      name: 'Cosmic',
      backgroundColor: 'bg-playful-cosmic',
      textColor: 'text-indigo-100',
      cardBg: 'bg-indigo-900/80',
      primaryColor: 'bg-purple-500',
      primaryText: 'text-purple-400',
      buttonHover: 'hover:bg-purple-600',
      navBg: 'bg-indigo-900',
      navText: 'text-indigo-300',
      navTextActive: 'text-purple-400',
    },
    sunset: {
      id: 'sunset',
      name: 'Sunset',
      backgroundColor: 'bg-playful-sunset',
      textColor: 'text-orange-900',
      cardBg: 'bg-amber-50/90',
      primaryColor: 'bg-orange-500',
      primaryText: 'text-orange-600',
      buttonHover: 'hover:bg-orange-600',
      navBg: 'bg-amber-100',
      navText: 'text-orange-700',
      navTextActive: 'text-orange-600',
    },
    forest: {
      id: 'forest',
      name: 'Forest',
      backgroundColor: 'bg-green-800',
      textColor: 'text-green-50',
      cardBg: 'bg-green-700/80',
      primaryColor: 'bg-green-600',
      primaryText: 'text-green-500',
      buttonHover: 'hover:bg-green-700',
      navBg: 'bg-green-900',
      navText: 'text-green-400',
      navTextActive: 'text-green-300',
    },
    ocean: {
      id: 'ocean',
      name: 'Ocean',
      backgroundColor: 'bg-blue-800',
      textColor: 'text-blue-100',
      cardBg: 'bg-blue-700/80',
      primaryColor: 'bg-teal-500',
      primaryText: 'text-teal-400',
      buttonHover: 'hover:bg-teal-600',
      navBg: 'bg-blue-900',
      navText: 'text-blue-400',
      navTextActive: 'text-teal-400',
    },
    neon: {
      id: 'neon',
      name: 'Neon',
      backgroundColor: 'bg-pink-800',
      textColor: 'text-pink-100',
      cardBg: 'bg-pink-700/80',
      primaryColor: 'bg-pink-600',
      primaryText: 'text-pink-500',
      buttonHover: 'hover:bg-pink-700',
      navBg: 'bg-pink-900',
      navText: 'text-pink-400',
      navTextActive: 'text-pink-300',
    },
    cyberpunk: {
      id: 'cyberpunk',
      name: 'Cyberpunk',
      backgroundColor: 'bg-purple-800',
      textColor: 'text-purple-200',
      cardBg: 'bg-purple-700/90',
      primaryColor: 'bg-pink-500',
      primaryText: 'text-pink-400',
      buttonHover: 'hover:bg-pink-600',
      navBg: 'bg-purple-900',
      navText: 'text-purple-400',
      navTextActive: 'text-pink-400',
    },
    retro: {
      id: 'retro',
      name: 'Retro',
      backgroundColor: 'bg-yellow-500',
      textColor: 'text-yellow-800',
      cardBg: 'bg-yellow-300/80',
      primaryColor: 'bg-red-600',
      primaryText: 'text-red-500',
      buttonHover: 'hover:bg-red-700',
      navBg: 'bg-yellow-600',
      navText: 'text-yellow-400',
      navTextActive: 'text-red-500',
    },
    pastel: {
      id: 'pastel',
      name: 'Pastel',
      backgroundColor: 'bg-pink-200',
      textColor: 'text-pink-900',
      cardBg: 'bg-pink-100/90',
      primaryColor: 'bg-blue-400',
      primaryText: 'text-blue-500',
      buttonHover: 'hover:bg-blue-500',
      navBg: 'bg-pink-300',
      navText: 'text-pink-500',
      navTextActive: 'text-blue-500',
    },
  };
  
export const ThemeProvider = ({ children }) => {
  // Get theme from localStorage or default to light
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme && themes[savedTheme] ? savedTheme : 'light';
  });

  // Apply theme to document when it changes
  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove(
      'theme-light', 'theme-dark', 'theme-cosmic', 'theme-sunset'
    );
    
    // Add current theme class
    document.documentElement.classList.add(`theme-${currentTheme}`);
    
    // Save to localStorage
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  // Change theme function
  const changeTheme = (themeId) => {
    if (themes[themeId]) {
      setCurrentTheme(themeId);
    }
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        currentTheme: themes[currentTheme],
        changeTheme,
        themes 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

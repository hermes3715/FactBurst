import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import IconButton from './UI/IconButton';

const LanguageSelector = () => {
  const { language, setLanguage } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Español' }
  ];
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleLanguageChange = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <IconButton 
        icon={faGlobe} 
        onClick={toggleDropdown}
        className="text-primary-600"
        aria-label="Change language"
      />
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`block w-full text-left px-4 py-2 text-sm ${
                language === lang.code 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-secondary-700 hover:bg-secondary-50'
              }`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
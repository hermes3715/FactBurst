import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import FactFlashcards from './FactFlashcards';
import { fetchMultipleRandomFacts } from '../services/api';
import { ThemeContext } from '../contexts/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const FlashcardsView = () => {
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language, addToFavorites, removeFromFavorites, isFavorite } = useContext(AppContext);
  const { currentTheme } = useContext(ThemeContext);
  
  const loadMoreFacts = async () => {
    try {
      const newFacts = await fetchMultipleRandomFacts(5, language);
      
      // Filter out duplicates
      const uniqueNewFacts = newFacts.filter(
        newFact => !facts.some(existingFact => existingFact.id === newFact.id)
      );
      
      setFacts(prev => [...prev, ...uniqueNewFacts]);
    } catch (error) {
      console.error('Error loading more facts:', error);
    }
  };
  
  // Initial load
  useEffect(() => {
    const loadInitialFacts = async () => {
      setIsLoading(true);
      try {
        await loadMoreFacts();
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialFacts();
  }, [language]);
  
  const handleToggleFavorite = (fact) => {
    if (isFavorite(fact.id)) {
      removeFromFavorites(fact.id);
    } else {
      addToFavorites(fact);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <FontAwesomeIcon 
            icon={faSpinner} 
            className={`text-4xl ${currentTheme.primaryText} animate-spin mb-4`} 
          />
          <p className={currentTheme.textColor}>Loading facts...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h2 className={`text-xl font-bold ${currentTheme.textColor} mb-4 text-center`}>
        Fact Flashcards
      </h2>
      <p className={`text-center ${currentTheme.textColor} mb-8 max-w-md mx-auto`}>
        Swipe left/right to navigate, up to favorite, or down to add to collection
      </p>
      
      {facts.length > 0 ? (
        <FactFlashcards 
          facts={facts}
          onLoadMore={loadMoreFacts}
          onToggleFavorite={handleToggleFavorite}
        />
      ) : (
        <div className={`${currentTheme.cardBg} rounded-lg shadow-md p-6 text-center max-w-md mx-auto`}>
          <p className={currentTheme.textColor}>
            No facts available. Please try a different category or language.
          </p>
        </div>
      )}
    </div>
  );
};

export default FlashcardsView;
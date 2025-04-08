import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { fetchMultipleRandomFacts } from '../services/api';
import { AppContext } from '../contexts/AppContext';
import { ThemeContext } from '../contexts/ThemeContext';

const RelatedFacts = ({ currentFact, onSelectFact }) => {
  const [relatedFacts, setRelatedFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language, selectedCategory } = useContext(AppContext);
  const { currentTheme } = useContext(ThemeContext);
  
  const loadRelatedFacts = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you might use AI or a database to find truly related facts
      // For now, we'll just use random facts as a demonstration
      const facts = await fetchMultipleRandomFacts(3, language);
      
      // Filter out the current fact if it happens to be in the results
      const filteredFacts = facts.filter(fact => fact.id !== currentFact.id);
      
      setRelatedFacts(filteredFacts);
    } catch (error) {
      console.error('Error loading related facts:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadRelatedFacts();
  }, [currentFact.id, language]);
  
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-3">
        <h3 className={`text-lg font-medium ${currentTheme.textColor}`}>
          You might also like
        </h3>
        <button
          onClick={loadRelatedFacts}
          disabled={isLoading}
          className={`p-2 rounded-full ${currentTheme.cardBg} text-gray-500 hover:${currentTheme.primaryText}`}
          aria-label="Refresh related facts"
        >
          <FontAwesomeIcon 
            icon={faSync} 
            className={isLoading ? 'animate-spin' : ''} 
          />
        </button>
      </div>
      
      <div className="overflow-x-auto pb-2">
        <div className="flex space-x-4">
          {isLoading ? (
            // Loading skeletons
            [...Array(3)].map((_, i) => (
              <div 
                key={i}
                className={`flex-shrink-0 w-64 h-32 ${currentTheme.cardBg} rounded-lg shadow animate-pulse`}
              ></div>
            ))
          ) : (
            relatedFacts.map(fact => (
              <div
                key={fact.id}
                className={`flex-shrink-0 w-64 ${currentTheme.cardBg} rounded-lg shadow-md p-3 cursor-pointer transform transition-transform hover:-translate-y-1 hover:shadow-lg`}
                onClick={() => onSelectFact(fact)}
              >
                <p className={`${currentTheme.textColor} text-sm line-clamp-3 mb-2`}>
                  {fact.text}
                </p>
                <div className="flex justify-end">
                  <span className={`text-xs ${currentTheme.primaryText} flex items-center`}>
                    Read more
                    <FontAwesomeIcon icon={faChevronRight} className="ml-1 text-xs" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Add custom CSS for line clamp */}
      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default RelatedFacts;

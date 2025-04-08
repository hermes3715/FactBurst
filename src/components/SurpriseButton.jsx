import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice } from '@fortawesome/free-solid-svg-icons';
import { AppContext } from '../contexts/AppContext';
import { fetchRandomFact } from '../services/api';

const SurpriseButton = () => {
  const navigate = useNavigate();
  const { setSelectedCategory, language, setSurpriseFact } = useContext(AppContext);
  
  // Categories to choose from randomly
  const categories = [
    'science', 'history', 'animals', 'geography', 
    'food', 'entertainment', 'sports', 'space', 
    'weird', 'random'
  ];
  
  const handleSurpriseClick = async () => {
    try {
      // Choose a random category
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      setSelectedCategory(randomCategory);
      
      // Fetch a random fact
      const fact = await fetchRandomFact(language);
      
      // Store the fact in context
      setSurpriseFact(fact);
      
      // Navigate to the facts page
      navigate('/facts');
    } catch (error) {
      console.error('Error fetching surprise fact:', error);
    }
  };
  
  return (
    <button
      onClick={handleSurpriseClick}
      className="fixed bottom-24 right-6 z-20 bg-gradient-to-r from-indigo-500 to-purple-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 btn-bounce"
      aria-label="Surprise Me with a Random Fact"
    >
      <FontAwesomeIcon icon={faDice} className="text-xl animate-pulse" />
      
      {/* Tooltip */}
      <span className="absolute top-0 right-full mr-2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Surprise Me!
      </span>
    </button>
  );
};

export default SurpriseButton;
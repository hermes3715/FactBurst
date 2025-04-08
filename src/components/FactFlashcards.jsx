import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faArrowRight, 
  faHeart, 
  faFolderPlus,
  faInfo
} from '@fortawesome/free-solid-svg-icons';
import { useSwipeable } from 'react-swipeable';
import { ThemeContext } from '../contexts/ThemeContext';
import { AppContext } from '../contexts/AppContext';
import { CollectionContext } from '../contexts/CollectionContext';
import CollectionSelector from './CollectionSelector';

/*
Note: This component requires installing framer-motion and react-swipeable:
npm install framer-motion react-swipeable
*/

const FactFlashcards = ({ facts, onLoadMore, currentIndex = 0, onToggleFavorite }) => {
  const [index, setIndex] = useState(currentIndex);
  const [direction, setDirection] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showCollectionSelector, setShowCollectionSelector] = useState(false);
  
  const { currentTheme } = useContext(ThemeContext);
  const { addToFavorites, isFavorite } = useContext(AppContext);
  
  // Get current fact
  const currentFact = facts[index];
  
  // Request more facts when we're close to the end
  useEffect(() => {
    if (index >= facts.length - 2 && onLoadMore) {
      onLoadMore();
    }
  }, [index, facts.length, onLoadMore]);
  
  // Go to previous fact
  const goToPrev = () => {
    if (index > 0) {
      setDirection(-1);
      setIndex(i => i - 1);
    }
  };
  
  // Go to next fact
  const goToNext = () => {
    if (index < facts.length - 1) {
      setDirection(1);
      setIndex(i => i + 1);
    }
  };
  
  // Handle swipe gestures
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goToNext(),
    onSwipedRight: () => goToPrev(),
    onSwipedUp: () => handleFavoriteFact(),
    onSwipedDown: () => setShowCollectionSelector(true),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });
  
  // Toggle favorite status
  const handleFavoriteFact = () => {
    onToggleFavorite(currentFact);
  };
  
  // Variants for animations
  const cardVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8
    })
  };
  
  return (
    <div className="relative overflow-hidden max-w-md mx-auto h-96 flex flex-col">
      {/* Card stack */}
      <div 
        className="relative flex-grow flex items-center justify-center"
        {...swipeHandlers}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentFact?.id || 'empty'}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className={`absolute w-full mx-auto ${currentTheme.cardBg} rounded-xl shadow-xl p-6`}
            style={{ maxWidth: '90%' }}
          >
            {currentFact ? (
              <>
                {/* Card content */}
                <div className="text-center mb-4">
                  <span className={`text-xs uppercase tracking-wider ${currentTheme.primaryText}`}>
                    {currentFact.source || 'Random Fact'}
                  </span>
                </div>
                
                <p className={`${currentTheme.textColor} text-lg text-center mb-6`}>
                  {currentFact.text}
                </p>
                
                {/* Card indicators */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                  {[...Array(Math.min(5, facts.length))].map((_, i) => {
                    // Calculate the relative index
                    const relIndex = index - Math.max(0, index - 2);
                    const displayIndex = i + Math.max(0, index - 2);
                    
                    return (
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          displayIndex === index 
                            ? `w-6 ${currentTheme.primaryColor}` 
                            : `w-2 bg-gray-300`
                        }`}
                      ></div>
                    );
                  })}
                </div>
                
                {/* Swipe hints */}
                {showInfo && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-xl flex flex-col items-center justify-center text-white">
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <span className="w-8 text-center">←</span>
                        <span>Swipe right for previous fact</span>
                      </div>
                      <div className="flex items-center mb-2">
                        <span className="w-8 text-center">→</span>
                        <span>Swipe left for next fact</span>
                      </div>
                      <div className="flex items-center mb-2">
                        <span className="w-8 text-center">↑</span>
                        <span>Swipe up to favorite</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-8 text-center">↓</span>
                        <span>Swipe down to add to collection</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowInfo(false)}
                      className="px-4 py-2 bg-white text-black rounded-md"
                    >
                      Got it
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No facts available</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Controls */}
      <div className="flex justify-between items-center pt-4 px-4">
        <button
          onClick={goToPrev}
          disabled={index === 0}
          className={`p-3 rounded-full ${
            index === 0 
              ? 'bg-gray-200 text-gray-400' 
              : `${currentTheme.cardBg} ${currentTheme.primaryText}`
          }`}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowInfo(true)}
            className={`p-3 rounded-full ${currentTheme.cardBg} text-gray-500`}
          >
            <FontAwesomeIcon icon={faInfo} />
          </button>
          
          <button
            onClick={handleFavoriteFact}
            className={`p-3 rounded-full ${
              currentFact && isFavorite(currentFact.id) 
                ? 'bg-red-100 text-red-600' 
                : `${currentTheme.cardBg} text-gray-500`
            }`}
          >
            <FontAwesomeIcon icon={faHeart} />
          </button>
          
          <button
            onClick={() => setShowCollectionSelector(true)}
            className={`p-3 rounded-full ${currentTheme.cardBg} text-gray-500`}
          >
            <FontAwesomeIcon icon={faFolderPlus} />
          </button>
        </div>
        
        <button
          onClick={goToNext}
          disabled={index === facts.length - 1}
          className={`p-3 rounded-full ${
            index === facts.length - 1 
              ? 'bg-gray-200 text-gray-400' 
              : `${currentTheme.cardBg} ${currentTheme.primaryText}`
          }`}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
      
      {/* Collection selector modal */}
      {showCollectionSelector && currentFact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div onClick={e => e.stopPropagation()}>
            <CollectionSelector 
              fact={currentFact}
              onClose={() => setShowCollectionSelector(false)}
            />
          </div>
        </div>
      )}
      
    </div>
  );
};

export default FactFlashcards;
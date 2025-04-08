// Updated FactReactions.jsx with positioning fixes
import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactionsContext } from '../contexts/ReactionsContext';
import { ThemeContext } from '../contexts/ThemeContext';

const FactReactions = ({ factId }) => {
  const { 
    reactionTypes, 
    addReaction, 
    getFactReactions, 
    getUserReaction,
    getTotalReactions
  } = useContext(ReactionsContext);
  
  const { currentTheme } = useContext(ThemeContext);
  
  const [showReactions, setShowReactions] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState(null);
  const reactionsRef = useRef(null);
  
  // Get this fact's reactions
  const factReactions = getFactReactions(factId);
  const userReaction = getUserReaction(factId);
  const totalReactions = getTotalReactions(factId);
  
  // Get top 3 reactions for display
  const topReactions = Object.entries(factReactions.reactionCounts || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type, count]) => ({ type, count }));
  
  // Handle adding a reaction
  const handleReaction = (reactionType) => {
    addReaction(factId, reactionType);
    setRecentlyAdded(reactionType);
    setShowReactions(false);
    
    // Clear the "recently added" status after animation
    setTimeout(() => {
      setRecentlyAdded(null);
    }, 2000);
  };
  
  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (reactionsRef.current && !reactionsRef.current.contains(event.target)) {
        setShowReactions(false);
      }
    };

    if (showReactions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReactions]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  // Find emoji by reaction type
  const getEmojiByType = (type) => {
    const reaction = reactionTypes.find(r => r.name === type);
    return reaction ? reaction.emoji : '👍';
  };
  
  return (
    <div className="relative" ref={reactionsRef}>
      {/* Popular reactions display - MOVED BELOW the reactions panel to fix z-index issues */}
      {topReactions.length > 0 && !showReactions && (
        <div className="absolute -top-8 left-0 flex space-x-1">
          {topReactions.map(({ type, count }) => (
            <div 
              key={type}
              className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${currentTheme.cardBg} shadow-sm ${
                type === recentlyAdded ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <span>{getEmojiByType(type)}</span>
              <span className="text-gray-600">{count}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Button to toggle reaction panel */}
      <button
        onClick={() => setShowReactions(!showReactions)}
        className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
          userReaction 
            ? `${currentTheme.primaryColor} text-white` 
            : `${currentTheme.cardBg} text-gray-600 hover:bg-gray-100`
        } transition-colors`}
        aria-label="React to this fact"
      >
        {userReaction ? (
          <span className="mr-1.5">{getEmojiByType(userReaction)}</span>
        ) : (
          <span className="mr-1.5">😶</span>
        )}
        <span>
          {userReaction ? 'Your reaction' : totalReactions > 0 ? `${totalReactions} reactions` : 'React'}
        </span>
      </button>
      
      {/* Reaction selector panel - FIXED positioning */}
      <AnimatePresence>
        {showReactions && (
          <motion.div
            className={`fixed bottom-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg ${currentTheme.cardBg} shadow-xl z-50 min-w-[280px] border border-gray-200`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
          >
            {/* Add close button */}
            <button 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowReactions(false)}
            >
              ✕
            </button>
            
            <h3 className="text-center font-medium mb-3">Choose your reaction</h3>
            
            <div className="flex flex-wrap justify-center gap-3">
              {reactionTypes.map((reaction) => (
                <motion.button
                  key={reaction.name}
                  onClick={() => handleReaction(reaction.name)}
                  className={`flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                    userReaction === reaction.name ? 'bg-blue-50 ring-2 ring-blue-500' : ''
                  }`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-2xl">{reaction.emoji}</span>
                  <span className="text-xs mt-1 text-gray-600">{reaction.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Add overlay when reactions panel is open */}
      {showReactions && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowReactions(false)}
        ></div>
      )}
    </div>
  );
};

export default FactReactions;
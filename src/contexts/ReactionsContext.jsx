import React, { createContext, useState, useEffect } from 'react';

export const ReactionsContext = createContext();

export const ReactionsProvider = ({ children }) => {
  // Initialize reactions from localStorage
  const [reactions, setReactions] = useState(() => {
    const savedReactions = localStorage.getItem('factReactions');
    return savedReactions ? JSON.parse(savedReactions) : {};
  });

  // Save reactions to localStorage when they change
  useEffect(() => {
    localStorage.setItem('factReactions', JSON.stringify(reactions));
  }, [reactions]);

  // Available reaction types
  const reactionTypes = [
    { emoji: '🤯', name: 'mind-blown' },
    { emoji: '😂', name: 'funny' },
    { emoji: '🤔', name: 'skeptical' },
    { emoji: '👍', name: 'like' },
    { emoji: '❤️', name: 'love' },
    { emoji: '🧠', name: 'educational' }
  ];

  // Add a reaction to a fact
  const addReaction = (factId, reactionType, userId = 'current-user') => {
    setReactions(prev => {
      // Initialize fact reactions if they don't exist
      const factReactions = prev[factId] || { reactionCounts: {}, userReactions: {} };
      
      // Get user's current reaction if any
      const currentReaction = factReactions.userReactions[userId];
      
      // If user already reacted with this type, remove it (toggle)
      if (currentReaction === reactionType) {
        // Decrement the count for the reaction type
        factReactions.reactionCounts[reactionType] = 
          (factReactions.reactionCounts[reactionType] || 1) - 1;
          
        // If count reaches 0, remove the reaction type
        if (factReactions.reactionCounts[reactionType] <= 0) {
          delete factReactions.reactionCounts[reactionType];
        }
        
        // Remove user's reaction
        delete factReactions.userReactions[userId];
      } else {
        // If user had a different reaction, decrement its count
        if (currentReaction) {
          factReactions.reactionCounts[currentReaction] =
            (factReactions.reactionCounts[currentReaction] || 1) - 1;
            
          // If count reaches 0, remove the reaction type
          if (factReactions.reactionCounts[currentReaction] <= 0) {
            delete factReactions.reactionCounts[currentReaction];
          }
        }
        
        // Add new reaction
        factReactions.reactionCounts[reactionType] = 
          (factReactions.reactionCounts[reactionType] || 0) + 1;
        factReactions.userReactions[userId] = reactionType;
      }
      
      return {
        ...prev,
        [factId]: factReactions
      };
    });
  };

  // Get reactions for a fact
  const getFactReactions = (factId) => {
    return reactions[factId] || { reactionCounts: {}, userReactions: {} };
  };

  // Get user's reaction to a fact
  const getUserReaction = (factId, userId = 'current-user') => {
    const factReactions = reactions[factId];
    return factReactions?.userReactions[userId] || null;
  };

  // Get total reaction count for a fact
  const getTotalReactions = (factId) => {
    const factReactions = reactions[factId];
    if (!factReactions) return 0;
    
    return Object.values(factReactions.reactionCounts).reduce((sum, count) => sum + count, 0);
  };

  return (
    <ReactionsContext.Provider
      value={{
        reactions,
        reactionTypes,
        addReaction,
        getFactReactions,
        getUserReaction,
        getTotalReactions
      }}
    >
      {children}
    </ReactionsContext.Provider>
  );
};
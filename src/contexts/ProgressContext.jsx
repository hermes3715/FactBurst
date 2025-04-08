import React, { createContext, useState, useEffect } from "react";

export const ProgressContext = createContext();

// This tracks the last recorded facts to prevent duplicate counting
const ProgressTrackingUtil = {
    // Set to track recently processed fact IDs (with timestamps)
    recentlyProcessed: new Map(),
    
    // Throttle duration in milliseconds (e.g., 2000ms = 2 seconds)
    throttleDuration: 2000,
    
    // Check if a fact was recently processed and shouldn't be counted again
    wasRecentlyProcessed(factId) {
      if (!this.recentlyProcessed.has(factId)) {
        return false;
      }
      
      const processTime = this.recentlyProcessed.get(factId);
      const now = Date.now();
      
      // If processed within throttle duration, consider it duplicate
      return (now - processTime) < this.throttleDuration;
    },
    
    // Mark a fact as processed
    markAsProcessed(factId) {
      this.recentlyProcessed.set(factId, Date.now());
      
      // Clean up old entries (optional)
      this.cleanupOldEntries();
    },
    
    // Remove old entries to prevent memory leaks
    cleanupOldEntries() {
      const now = Date.now();
      for (const [id, time] of this.recentlyProcessed.entries()) {
        if (now - time > this.throttleDuration * 10) { // 10x throttle time
          this.recentlyProcessed.delete(id);
        }
      }
    }
  };

export const ProgressProvider = ({ children }) => {
  // Initialize progress data from localStorage
  const [progressData, setProgressData] = useState(() => {
    const savedData = localStorage.getItem("factProgressData");
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      viewedFacts: {}, // Record of viewed facts by ID
      viewedByCategory: {}, // Count of viewed facts by category
      categoryTotals: {}, // Estimated total facts per category
      lastUpdated: null, // Last time the data was updated
    };
  });

  // Save progress data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("factProgressData", JSON.stringify(progressData));
  }, [progressData]);

 
  // Set total facts for a category (can be estimated)
  const setCategoryTotal = (category, total) => {
    if (!category) return;

    setProgressData((prev) => ({
      ...prev,
      categoryTotals: {
        ...prev.categoryTotals,
        [category]: total,
      },
    }));
  };

  // Calculate percentage of a category that has been viewed
  const getCategoryProgress = (category) => {
    if (!category) return 0;

    const viewed = progressData.viewedByCategory[category] || 0;
    const total = progressData.categoryTotals[category] || 0;

    if (total === 0) return 0;
    return Math.min(100, Math.round((viewed / total) * 100));
  };

  // Check if a specific fact has been viewed
  const isFactViewed = (factId) => {
    return !!progressData.viewedFacts[factId];
  };

  // Get total facts viewed across all categories
  const getTotalFactsViewed = () => {
    return Object.keys(progressData.viewedFacts).length;
  };

  // Get total facts available across all categories
  const getTotalFactsAvailable = () => {
    return Object.values(progressData.categoryTotals).reduce(
      (sum, val) => sum + val,
      0
    );
  };

  // Get overall progress percentage
  const getOverallProgress = () => {
    const total = getTotalFactsAvailable();
    const viewed = getTotalFactsViewed();

    if (total === 0) return 0;
    return Math.min(100, Math.round((viewed / total) * 100));
  };

  // Reset progress for a category
  const resetCategoryProgress = (category) => {
    if (!category) return;

    setProgressData((prev) => {
      // Create a new viewedFacts object without the specified category
      const newViewedFacts = {};

      Object.values(prev.viewedFacts).forEach((fact) => {
        if (fact.category !== category) {
          newViewedFacts[fact.id] = fact;
        }
      });

      return {
        ...prev,
        viewedFacts: newViewedFacts,
        viewedByCategory: {
          ...prev.viewedByCategory,
          [category]: 0,
        },
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const recordFactView = (fact) => {
    if (!fact || !fact.id) {
      console.warn('Cannot record fact view - missing fact or fact ID');
      return;
    }
  
    console.log('Attempting to record progress for fact:', fact.id);
    
    // Check if this fact was recently processed (throttling)
    if (ProgressTrackingUtil.wasRecentlyProcessed(fact.id)) {
      console.log('Progress already recorded for this fact recently, skipping');
      return;
    }
    
    // Mark this fact as processed
    ProgressTrackingUtil.markAsProcessed(fact.id);
    console.log('Recording progress for fact:', fact.id, 'Category:', fact.category);
  
    // Ensure the category is normalized to match expected values
    let category = fact.category || 'random';
    
    // Normalize category to match your predefined categories
    category = category.toLowerCase();
    if (category === 'technology' || category === 'tech' || category === 'science & tech') category = 'science';
    if (category === 'travel' || category === 'geo') category = 'geography';
    if (category === 'nature') category = 'animals';
    if (category === 'cooking' || category === 'cuisine') category = 'food';
    if (category === 'movies' || category === 'tv') category = 'entertainment';
    if (category === 'astronomy') category = 'space';
    if (category === 'unusual' || category === 'strange') category = 'weird';
    
    // Make sure category is one of our expected values
    const validCategories = [
      'science', 'history', 'animals', 'geography', 'food', 
      'entertainment', 'sports', 'space', 'weird', 'random'
    ];
    
    if (!validCategories.includes(category)) {
      console.warn(`Unknown category "${category}", defaulting to "random"`);
      category = 'random';
    }
  
    setProgressData((prev) => {
      // If fact was already viewed, don't update counts
      if (prev.viewedFacts[fact.id]) {
        console.log('Fact already in history, updating view count only');
        return {
          ...prev,
          viewedFacts: {
            ...prev.viewedFacts,
            [fact.id]: {
              ...prev.viewedFacts[fact.id],
              viewCount: (prev.viewedFacts[fact.id].viewCount || 0) + 1,
              lastViewed: new Date().toISOString(),
            },
          },
        };
      }
  
      console.log(`Adding new fact to category: ${category}`);
      
      // This is a new fact - update category counts
      return {
        ...prev,
        viewedFacts: {
          ...prev.viewedFacts,
          [fact.id]: {
            id: fact.id,
            category,
            firstViewed: new Date().toISOString(),
            lastViewed: new Date().toISOString(),
            viewCount: 1,
          },
        },
        viewedByCategory: {
          ...prev.viewedByCategory,
          [category]: (prev.viewedByCategory[category] || 0) + 1,
        },
        lastUpdated: new Date().toISOString(),
      };
    });
  };
  

  // Initialize default category totals if they don't exist
  useEffect(() => {
    // Default estimates for each category (in a real app, this would come from an API)
    const defaultCategoryTotals = {
      science: 100,
      history: 100,
      animals: 100,
      geography: 100,
      food: 100,
      entertainment: 100,
      sports: 100,
      space: 100,
      weird: 100,
      random: 100,
    };

    setProgressData((prev) => {
      // If we already have category totals, don't overwrite them
      if (Object.keys(prev.categoryTotals).length > 0) {
        return prev;
      }

      return {
        ...prev,
        categoryTotals: defaultCategoryTotals,
      };
    });
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        progressData,
        recordFactView,
        setCategoryTotal,
        getCategoryProgress,
        isFactViewed,
        getTotalFactsViewed,
        getTotalFactsAvailable,
        getOverallProgress,
        resetCategoryProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};


import React, { useState, useContext } from 'react';
import { ProgressContext } from '../contexts/ProgressContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faCheckCircle, 
  faSortAmountUp, 
  faSortAmountDown,
  faSync,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

const ProgressTracker = () => {
  const { 
    progressData, 
    getCategoryProgress,
    getTotalFactsViewed,
    getTotalFactsAvailable,
    getOverallProgress,
    resetCategoryProgress
  } = useContext(ProgressContext);
  
  const { currentTheme } = useContext(ThemeContext);
  
  const [sortOrder, setSortOrder] = useState('progress-desc'); // 'progress-asc', 'progress-desc', 'name-asc', 'name-desc'
  
  // Get all categories with their progress
  const getCategories = () => {
    const categories = [
      { id: 'science', name: 'Science & Technology', icon: '🔬' },
      { id: 'history', name: 'History', icon: '🏛️' },
      { id: 'animals', name: 'Animals & Nature', icon: '🐾' },
      { id: 'geography', name: 'Geography & Travel', icon: '🗺️' },
      { id: 'food', name: 'Food & Cuisine', icon: '🍽️' },
      { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
      { id: 'sports', name: 'Sports', icon: '⚽' },
      { id: 'space', name: 'Space & Astronomy', icon: '🚀' },
      { id: 'weird', name: 'Weird & Unusual', icon: '🤔' },
      { id: 'random', name: 'Random Facts', icon: '🎲' }
    ];
    
    // Add progress data to each category
    return categories.map(category => ({
      ...category,
      progress: getCategoryProgress(category.id),
      viewed: progressData.viewedByCategory[category.id] || 0,
      total: progressData.categoryTotals[category.id] || 0
    }));
  };
  
  // Sort categories based on current sort order
  const getSortedCategories = () => {
    const categories = getCategories();
    
    switch (sortOrder) {
      case 'progress-asc':
        return categories.sort((a, b) => a.progress - b.progress);
      case 'progress-desc':
        return categories.sort((a, b) => b.progress - a.progress);
      case 'name-asc':
        return categories.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return categories.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return categories;
    }
  };
  
  // Toggle sort order
  const toggleSortOrder = () => {
    if (sortOrder === 'progress-desc') {
      setSortOrder('progress-asc');
    } else if (sortOrder === 'progress-asc') {
      setSortOrder('name-asc');
    } else if (sortOrder === 'name-asc') {
      setSortOrder('name-desc');
    } else {
      setSortOrder('progress-desc');
    }
  };
  
  // Get current sort icon
  const getSortIcon = () => {
    if (sortOrder === 'progress-desc' || sortOrder === 'name-desc') {
      return faSortAmountDown;
    }
    return faSortAmountUp;
  };
  
  // Format sort label text
  const getSortLabel = () => {
    if (sortOrder.startsWith('progress')) {
      return 'Progress';
    }
    return 'Name';
  };
  
  // Handle reset progress for a category
  const handleResetCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to reset progress for this category?')) {
      resetCategoryProgress(categoryId);
    }
  };
  
  // Calculate progress colors
  const getProgressColor = (progress) => {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-orange-500';
    if (progress < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  // Formatted date of last update
  const getLastUpdated = () => {
    if (!progressData.lastUpdated) return 'Never';
    
    const date = new Date(progressData.lastUpdated);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Progress-related achievements
  const getProgressAchievements = () => {
    const viewed = getTotalFactsViewed();
    const achievements = [];
    
    if (viewed >= 10) achievements.push('Beginner Fact Collector');
    if (viewed >= 50) achievements.push('Fact Enthusiast');
    if (viewed >= 100) achievements.push('Fact Master');
    if (viewed >= 200) achievements.push('Fact Scholar');
    
    const categories = getCategories();
    const completedCategories = categories.filter(cat => cat.progress >= 100).length;
    
    if (completedCategories >= 1) achievements.push('Category Expert');
    if (completedCategories >= 3) achievements.push('Category Conqueror');
    if (completedCategories >= 5) achievements.push('Master of Knowledge');
    
    return achievements;
  };
  
  const sortedCategories = getSortedCategories();
  const achievements = getProgressAchievements();
  const overallProgress = getOverallProgress();
  const totalViewed = getTotalFactsViewed();
  const totalAvailable = getTotalFactsAvailable();
  
  return (
    <div className="container mx-auto p-4">
      <h2 className={`text-xl font-bold ${currentTheme.textColor} mb-6 text-center`}>
        Your Learning Progress
      </h2>
      
      {/* Overall progress summary */}
      <div className={`${currentTheme.cardBg} rounded-lg shadow-md p-4 mb-6`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-gray-800">Overall Progress</h3>
          <span className="text-sm text-gray-500">
            Last updated: {getLastUpdated()}
          </span>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">
              {totalViewed} / {totalAvailable} Facts
            </span>
            <span className="text-sm font-medium">
              {overallProgress}%
            </span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getProgressColor(overallProgress)}`}
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Achievements */}
        {achievements.length > 0 && (
          <div>
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
              <span className="font-medium">Achievements</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className="bg-green-100 text-green-700 text-xs rounded-full px-3 py-1"
                >
                  {achievement}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Category progress */}
      <div className={`${currentTheme.cardBg} rounded-lg shadow-md p-4`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-800">Category Progress</h3>
          <button
            onClick={toggleSortOrder}
            className="flex items-center text-sm text-gray-600"
          >
            <span className="mr-1">Sort by: {getSortLabel()}</span>
            <FontAwesomeIcon icon={getSortIcon()} />
          </button>
        </div>
        
        {/* Category list */}
        <div className="space-y-4">
          {sortedCategories.map(category => (
            <div key={category.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-xl mr-2">{category.icon}</span>
                  <span className={currentTheme.textColor}>{category.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-3">
                    {category.progress}%
                  </span>
                  <button
                    onClick={() => handleResetCategory(category.id)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Reset progress"
                  >
                    <FontAwesomeIcon icon={faSync} className="text-xs" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden mr-3">
                  <div 
                    className={`h-full ${getProgressColor(category.progress)}`}
                    style={{ width: `${category.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">
                  {category.viewed}/{category.total}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Explanation note */}
        <div className="mt-6 flex items-start text-xs text-gray-500">
          <FontAwesomeIcon icon={faInfoCircle} className="mr-2 mt-0.5" />
          <div>
            Progress is based on estimated total facts for each category. 
            Keep exploring to discover more facts and increase your progress!
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;

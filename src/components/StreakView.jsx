import React, { useContext } from 'react';
import { StreakContext } from '../contexts/StreakContext';
import { ThemeContext } from '../contexts/ThemeContext';
import StreakCalendar from './StreakCalendar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faBook, faChartLine } from '@fortawesome/free-solid-svg-icons';

const StreakView = () => {
  const { streakData } = useContext(StreakContext);
  const { currentTheme } = useContext(ThemeContext);
  
  return (
    <div className="container mx-auto p-4">
      <h2 className={`text-xl font-bold ${currentTheme.textColor} mb-6 text-center`}>
        Your Fact Streak
      </h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`${currentTheme.cardBg} p-4 rounded-lg shadow-md flex flex-col items-center`}>
          <div className={`w-10 h-10 ${currentTheme.primaryColor} rounded-full flex items-center justify-center mb-2`}>
            <FontAwesomeIcon icon={faFire} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-center text-gray-800">
            {streakData.currentStreak}
          </div>
          <div className="text-xs text-center text-gray-500">Day Streak</div>
        </div>
        
        <div className={`${currentTheme.cardBg} p-4 rounded-lg shadow-md flex flex-col items-center`}>
          <div className={`w-10 h-10 ${currentTheme.primaryColor} rounded-full flex items-center justify-center mb-2`}>
            <FontAwesomeIcon icon={faBook} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-center text-gray-800">
            {streakData.totalFacts}
          </div>
          <div className="text-xs text-center text-gray-500">Facts Learned</div>
        </div>
        
        <div className={`${currentTheme.cardBg} p-4 rounded-lg shadow-md flex flex-col items-center`}>
          <div className={`w-10 h-10 ${currentTheme.primaryColor} rounded-full flex items-center justify-center mb-2`}>
            <FontAwesomeIcon icon={faChartLine} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-center text-gray-800">
            {streakData.totalProgress}%
          </div>
          <div className="text-xs text-center text-gray-500">Progress</div>
        </div>
      </div>
      {/* Calendar */}
      <StreakCalendar />
      
      {/* Motivation message */}
      <div className="mt-6 text-center text-gray-600 italic">
        {streakData.currentStreak === 0 ? (
          "Start your streak today by exploring some facts!"
        ) : streakData.currentStreak < 3 ? (
          "Keep going! You're building a great streak."
        ) : streakData.currentStreak < 7 ? (
          `You're on fire! ${7 - streakData.currentStreak} more days until your 7-day streak.`
        ) : (
          "Amazing job maintaining your streak! You're a fact master!"
        )}
      </div>
    </div>
  );
};

export default StreakView;

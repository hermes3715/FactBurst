import React, { useState, useContext, useEffect } from 'react';
import { StreakContext } from '../contexts/StreakContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faTrophy, faAward, faChevronLeft, faChevronRight, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const StreakCalendar = () => {
  const { streakData, getRecentActivity } = useContext(StreakContext);
  const { currentTheme } = useContext(ThemeContext);
  
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [calendarDays, setCalendarDays] = useState([]);
  const [showAchievements, setShowAchievements] = useState(false);
  
  // Generate calendar data when month/year changes
  useEffect(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, date: null });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateStr = date.toISOString().split('T')[0];
      const isVisited = streakData.visitDates[dateStr] > 0;
      const visitCount = streakData.visitDates[dateStr] || 0;
      
      days.push({
        day,
        date: dateStr,
        isVisited,
        visitCount,
        isToday: dateStr === new Date().toISOString().split('T')[0]
      });
    }
    
    setCalendarDays(days);
  }, [currentMonth, currentYear, streakData.visitDates]);
  
  // Handle month navigation
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 0) {
        setCurrentYear(prev => prev - 1);
        return 11;
      }
      return prev - 1;
    });
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 11) {
        setCurrentYear(prev => prev + 1);
        return 0;
      }
      return prev + 1;
    });
  };
  
  // Get month name
  const getMonthName = (month) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[month];
  };
  
  // Format number with ordinal suffix (1st, 2nd, 3rd, etc.)
  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return num + "st";
    if (j === 2 && k !== 12) return num + "nd";
    if (j === 3 && k !== 13) return num + "rd";
    return num + "th";
  };
  
  // Get color intensity based on visit count
  const getColorIntensity = (count) => {
    if (count === 0) return 'bg-gray-100';
    if (count === 1) return `${currentTheme.primaryColor} opacity-30`;
    if (count === 2) return `${currentTheme.primaryColor} opacity-60`;
    return `${currentTheme.primaryColor} opacity-100`;
  };
  
  // Get recent activity stats for heatmap
  const recentActivity = getRecentActivity(7);
  
  return (
    <div className={`${currentTheme.cardBg} rounded-lg shadow-md p-4 max-w-md mx-auto`}>
      {/* Streak stats */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className={`w-12 h-12 ${currentTheme.primaryColor} rounded-full flex items-center justify-center mr-3`}>
            <FontAwesomeIcon icon={faFire} className="text-white text-lg" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-800">
              {streakData.currentStreak} Day{streakData.currentStreak !== 1 ? 's' : ''}
            </div>
            <div className="text-sm text-gray-500">Current Streak</div>
          </div>
        </div>
        
        <div>
          <div className="text-right text-xl font-bold text-gray-800">
            {streakData.longestStreak} Day{streakData.longestStreak !== 1 ? 's' : ''}
          </div>
          <div className="text-right text-sm text-gray-500">Longest Streak</div>
        </div>
      </div>
      
      {/* Achievement badges */}
      {streakData.achievementsBadges.length > 0 && (
        <div className="mb-4">
          <button 
            onClick={() => setShowAchievements(!showAchievements)}
            className="flex items-center justify-between w-full py-2 px-1 border-b border-gray-200"
          >
            <div className="flex items-center">
              <FontAwesomeIcon icon={faTrophy} className={`${currentTheme.primaryText} mr-2`} />
              <span className="font-medium">Your Achievements</span>
            </div>
            <FontAwesomeIcon 
              icon={showAchievements ? faChevronRight : faChevronLeft} 
              className="text-gray-400" 
            />
          </button>
          
          {showAchievements && (
            <div className="mt-3 flex flex-wrap gap-2">
              {streakData.achievementsBadges.map(badge => (
                <div 
                  key={badge.id}
                  className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                >
                  <span className="mr-1.5">{badge.icon}</span>
                  <span className="text-sm">{badge.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Last 7 days heatmap */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <FontAwesomeIcon icon={faCalendarAlt} className={`${currentTheme.primaryText} mr-2`} />
          <h3 className="font-medium">Recent Activity</h3>
        </div>
        
        <div className="flex justify-between">
          {recentActivity.reverse().map((day, index) => (
            <div key={day.date} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-sm flex items-center justify-center mb-1 ${
                  day.visited ? getColorIntensity(day.count) : 'bg-gray-100'
                }`}
                title={`${day.date}: ${day.count} visit${day.count !== 1 ? 's' : ''}`}
              >
                {day.count > 0 && (
                  <span className="text-xs text-white font-bold">{day.count}</span>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {index === 0 ? 'Today' : 
                 index === 1 ? 'Yday' : 
                 new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Monthly calendar */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={goToPreviousMonth}
            className={`p-1 rounded-full ${currentTheme.cardBg} hover:bg-gray-100`}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-gray-500" />
          </button>
          
          <h3 className="font-bold text-gray-800">
            {getMonthName(currentMonth)} {currentYear}
          </h3>
          
          <button 
            onClick={goToNextMonth}
            className={`p-1 rounded-full ${currentTheme.cardBg} hover:bg-gray-100`}
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-500" />
          </button>
        </div>
        
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={index} className="text-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dayData, index) => (
            <div 
              key={index}
              className={`aspect-square flex items-center justify-center relative ${
                dayData.isToday ? 'ring-2 ring-blue-500 rounded-full' : ''
              }`}
            >
              {dayData.day && (
                <>
                  <div 
                    className={`w-full h-full absolute rounded-full ${
                      dayData.isVisited ? getColorIntensity(dayData.visitCount) : ''
                    }`}
                  ></div>
                  <span className={`text-xs z-10 font-medium ${
                    dayData.isVisited ? 'text-white' : 'text-gray-700'
                  }`}>
                    {dayData.day}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StreakCalendar;
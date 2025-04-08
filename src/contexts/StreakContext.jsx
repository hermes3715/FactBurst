import React, { createContext, useState, useEffect, useCallback } from "react";
import FactTrackingUtil from "../utils/factTracking";
import ThrottleUtil from "../utils/throttle";

export const StreakContext = createContext();

const StreakTrackingUtil = {
    recentlyProcessed: new Map(),
    throttleDuration: 2000, // 2 seconds
    
    wasRecentlyProcessed(factId) {
      if (!this.recentlyProcessed.has(factId)) return false;
      const processTime = this.recentlyProcessed.get(factId);
      return (Date.now() - processTime) < this.throttleDuration;
    },
    
    markAsProcessed(factId) {
      this.recentlyProcessed.set(factId, Date.now());
    }
  };
  

export const StreakProvider = ({ children }) => {
  // Initialize streak data from localStorage
  const [streakData, setStreakData] = useState(() => {
    const savedData = localStorage.getItem("factStreakData");
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      visitDates: {}, // Record of dates when app was used
      currentStreak: 0, // Current consecutive days streak
      longestStreak: 0, // Longest streak ever achieved
      lastVisitDate: null, // Last day the app was used
      totalFacts: 0, // Total facts viewed
      achievementsBadges: [], // Badges earned

      // Add category progress tracking
      categoryProgress: {}, // Progress by category
      totalProgress: 0, // Overall progress percentage
    };
  });

  // Save streak data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("factStreakData", JSON.stringify(streakData));
  }, [streakData]);

  // Format a date to YYYY-MM-DD string for storage
  const formatDate = (date = new Date()) => {
    return date.toISOString().split("T")[0];
  };

  // Record a visit for today
  const recordVisit = useCallback(() => {
    const today = formatDate();

    setStreakData((prev) => {
      // Create a copy of visit dates and mark today as visited
      const visitDates = { ...prev.visitDates };

      // If it's the first visit of the day, increment count
      const isFirstVisitToday = !visitDates[today];

      visitDates[today] =
        (visitDates[today] || 0) + (isFirstVisitToday ? 1 : 0);

      // Calculate streak
      let currentStreak = prev.currentStreak;
      let longestStreak = prev.longestStreak;

      if (isFirstVisitToday) {
        const yesterday = formatDate(
          new Date(new Date().setDate(new Date().getDate() - 1))
        );

        // If yesterday was visited or this is the first visit ever, increment streak
        if (visitDates[yesterday] || prev.lastVisitDate === null) {
          currentStreak += 1;
        } else {
          // Streak broken, start over
          currentStreak = 1;
        }

        // Update longest streak if needed
        longestStreak = Math.max(longestStreak, currentStreak);
      }

      return {
        ...prev,
        visitDates,
        currentStreak,
        longestStreak,
        lastVisitDate: today,
      };
    });
  }, []);

  // Update the recordStreakFactView function with deduplication logic:
  const recordStreakFactView = useCallback(
    (fact) => {
      if (!fact || !fact.id) return;
  
      if (StreakTrackingUtil.wasRecentlyProcessed(fact.id)) {
        console.log('Skipping duplicate streak recording for:', fact.id);
        return;
      }
      
      StreakTrackingUtil.markAsProcessed(fact.id);
      console.log("Recording new fact view:", fact.id);

      const category = fact.category || "random";

      setStreakData((prev) => {
        // Only increment the total if this is a new fact
        const totalFacts = prev.totalFacts + 1;

        // Rest of your function remains the same...
        const categoryProgress = { ...prev.categoryProgress };
        categoryProgress[category] = (categoryProgress[category] || 0) + 1;
        // Calculate total progress (simplified for display)
        // Defining category targets - each category has roughly 100 facts available
        const categoryTargets = {
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

        // Calculate progress for each category
        let totalProgress = 0;
        let categoriesWithProgress = 0;

        Object.keys(categoryProgress).forEach((cat) => {
          const target = categoryTargets[cat] || 100;
          const progress = Math.min(
            100,
            Math.round((categoryProgress[cat] / target) * 100)
          );
          if (progress > 0) {
            totalProgress += progress;
            categoriesWithProgress += 1;
          }
        });

        // Calculate average progress across categories with any progress
        if (categoriesWithProgress > 0) {
          totalProgress = Math.round(totalProgress / categoriesWithProgress);
        }

        return {
          ...prev,
          totalFacts,
          categoryProgress,
          totalProgress,
        };
      });

      // Also record a visit when a fact is viewed
      recordVisit();
    },
    [recordVisit]
  );

  // Check if a specific day was visited
  const wasDateVisited = (date) => {
    const formattedDate = formatDate(date);
    return !!streakData.visitDates[formattedDate];
  };

  // Get visit count for a specific day
  const getVisitCount = (date) => {
    const formattedDate = formatDate(date);
    return streakData.visitDates[formattedDate] || 0;
  };

  // Get last N days of visit data
  const getRecentActivity = (days = 30) => {
    const result = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const formattedDate = formatDate(date);

      result.push({
        date: formattedDate,
        visited: !!streakData.visitDates[formattedDate],
        count: streakData.visitDates[formattedDate] || 0,
      });
    }

    return result;
  };

  // Get progress for a specific category
  const getCategoryProgress = (category) => {
    if (!category) return 0;

    // Define a target number of facts for each category (approximately 100)
    const target = 100;
    const viewed = streakData.categoryProgress[category] || 0;

    return Math.min(100, Math.round((viewed / target) * 100));
  };

  // Check and award achievements
  const checkAchievements = useCallback(() => {
    const achievements = [];
    const { currentStreak, longestStreak, totalFacts, totalProgress } =
      streakData;

    // Streak achievements
    if (currentStreak >= 3)
      achievements.push({ id: "streak-3", name: "3 Day Streak", icon: "🔥" });
    if (currentStreak >= 7)
      achievements.push({ id: "streak-7", name: "7 Day Streak", icon: "🔥🔥" });
    if (currentStreak >= 30)
      achievements.push({
        id: "streak-30",
        name: "30 Day Streak",
        icon: "🔥🔥🔥",
      });

    // Fact count achievements
    if (totalFacts >= 10)
      achievements.push({
        id: "facts-10",
        name: "10 Facts Learned",
        icon: "🧠",
      });
    if (totalFacts >= 50)
      achievements.push({
        id: "facts-50",
        name: "50 Facts Learned",
        icon: "🧠🧠",
      });
    if (totalFacts >= 100)
      achievements.push({
        id: "facts-100",
        name: "100 Facts Learned",
        icon: "🧠🧠🧠",
      });

    // Progress achievements
    if (totalProgress >= 25)
      achievements.push({
        id: "progress-25",
        name: "25% Explorer",
        icon: "🔍",
      });
    if (totalProgress >= 50)
      achievements.push({
        id: "progress-50",
        name: "Halfway There",
        icon: "🔍🔍",
      });
    if (totalProgress >= 75)
      achievements.push({
        id: "progress-75",
        name: "Knowledge Seeker",
        icon: "🔍🔍🔍",
      });

    // Update achievements only if there are new ones
    if (achievements.length > streakData.achievementsBadges.length) {
      setStreakData((prev) => ({
        ...prev,
        achievementsBadges: achievements,
      }));
    }
  }, [streakData]);

  // Check achievements when streak data changes
  useEffect(() => {
    checkAchievements();
  }, [
    streakData.currentStreak,
    streakData.totalFacts,
    streakData.totalProgress,
    checkAchievements,
  ]);

  // Record a visit when the app loads
  useEffect(() => {
    recordVisit();
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StreakContext.Provider
      value={{
        streakData,
        recordVisit,
        recordStreakFactView,
        wasDateVisited,
        getVisitCount,
        getRecentActivity,
        getCategoryProgress,
      }}
    >
      {children}
    </StreakContext.Provider>
  );
};

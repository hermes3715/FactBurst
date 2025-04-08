export const resetAppData = () => {
    // List all localStorage keys that need to be cleared
    const appStorageKeys = [
      'factStreakData',
      'factProgressData',
      'factFavorites',
      'factCollections',
      'language',
      'theme',
      'viewedFactIds'
    ];
    
    // Clear all app-related localStorage items
    appStorageKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Clear any sessionStorage items too
    sessionStorage.clear();
    
    // Return true to indicate success
    return true;
  };
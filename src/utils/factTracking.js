
// This is a singleton utility to track fact views across the entire app
const FactTrackingUtil = {
    // Set to track fact IDs that have been counted in this session
    viewedFactIds: new Set(),
    
    // Store the last processed fact ID to prevent duplicate processing
    lastProcessedFactId: null,
    
    // Method to check if a fact has been viewed in this session
    hasBeenCounted(factId) {
      return this.viewedFactIds.has(factId) || this.lastProcessedFactId === factId;
    },
    
    // Method to mark a fact as viewed
    markAsCounted(factId) {
      this.viewedFactIds.add(factId);
      this.lastProcessedFactId = factId;
      
      // Optional: Store in localStorage to persist across refreshes
      const viewedFacts = JSON.parse(localStorage.getItem('viewedFactIds') || '[]');
      if (!viewedFacts.includes(factId)) {
        viewedFacts.push(factId);
        localStorage.setItem('viewedFactIds', JSON.stringify(viewedFacts));
      }
    },
    
    // Reset tracking (useful for testing)
    reset() {
      this.viewedFactIds.clear();
      this.lastProcessedFactId = null;
    }
  };
  
  export default FactTrackingUtil;
const ThrottleUtil = {
    // Track the last time a fact was recorded
    lastRecordTime: 0,
    
    // Minimum interval between fact recordings (in milliseconds)
    minInterval: 2000, // 2 seconds
    
    // Check if we should allow recording based on time
    shouldAllowRecording() {
      const now = Date.now();
      if (now - this.lastRecordTime < this.minInterval) {
        console.log('Throttled: Too soon to record another fact');
        return false;
      }
      // Update the last record time
      this.lastRecordTime = now;
      return true;
    },
    
    // Reset the throttle (for testing)
    reset() {
      this.lastRecordTime = 0;
    }
  };
  
  export default ThrottleUtil;
  
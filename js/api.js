// API handlers for fetching contest data

/**
 * Fetch Codeforces contests using their API
 * @returns {Promise<Array>} Array of contest objects
 */
export async function fetchCodeforcesContests() {
    try {
      const response = await fetch('https://codeforces.com/api/contest.list');
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(`API returned error status: ${data.status}`);
      }
      
      // Filter for upcoming contests (phase === "BEFORE")
      const upcomingContests = data.result
        .filter(contest => contest.phase === 'BEFORE')
        .map(contest => {
          // Convert to our contest format
          const startTime = new Date(contest.startTimeSeconds * 1000);
          return {
            id: `cf-${contest.id}`,
            platform: 'codeforces',
            name: contest.name,
            url: `https://codeforces.com/contests/${contest.id}`,
            startTime: startTime,
            duration: contest.durationSeconds * 1000, // Convert to milliseconds
            endTime: new Date(startTime.getTime() + (contest.durationSeconds * 1000)),
            durationFormatted: formatDuration(contest.durationSeconds * 1000)
          };
        });
      
      return upcomingContests;
    } catch (error) {
      console.error('Error fetching Codeforces contests:', error);
      // Return empty array on error
      return [];
    }
  }
  
  /**
   * Format duration in milliseconds to readable format
   * @param {number} duration Duration in milliseconds
   * @returns {string} Formatted duration string
   */
  function formatDuration(duration) {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 && days === 0 && hours === 0) parts.push(`${seconds}s`);
    
    return parts.join(' ');
  }
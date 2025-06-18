// Contest data generator for platforms with fixed schedules

/**
 * Generate contest data for platforms with fixed schedules (LeetCode, CodeChef, GFG)
 * @returns {Array} Array of contest objects
 */
export function generateContestData() {
  const contests = [];
  const today = new Date();
  
  // Generate upcoming contests for next 3 months
  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // LeetCode Weekly Contest - Every Sunday at 8 AM
    if (date.getDay() === 0) { // Sunday
      const leetcodeWeekly = createLeetCodeWeeklyContest(date);
      contests.push(leetcodeWeekly);
    }
    
    // LeetCode Biweekly Contest - Every other Saturday at 8 PM
    if (date.getDay() === 6) { // Saturday
      // Check if this is a biweekly week (every 2 weeks)
      const weekNumber = getWeekNumber(date);
      if (weekNumber % 2 != 0) {
        const leetcodeBiweekly = createLeetCodeBiweeklyContest(date);
        contests.push(leetcodeBiweekly);
      }
    }
    
    // CodeChef - Every Wednesday at 8 PM
    if (date.getDay() === 3) { // Wednesday
      const codechefContest = createCodeChefContest(date);
      contests.push(codechefContest);
    }
    
    // GeeksforGeeks - Every Sunday at 7 PM
    if (date.getDay() === 0) { // Sunday
      const gfgContest = createGFGContest(date);
      contests.push(gfgContest);
    }
  }
  
  return contests;
}

/**
 * Create a LeetCode Weekly Contest object
 * @param {Date} date Base date for the contest
 * @returns {Object} Contest object
 */
function createLeetCodeWeeklyContest(date) {
  const contestDate = new Date(date);
  contestDate.setHours(8, 0, 0, 0); // 8:00 AM
  
  const weekNumber = getWeekNumber(date);
  const contestNumber = 380 + Math.floor((date - new Date(2025, 0, 5)) / (7 * 24 * 60 * 60 * 1000));
  
  return {
    id: `lc-weekly-${contestNumber}`,
    platform: 'leetcode',
    name: `Weekly Contest ${contestNumber}`,
    url: 'https://leetcode.com/contest/',
    startTime: new Date(contestDate),
    duration: 90 * 60 * 1000, // 90 minutes
    endTime: new Date(contestDate.getTime() + (90 * 60 * 1000)),
    durationFormatted: '1h 30m'
  };
}

/**
 * Create a LeetCode Biweekly Contest object
 * @param {Date} date Base date for the contest
 * @returns {Object} Contest object
 */
function createLeetCodeBiweeklyContest(date) {
  const contestDate = new Date(date);
  contestDate.setHours(20, 0, 0, 0); // 8:00 PM
  
  const biweeklyNumber = 124 + Math.floor((date - new Date(2025, 0, 4)) / (14 * 24 * 60 * 60 * 1000));
  
  return {
    id: `lc-biweekly-${biweeklyNumber}`,
    platform: 'leetcode',
    name: `Biweekly Contest ${biweeklyNumber}`,
    url: 'https://leetcode.com/contest/',
    startTime: new Date(contestDate),
    duration: 90 * 60 * 1000, // 90 minutes
    endTime: new Date(contestDate.getTime() + (90 * 60 * 1000)),
    durationFormatted: '1h 30m'
  };
}

/**
 * Create a CodeChef Contest object
 * @param {Date} date Base date for the contest
 * @returns {Object} Contest object
 */
function createCodeChefContest(date) {
  const contestDate = new Date(date);
  contestDate.setHours(20, 0, 0, 0); // 8:00 PM
  
  // Determine contest type based on week in month
  const dayOfMonth = date.getDate();
  let contestName;
  
  if (dayOfMonth <= 7) {
    contestName = `Long Challenge - ${getMonthName(date)} 2025`;
  } else if (dayOfMonth > 7 && dayOfMonth <= 14) {
    contestName = `Cook-Off - ${getMonthName(date)} 2025`;
  } else if (dayOfMonth > 14 && dayOfMonth <= 21) {
    contestName = `Starters - ${getMonthName(date)} 2025`;
  } else {
    contestName = `Lunchtime - ${getMonthName(date)} 2025`;
  }
  
  return {
    id: `cc-${formatDateSimple(date)}-${contestName.split(' ')[0].toLowerCase()}`,
    platform: 'codechef',
    name: contestName,
    url: 'https://www.codechef.com/contests',
    startTime: new Date(contestDate),
    duration: 2 * 60 * 60 * 1000, // 2 hours
    endTime: new Date(contestDate.getTime() + (2 * 60 * 60 * 1000)),
    durationFormatted: '2h'
  };
}

/**
 * Create a GeeksforGeeks Contest object
 * @param {Date} date Base date for the contest
 * @returns {Object} Contest object
 */
function createGFGContest(date) {
  const contestDate = new Date(date);
  contestDate.setHours(19, 0, 0, 0); // 7:00 PM
  
  return {
    id: `gfg-${formatDateSimple(date)}`,
    platform: 'gfg',
    name: `Weekly Coding Contest - ${getMonthName(date)} ${date.getDate()}`,
    url: 'https://practice.geeksforgeeks.org/events',
    startTime: new Date(contestDate),
    duration: 2 * 60 * 60 * 1000, // 2 hours
    endTime: new Date(contestDate.getTime() + (2 * 60 * 60 * 1000)),
    durationFormatted: '2h'
  };
}

/**
 * Get ISO week number for a date
 * @param {Date} date Date to get week number for
 * @returns {number} Week number (1-53)
 */
function getWeekNumber(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/**
 * Get month name from date
 * @param {Date} date Date to get month name from
 * @returns {string} Month name
 */
function getMonthName(date) {
  return date.toLocaleString('default', { month: 'long' });
}

/**
 * Format date as YYYY-MM-DD
 * @param {Date} date Date to format
 * @returns {string} Formatted date
 */
function formatDateSimple(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
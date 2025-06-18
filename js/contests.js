/**
 * Contest data management
 */

// Generate LeetCode weekly and biweekly contests
function generateLeetcodeContests(weeks = 8) {
    const contests = [];
    const now = new Date();
    const currentDay = now.getDay();
    
    // Days until next Sunday (weekly contest)
    let daysUntilSunday = 7 - currentDay;
    if (daysUntilSunday === 7) daysUntilSunday = 0; // Already Sunday
    
    let nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + daysUntilSunday);
    
    // Set time to 8:00 AM
    nextSunday.setHours(8, 0, 0, 0);
    
    // If today is Sunday and it's past 8 AM, move to next week
    if (currentDay === 0 && now > nextSunday) {
      nextSunday.setDate(nextSunday.getDate() + 7);
    }
    
    // Generate weekly contests for next few weeks
    for (let i = 0; i < weeks; i++) {
      const weeklyDate = new Date(nextSunday);
      weeklyDate.setDate(weeklyDate.getDate() + (i * 7));
      
      const weeklyContest = {
        id: `leetcode-weekly-${i}`,
        title: `Weekly Contest ${calculateLeetCodeContestNumber('weekly', weeklyDate)}`,
        platform: 'leetcode',
        url: 'https://leetcode.com/contest/',
        startTime: weeklyDate.toISOString(),
        duration: 90, // 1.5 hours
        isRecurring: true
      };
      
      contests.push(weeklyContest);
    }
    
    // Calculate days until next biweekly contest (alternate Saturdays)
    // LeetCode biweekly contests are every two weeks on Saturday at a specific time
    // For simplicity, we'll calculate based on a known past date
    // Known biweekly contest: 2023-01-07 (as a reference point)
    const knownBiweeklyDate = new Date(2023, 0, 7); // January 7, 2023
    const daysSinceKnown = Math.floor((now - knownBiweeklyDate) / (1000 * 60 * 60 * 24));
    const daysUntilBiweekly = 14 - (daysSinceKnown % 14);
    
    let nextBiweekly = new Date(now);
    nextBiweekly.setDate(now.getDate() + daysUntilBiweekly);
    nextBiweekly.setHours(8, 0, 0, 0); // Set to 8:00 AM
    
    // Generate biweekly contests
    for (let i = 0; i < weeks / 2; i++) {
      const biweeklyDate = new Date(nextBiweekly);
      biweeklyDate.setDate(biweeklyDate.getDate() + (i * 14));
      
      const biweeklyContest = {
        id: `leetcode-biweekly-${i}`,
        title: `Biweekly Contest ${calculateLeetCodeContestNumber('biweekly', biweeklyDate)}`,
        platform: 'leetcode',
        url: 'https://leetcode.com/contest/',
        startTime: biweeklyDate.toISOString(),
        duration: 90, // 1.5 hours
        isRecurring: true
      };
      
      contests.push(biweeklyContest);
    }
    
    return contests;
  }
  
  // Calculate LeetCode contest numbers
  function calculateLeetCodeContestNumber(type, date) {
    // These are approximate starting numbers
    if (type === 'weekly') {
      // Weekly contest #375 was around Jan 7, 2024
      const baseDate = new Date(2024, 0, 7);
      const baseNumber = 375;
      const weeksDiff = Math.floor((date - baseDate) / (7 * 24 * 60 * 60 * 1000));
      return baseNumber + weeksDiff;
    } else {
      // Biweekly contest #120 was around Jan 6, 2024
      const baseDate = new Date(2024, 0, 6);
      const baseNumber = 120;
      const biweeksDiff = Math.floor((date - baseDate) / (14 * 24 * 60 * 60 * 1000));
      return baseNumber + biweeksDiff;
    }
  }
  
  // Generate CodeChef contests (every Wednesday)
  function generateCodeChefContests(weeks = 8) {
    const contests = [];
    const now = new Date();
    const currentDay = now.getDay();
    
    // Days until next Wednesday (3 is Wednesday in JS Date)
    let daysUntilWednesday = (3 + 7 - currentDay) % 7;
    if (daysUntilWednesday === 0) daysUntilWednesday = 7; // Already Wednesday, get next week
    
    let nextWednesday = new Date(now);
    nextWednesday.setDate(now.getDate() + daysUntilWednesday);
    
    // Set time to specific hour
    nextWednesday.setHours(15, 0, 0, 0); // 3:00 PM
    
    // Generate contests for next few weeks
    for (let i = 0; i < weeks; i++) {
      const contestDate = new Date(nextWednesday);
      contestDate.setDate(contestDate.getDate() + (i * 7));
      
      const contest = {
        id: `codechef-${i}`,
        title: `CodeChef Starters ${calculateCodeChefStartersNumber(contestDate)}`,
        platform: 'codechef',
        url: 'https://www.codechef.com/contests',
        startTime: contestDate.toISOString(),
        duration: 180, // 3 hours
        isRecurring: true
      };
      
      contests.push(contest);
    }
    
    return contests;
  }
  
  // Calculate CodeChef contest number
  function calculateCodeChefStartersNumber(date) {
    // CodeChef Starters 115 was on Jan 3, 2024
    const baseDate = new Date(2024, 0, 3);
    const baseNumber = 115;
    const weeksDiff = Math.floor((date - baseDate) / (7 * 24 * 60 * 60 * 1000));
    return baseNumber + weeksDiff;
  }
  
  // Generate GeeksforGeeks contests (every Sunday 7 PM)
  function generateGFGContests(weeks = 8) {
    const contests = [];
    const now = new Date();
    const currentDay = now.getDay();
    
    // Days until next Sunday (0 is Sunday in JS Date)
    let daysUntilSunday = (0 + 7 - currentDay) % 7;
    if (daysUntilSunday === 0) {
      // It's Sunday, check if it's before 7 PM
      const currentHour = now.getHours();
      if (currentHour >= 19) {
        // After 7 PM, get next week's Sunday
        daysUntilSunday = 7;
      }
    }
    
    let nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + daysUntilSunday);
    
    // Set time to 7:00 PM
    nextSunday.setHours(19, 0, 0, 0);
    
    // Generate contests for next few weeks
    for (let i = 0; i < weeks; i++) {
      const contestDate = new Date(nextSunday);
      contestDate.setDate(contestDate.getDate() + (i * 7));
      
      const contest = {
        id: `gfg-${i}`,
        title: `GFG Weekly Coding Contest ${calculateGFGContestNumber(contestDate)}`,
        platform: 'gfg',
        url: 'https://practice.geeksforgeeks.org/contest/gfg-weekly-coding-contest',
        startTime: contestDate.toISOString(),
        duration: 150, // 2.5 hours
        isRecurring: true
      };
      
      contests.push(contest);
    }
    
    return contests;
  }
  
  // Calculate GFG contest number
  function calculateGFGContestNumber(date) {
    // Approximate: GFG Weekly Contest 115 on Jan 7, 2024
    const baseDate = new Date(2024, 0, 7);
    const baseNumber = 115;
    const weeksDiff = Math.floor((date - baseDate) / (7 * 24 * 60 * 60 * 1000));
    return baseNumber + weeksDiff;
  }
  
  // Get all upcoming contests
  async function getAllUpcomingContests() {
    // Get recurring contests
    const leetcodeContests = generateLeetcodeContests();
    const codechefContests = generateCodeChefContests();
    const gfgContests = generateGFGContests();
    
    // Try to get CodeForces contests from cache first
    let codeforcesContests = getCodeforcesContests();
    
    // Combine all contests
    let allContests = [
      ...leetcodeContests,
      ...codechefContests,
      ...gfgContests,
      ...codeforcesContests
    ];
    
    // Sort by start time
    allContests = sortContestsByDate(allContests);
    
    // Try to update CodeForces contests in the background
    try {
      const freshCodeforcesContests = await fetchCodeforcesContests();
      
      if (freshCodeforcesContests.length > 0 && 
          JSON.stringify(freshCodeforcesContests) !== JSON.stringify(codeforcesContests)) {
        // If we got new data, update the list
        allContests = [
          ...leetcodeContests,
          ...codechefContests,
          ...gfgContests,
          ...freshCodeforcesContests
        ];
        
        // Re-sort
        allContests = sortContestsByDate(allContests);
      }
    } catch (error) {
      console.error('Error updating CodeForces contests in background:', error);
    }
    
    return allContests;
  }
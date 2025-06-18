// UI updates and rendering functions

/**
 * Render contests in the UI
 * @param {Array} contests Array of contest objects
 */
export function renderContests(contests) {
  // Filter for upcoming contests
  const now = new Date();
  const upcomingContests = contests.filter(contest => new Date(contest.startTime) > now);
  
  // Sort contests by start time
  upcomingContests.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  
  // Render next contest
  const nextContestEl = document.getElementById('next-contest');
  if (upcomingContests.length > 0) {
    const nextContest = upcomingContests[0];
    nextContestEl.innerHTML = createContestCard(nextContest).outerHTML;
  } else {
    nextContestEl.innerHTML = '<div class="no-contests">No upcoming contests found</div>';
  }
  
  // Render upcoming contests (skip the first one as it's shown in next contest)
  const upcomingContestsEl = document.getElementById('upcoming-contests');
  upcomingContestsEl.innerHTML = '';
  
  if (upcomingContests.length <= 1) {
    upcomingContestsEl.innerHTML = '<div class="no-contests">No additional upcoming contests found</div>';
    return;
  }
  
  upcomingContests.slice(1, 7).forEach(contest => {
    const contestCard = createContestCard(contest);
    upcomingContestsEl.appendChild(contestCard);
  });
  
  // Render platform-specific contests
  renderPlatformContests('leetcode', contests);
  renderPlatformContests('codechef', contests);
  renderPlatformContests('gfg', contests);
  renderPlatformContests('codeforces', contests);
}

/**
 * Create a contest card element
 * @param {Object} contest Contest object
 * @returns {HTMLElement} Contest card element
 */
function createContestCard(contest) {
  const card = document.createElement('div');
  card.className = `contest-card ${contest.platform}`;
  card.dataset.contestId = contest.id;
  
  const startTime = new Date(contest.startTime);
  
  card.innerHTML = `
    <div class="contest-header">
      <div class="contest-platform">
        <span></span>${getPlatformName(contest.platform)}
      </div>
      <div class="contest-date">${formatDate(startTime)}</div>
    </div>
    <div class="contest-title">${contest.name}</div>
    <div class="contest-time">${formatTime(startTime)} - ${formatTime(new Date(contest.endTime))}</div>
    <div class="contest-time">Duration: ${contest.durationFormatted}</div>
    <div class="contest-countdown" data-start-time="${startTime.getTime()}">
      Starts in: ${getCountdown(startTime)}
    </div>
    <div class="contest-register">
      <a href="${contest.url}" target="_blank" class="register-btn">Register</a>
    </div>
  `;
  
  return card;
}

/**
 * Render contests for a specific platform
 * @param {string} platform Platform identifier
 * @param {Array} contests Array of contest objects
 */
function renderPlatformContests(platform, contests) {
  const now = new Date();
  
  // Filter contests for this platform and upcoming
  const platformContests = contests.filter(
    contest => contest.platform === platform && new Date(contest.startTime) > now
  );
  
  const containerEl = document.getElementById(`${platform}-contests`);
  containerEl.innerHTML = '';
  
  if (platformContests.length === 0) {
    containerEl.innerHTML = '<div class="no-contests">No upcoming contests</div>';
    return;
  }
  
  // Show next 3 contests for this platform
  platformContests.slice(0, 3).forEach(contest => {
    const contestEl = document.createElement('div');
    contestEl.className = 'platform-contest-item';
    contestEl.innerHTML = `
      <div class="platform-contest-date">${formatDate(new Date(contest.startTime))}</div>
      <div class="platform-contest-name">${contest.name}</div>
      <div class="platform-contest-time">${formatTime(new Date(contest.startTime))}</div>
    `;
    containerEl.appendChild(contestEl);
  });
}

/**
 * Update all countdown timers
 */
export function updateCountdowns() {
  const countdowns = document.querySelectorAll('.contest-countdown');
  
  countdowns.forEach(countdown => {
    const startTime = parseInt(countdown.dataset.startTime, 10);
    countdown.textContent = `Starts in: ${getCountdown(new Date(startTime))}`;
    
    // Check if contest has started
    if (Date.now() >= startTime) {
      countdown.textContent = 'Contest started';
      countdown.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
    }
  });
}

/**
 * Toggle between light and dark theme
 */
export function toggleTheme() {
  const isDarkTheme = document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}

/**
 * Get countdown string from now until a specified date
 * @param {Date} date Target date
 * @returns {string} Formatted countdown
 */
function getCountdown(date) {
  const now = new Date();
  const diff = date - now;
  
  if (diff <= 0) {
    return 'Started';
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else {
    return `${minutes}m ${seconds}s`;
  }
}

/**
 * Format date for display
 * @param {Date} date Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format time for display
 * @param {Date} date Date to format
 * @returns {string} Formatted time
 */
function formatTime(date) {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Get platform's display name
 * @param {string} platform Platform identifier
 * @returns {string} Platform display name
 */
function getPlatformName(platform) {
  const platforms = {
    'leetcode': 'LeetCode',
    'codechef': 'CodeChef',
    'gfg': 'GeeksforGeeks',
    'codeforces': 'Codeforces'
  };
  
  return platforms[platform] || platform;
}
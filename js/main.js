import { fetchCodeforcesContests } from './api.js';
import { generateContestData } from './contestData.js';
import { initCalendar } from './calendar.js';
import { renderContests, updateCountdowns, toggleTheme } from './ui.js';

// Initialize the application
async function initApp() {
  // Initialize theme
  if (localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark-theme');
  }

  // Initialize theme toggle button
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  themeToggleBtn.addEventListener('click', toggleTheme);

  try {
    // Generate contest data for fixed schedule platforms
    const contestData = generateContestData();
    
    // Fetch Codeforces contests
    const codeforcesContests = await fetchCodeforcesContests();
    
    // Combine all contests
    const allContests = [...contestData, ...codeforcesContests];
    
    // Sort contests by start date
    allContests.sort((a, b) => a.startTime - b.startTime);
    
    // Render contests
    renderContests(allContests);
    
    // Initialize calendar
    initCalendar(allContests);
    
    // Update countdowns every second
    setInterval(() => updateCountdowns(), 1000);
    
    // Store contest data in localStorage for offline access
    localStorage.setItem('contestData', JSON.stringify({
      timestamp: Date.now(),
      contests: allContests
    }));
  } catch (error) {
    console.error('Error initializing app:', error);
    
    // Try to load from cache if available
    const cachedData = localStorage.getItem('contestData');
    if (cachedData) {
      const { timestamp, contests } = JSON.parse(cachedData);
      const hoursSinceUpdate = (Date.now() - timestamp) / (1000 * 60 * 60);
      
      if (hoursSinceUpdate < 24) {
        renderContests(contests);
        initCalendar(contests);
        setInterval(() => updateCountdowns(), 1000);
        
        // Show cached data notice
        const upcomingSection = document.querySelector('.upcoming-section h2');
        const cacheNotice = document.createElement('span');
        cacheNotice.textContent = ` (Cached data - ${Math.floor(hoursSinceUpdate)}h old)`;
        cacheNotice.style.fontSize = '0.8rem';
        cacheNotice.style.fontWeight = 'normal';
        cacheNotice.style.color = 'var(--text-secondary)';
        upcomingSection.appendChild(cacheNotice);
      } else {
        showError('Failed to load fresh contest data and cached data is too old.');
      }
    } else {
      showError('Failed to load contest data. Please check your internet connection and try again.');
    }
  }
}

function showError(message) {
  const loadingElements = document.querySelectorAll('.loading');
  loadingElements.forEach(el => {
    el.textContent = message;
    el.style.color = '#ff5555';
  });
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Refresh data when page is shown (in case it was hidden/in background)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    const lastUpdate = localStorage.getItem('contestData') 
      ? JSON.parse(localStorage.getItem('contestData')).timestamp 
      : 0;
    
    const hoursSinceUpdate = (Date.now() - lastUpdate) / (1000 * 60 * 60);
    
    // Refresh if data is older than 6 hours
    if (hoursSinceUpdate > 6) {
      initApp();
    }
  }
});
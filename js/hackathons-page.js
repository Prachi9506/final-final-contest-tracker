import { toggleTheme } from './ui.js';
import { initHackathons, updateCountdown } from './hackathons.js';

// Initialize the hackathons page
function initHackathonsPage() {
  // Initialize theme
  if (localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark-theme');
  }

  // Initialize theme toggle button
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  themeToggleBtn.addEventListener('click', toggleTheme);

  // Initialize hackathons
  initHackathons();

  // Update countdown every second
  setInterval(updateCountdown, 1000);
}

// Start the page when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHackathonsPage);
} else {
  initHackathonsPage();
}
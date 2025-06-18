// Hackathons functionality

/**
 * Initialize hackathons functionality
 */
export function initHackathons() {
  // Load existing hackathons from localStorage
  loadHackathons();
  
  // Add event listener for the add event button
  const addEventBtn = document.getElementById('add-event-btn');
  if (addEventBtn) {
    addEventBtn.addEventListener('click', addNewEvent);
  }

  // Initialize filters
  initializeFilters();
  
  // Update statistics
  updateStatistics();
}

/**
 * Initialize filter buttons
 */
function initializeFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Remove active class from siblings
      const group = btn.closest('.filter-options');
      group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      
      // Add active class to clicked button
      btn.classList.add('active');
      
      // Apply filters
      applyFilters();
    });
  });
}

/**
 * Apply selected filters to events list
 */
function applyFilters() {
  const typeFilter = document.querySelector('.filter-btn[data-type].active').dataset.type;
  const timeFilter = document.querySelector('.filter-btn[data-time].active').dataset.time;
  
  const events = getHackathons();
  const now = new Date();
  
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.startTime);
    
    // Type filter
    if (typeFilter !== 'all' && event.type !== typeFilter) {
      return false;
    }
    
    // Time filter
    if (timeFilter === 'today') {
      return isSameDay(eventDate, now);
    } else if (timeFilter === 'week') {
      return isThisWeek(eventDate);
    } else if (timeFilter === 'month') {
      return isSameMonth(eventDate, now);
    }
    
    return true;
  });
  
  renderHackathons(filteredEvents);
}

/**
 * Add a new event
 */
function addNewEvent() {
  const name = document.getElementById('event-name')?.value;
  const organizer = document.getElementById('event-organizer')?.value;
  const startTime = document.getElementById('event-start')?.value;
  const endTime = document.getElementById('event-end')?.value;
  const url = document.getElementById('event-url')?.value;
  const description = document.getElementById('event-description')?.value;
  const type = document.getElementById('event-type')?.value;
  const location = document.getElementById('event-location')?.value;
  const prize = document.getElementById('event-prize')?.value;
  
  if (!name || !startTime || !endTime) {
    alert('Please fill in all required fields (Name, Start Time, End Time)');
    return;
  }
  
  addHackathon({
    name,
    organizer,
    startTime,
    endTime,
    url,
    description,
    type,
    location,
    prize
  });
  
  // Clear form
  document.getElementById('event-name').value = '';
  document.getElementById('event-organizer').value = '';
  document.getElementById('event-start').value = '';
  document.getElementById('event-end').value = '';
  document.getElementById('event-url').value = '';
  document.getElementById('event-description').value = '';
  document.getElementById('event-type').value = 'hackathon';
  document.getElementById('event-location').value = '';
  document.getElementById('event-prize').value = '';
  
  // Update statistics
  updateStatistics();
}

/**
 * Delete a hackathon
 * @param {string} id Hackathon ID to delete
 */
function deleteHackathon(id) {
  if (!confirm('Are you sure you want to delete this event?')) {
    return;
  }

  const hackathons = getHackathons();
  const updatedHackathons = hackathons.filter(h => h.id !== id);
  
  // Save to localStorage
  localStorage.setItem('hackathons', JSON.stringify(updatedHackathons));
  
  // Re-render hackathons
  renderHackathons(updatedHackathons);
  updateNextEvent();
  updateStatistics();
}

/**
 * Add a new hackathon
 * @param {Object} hackathon Hackathon object
 */
function addHackathon(hackathon) {
  const hackathons = getHackathons();
  hackathons.push({
    ...hackathon,
    id: Date.now().toString()
  });
  
  // Sort hackathons by start time
  hackathons.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  
  // Save to localStorage
  localStorage.setItem('hackathons', JSON.stringify(hackathons));
  
  // Render hackathons
  renderHackathons(hackathons);
  updateNextEvent();
}

/**
 * Get hackathons from localStorage
 * @returns {Array} Array of hackathon objects
 */
export function getHackathons() {
  const hackathons = localStorage.getItem('hackathons');
  return hackathons ? JSON.parse(hackathons) : [];
}

/**
 * Load and render hackathons
 */
function loadHackathons() {
  const hackathons = getHackathons();
  renderHackathons(hackathons);
  updateNextEvent();
}

/**
 * Update the next event display and countdown
 */
function updateNextEvent() {
  const nextEventEl = document.getElementById('next-event');
  if (!nextEventEl) return;

  const hackathons = getHackathons();
  const now = new Date();
  const upcomingEvents = hackathons.filter(h => new Date(h.startTime) > now);

  if (upcomingEvents.length === 0) {
    nextEventEl.innerHTML = '<div class="no-events">No upcoming events</div>';
    return;
  }

  const nextEvent = upcomingEvents[0];
  const startTime = new Date(nextEvent.startTime);

  nextEventEl.innerHTML = `
    <div class="event-card featured">
      <div class="event-type-badge ${nextEvent.type}">${capitalizeFirstLetter(nextEvent.type)}</div>
      <h3>${nextEvent.name}</h3>
      ${nextEvent.organizer ? `<div class="event-organizer">Organized by ${nextEvent.organizer}</div>` : ''}
      <div class="event-dates">
        ${formatDateTime(startTime)} - 
        ${formatDateTime(new Date(nextEvent.endTime))}
      </div>
      ${nextEvent.location ? `<div class="event-location">${nextEvent.location}</div>` : ''}
      ${nextEvent.description ? `<div class="event-description">${nextEvent.description}</div>` : ''}
      ${nextEvent.prize ? `<div class="event-prize">Prize Pool: ${nextEvent.prize}</div>` : ''}
      <div class="countdown" data-start-time="${startTime.getTime()}">
        <div class="countdown-unit">
          <div class="countdown-value" id="countdown-days">--</div>
          <div class="countdown-label">Days</div>
        </div>
        <div class="countdown-unit">
          <div class="countdown-value" id="countdown-hours">--</div>
          <div class="countdown-label">Hours</div>
        </div>
        <div class="countdown-unit">
          <div class="countdown-value" id="countdown-minutes">--</div>
          <div class="countdown-label">Minutes</div>
        </div>
        <div class="countdown-unit">
          <div class="countdown-value" id="countdown-seconds">--</div>
          <div class="countdown-label">Seconds</div>
        </div>
      </div>
      <div class="event-actions">
        ${nextEvent.url ? `<a href="${nextEvent.url}" target="_blank" class="event-url">Visit Event Page</a>` : ''}
        <button class="delete-event-btn" onclick="window.deleteHackathon('${nextEvent.id}')">Delete Event</button>
      </div>
    </div>
  `;
}

/**
 * Update the countdown timer
 */
export function updateCountdown() {
  const countdown = document.querySelector('.countdown');
  if (!countdown) return;

  const startTime = parseInt(countdown.dataset.startTime, 10);
  const now = Date.now();
  const diff = startTime - now;

  if (diff <= 0) {
    updateNextEvent();
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');

  if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
  if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
  if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
  if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
}

/**
 * Update statistics display
 */
function updateStatistics() {
  const events = getHackathons();
  const now = new Date();
  
  // Total events
  document.getElementById('total-events').textContent = events.length;
  
  // Upcoming events
  const upcomingEvents = events.filter(event => new Date(event.startTime) > now);
  document.getElementById('upcoming-events').textContent = upcomingEvents.length;
  
  // This month's events
  const thisMonthEvents = events.filter(event => isSameMonth(new Date(event.startTime), now));
  document.getElementById('this-month-events').textContent = thisMonthEvents.length;
  
  // Total prize pool
  const totalPrize = events.reduce((sum, event) => {
    if (!event.prize) return sum;
    const prizeAmount = parsePrizeAmount(event.prize);
    return sum + prizeAmount;
  }, 0);
  document.getElementById('total-prize-pool').textContent = formatCurrency(totalPrize);
}

/**
 * Parse prize amount from string
 * @param {string} prizeString Prize string (e.g., "$1000", "1000 USD")
 * @returns {number} Prize amount in dollars
 */
function parsePrizeAmount(prizeString) {
  const match = prizeString.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

/**
 * Format currency amount
 * @param {number} amount Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

/**
 * Render hackathons in the UI
 * @param {Array} events Array of events to render
 */
function renderHackathons(events) {
  const hackathonsList = document.getElementById('hackathons-list');
  if (!hackathonsList) return;
  
  if (events.length === 0) {
    hackathonsList.innerHTML = '<div class="no-events">No events found</div>';
    return;
  }
  
  hackathonsList.innerHTML = events
    .map(event => `
      <div class="event-card ${event.type}">
        <div class="event-type-badge">${capitalizeFirstLetter(event.type)}</div>
        <h3>${event.name}</h3>
        ${event.organizer ? `<div class="event-organizer">Organized by ${event.organizer}</div>` : ''}
        <div class="event-dates">
          ${formatDateTime(new Date(event.startTime))} - 
          ${formatDateTime(new Date(event.endTime))}
        </div>
        ${event.location ? `<div class="event-location">${event.location}</div>` : ''}
        ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
        ${event.prize ? `<div class="event-prize">Prize Pool: ${event.prize}</div>` : ''}
        <div class="event-actions">
          ${event.url ? `<a href="${event.url}" target="_blank" class="event-url">Visit Event Page</a>` : ''}
          <button class="delete-event-btn" onclick="window.deleteHackathon('${event.id}')">Delete Event</button>
        </div>
      </div>
    `)
    .join('');
}

/**
 * Format date and time for display
 * @param {Date} date Date to format
 * @returns {string} Formatted date and time
 */
function formatDateTime(date) {
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Check if two dates are the same day
 * @param {Date} date1 First date
 * @param {Date} date2 Second date
 * @returns {boolean} True if dates are the same day
 */
function isSameDay(date1, date2) {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
}

/**
 * Check if a date is in the current week
 * @param {Date} date Date to check
 * @returns {boolean} True if date is in current week
 */
function isThisWeek(date) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  return date >= weekStart && date <= weekEnd;
}

/**
 * Check if two dates are in the same month
 * @param {Date} date1 First date
 * @param {Date} date2 Second date
 * @returns {boolean} True if dates are in the same month
 */
function isSameMonth(date1, date2) {
  return date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
}

/**
 * Capitalize first letter of a string
 * @param {string} string String to capitalize
 * @returns {string} Capitalized string
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Make deleteHackathon available globally
window.deleteHackathon = deleteHackathon;
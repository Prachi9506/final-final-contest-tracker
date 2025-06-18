// Calendar functionality

/**
 * Initialize the calendar with contest data
 * @param {Array} contests Array of contest objects
 */
export function initCalendar(contests) {
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    
    // Update month display
    updateMonthDisplay(currentMonth, currentYear);
    
    // Generate calendar for current month
    generateCalendar(currentMonth, currentYear, contests);
    
    // Set up next/prev month buttons
    document.getElementById('prev-month').addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      updateMonthDisplay(currentMonth, currentYear);
      generateCalendar(currentMonth, currentYear, contests);
    });
    
    document.getElementById('next-month').addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      updateMonthDisplay(currentMonth, currentYear);
      generateCalendar(currentMonth, currentYear, contests);
    });
  }
  
  /**
   * Update the month and year display
   * @param {number} month Month number (0-11)
   * @param {number} year Year
   */
  function updateMonthDisplay(month, year) {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;
  }
  
  /**
   * Generate calendar for specified month and year
   * @param {number} month Month number (0-11)
   * @param {number} year Year
   * @param {Array} contests Array of contest objects
   */
  function generateCalendar(month, year, contests) {
    const calendarEl = document.getElementById('calendar');
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Create calendar HTML
    let calendarHTML = `
      <div class="calendar-header">
        <div class="calendar-day-name">Sun</div>
        <div class="calendar-day-name">Mon</div>
        <div class="calendar-day-name">Tue</div>
        <div class="calendar-day-name">Wed</div>
        <div class="calendar-day-name">Thu</div>
        <div class="calendar-day-name">Fri</div>
        <div class="calendar-day-name">Sat</div>
      </div>
      <div class="calendar-grid">
    `;
    
    // Add previous month's days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      const day = daysInPrevMonth - startingDayOfWeek + i + 1;
      const date = new Date(prevMonthYear, prevMonth, day);
      const dateEvents = getContestsForDate(date, contests);
      
      calendarHTML += createCalendarDateHTML(day, date, dateEvents, true);
    }
    
    // Add current month's days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateEvents = getContestsForDate(date, contests);
      const isToday = day === today.getDate() && 
                     month === today.getMonth() && 
                     year === today.getFullYear();
      
      calendarHTML += createCalendarDateHTML(day, date, dateEvents, false, isToday);
    }
    
    // Add next month's days
    const daysToAdd = 42 - (startingDayOfWeek + daysInMonth);
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    
    for (let day = 1; day <= daysToAdd; day++) {
      const date = new Date(nextMonthYear, nextMonth, day);
      const dateEvents = getContestsForDate(date, contests);
      
      calendarHTML += createCalendarDateHTML(day, date, dateEvents, true);
    }
    
    calendarHTML += `</div>`;
    calendarEl.innerHTML = calendarHTML;
  }
  
  /**
   * Create HTML for a calendar date cell
   * @param {number} day Day number
   * @param {Date} date Full date object
   * @param {Array} events Events for this date
   * @param {boolean} otherMonth Whether this date is from adjacent month
   * @param {boolean} isToday Whether this date is today
   * @returns {string} HTML for calendar date cell
   */
  function createCalendarDateHTML(day, date, events, otherMonth = false, isToday = false) {
    const classNames = ['calendar-date'];
    if (otherMonth) classNames.push('other-month');
    if (isToday) classNames.push('today');
    
    let eventDotsHTML = '';
    let popoverHTML = '';
    
    if (events.length > 0) {
      // Create event dots
      const platforms = new Set(events.map(event => event.platform));
      platforms.forEach(platform => {
        eventDotsHTML += `<div class="date-event-dot ${platform}"></div>`;
      });
      
      // Create popover content
      popoverHTML = `
        <div class="calendar-popover">
          <div class="calendar-popover-date">${formatDate(date)}</div>
          <div class="calendar-popover-events">
            ${events.map(event => `
              <div class="popover-event">
                <div class="popover-event-platform" style="color: var(--${event.platform})">
                  ${capitalizeFirstLetter(event.platform)}
                </div>
                <div class="popover-event-name">${event.name}</div>
                <div class="popover-event-time">${formatTime(event.startTime)} - ${formatTime(event.endTime)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    return `
      <div class="${classNames.join(' ')}">
        <div class="date-number">${day}</div>
        <div class="date-events">${eventDotsHTML}</div>
        ${popoverHTML}
      </div>
    `;
  }
  
  /**
   * Get contests occurring on a specific date
   * @param {Date} date Date to check
   * @param {Array} contests Array of contest objects
   * @returns {Array} Array of contests occurring on the date
   */
  function getContestsForDate(date, contests) {
    return contests.filter(contest => {
      const contestDate = new Date(contest.startTime);
      return contestDate.getDate() === date.getDate() &&
             contestDate.getMonth() === date.getMonth() &&
             contestDate.getFullYear() === date.getFullYear();
    });
  }
  
  /**
   * Format date for display
   * @param {Date} date Date to format
   * @returns {string} Formatted date
   */
  function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }
  
  /**
   * Format time for display
   * @param {Date} date Date object to extract time from
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
   * Capitalize first letter of a string
   * @param {string} string String to capitalize
   * @returns {string} Capitalized string
   */
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
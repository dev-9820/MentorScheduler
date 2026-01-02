// Timezone offset mapping (UTC offsets for each timezone)
const TIMEZONE_OFFSETS = {
  'Asia/Kolkata': 5.5, // UTC+5:30
  'America/Sao_Paulo': -3, // UTC-3
  'America/New_York': -5, // UTC-5
  'Europe/London': 0, // UTC+0
  'Asia/Tokyo': 9, // UTC+9
  'Australia/Sydney': 11, // UTC+11
};

/**
 * Get timezone offset in hours
 * @param {string} timezone - Timezone string (e.g., 'Asia/Kolkata')
 * @returns {number} Offset in hours (can be decimal like 5.5)
 */
export const getTimezoneOffset = (timezone) => {
  return TIMEZONE_OFFSETS[timezone] || 0;
};

/**
 * Calculate the difference between two timezones
 * @param {string} menteeTimezone - Mentee's timezone
 * @param {string} mentorTimezone - Mentor's timezone
 * @returns {number} Difference in hours (positive means mentor is ahead)
 */
export const calculateTimezoneOffset = (menteeTimezone, mentorTimezone) => {
  const menteeOffset = getTimezoneOffset(menteeTimezone);
  const mentorOffset = getTimezoneOffset(mentorTimezone);
  return mentorOffset - menteeOffset;
};

/**
 * Format timezone offset as human-readable string
 * @param {number} offsetHours - Offset in hours
 * @returns {string} Formatted string (e.g., "+5:30", "-3:00")
 */
export const formatTimezoneOffset = (offsetHours) => {
  const sign = offsetHours >= 0 ? '+' : '';
  const hours = Math.floor(Math.abs(offsetHours));
  const minutes = Math.round((Math.abs(offsetHours) % 1) * 60);
  
  const minutesStr = minutes === 0 ? '00' : minutes.toString().padStart(2, '0');
  return `${sign}${hours}:${minutesStr}`;
};

/**
 * Get timezone label with offset relative to mentee
 * @param {string} menteeTimezone
 * @param {string} mentorTimezone
 * @returns {string} Formatted label
 */
export const getTimezoneLabel = (menteeTimezone, mentorTimezone) => {
  const offset = calculateTimezoneOffset(menteeTimezone, mentorTimezone);
  
  if (offset === 0) {
    return 'Same Timezone';
  }
  
  const sign = offset > 0 ? 'ahead' : 'behind';
  const absOffset = formatTimezoneOffset(Math.abs(offset));
  return `${absOffset} hrs ${sign}`;
};

/**
 * Convert time string to mentor's local time
 * @param {string} timeStr - Time in 24-hour format (e.g., "14:00")
 * @param {number} offsetHours - Timezone offset in hours
 * @returns {string} Converted time in mentor's timezone
 */
export const convertTimeToMentorTZ = (timeStr, offsetHours) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  // Create a date object (using arbitrary date)
  let newHours = hours + offsetHours;
  let dayOffset = 0;
  
  // Handle day boundary
  if (newHours >= 24) {
    dayOffset = 1;
    newHours -= 24;
  } else if (newHours < 0) {
    dayOffset = -1;
    newHours += 24;
  }
  
  const hoursStr = Math.floor(newHours).toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');
  
  return {
    time: `${hoursStr}:${minutesStr}`,
    dayOffset, // 0 = same day, 1 = next day, -1 = previous day
  };
};

/**
 * Get timezone abbreviation from timezone string
 * @param {string} timezone - Timezone string
 * @returns {string} Abbreviation
 */
export const getTimezoneAbbr = (timezone) => {
  const parts = timezone.split('/');
  return parts[parts.length - 1]; // Returns last part (e.g., 'Kolkata', 'Sao_Paulo')
};

/**
 * Format time with timezone context
 * @param {string} timeStr - Time in format "HH:mm"
 * @param {string} timezone - Timezone
 * @returns {string} Formatted time with timezone
 */
export const formatTimeWithTimezone = (timeStr, timezone) => {
  const abbr = getTimezoneAbbr(timezone);
  return `${timeStr} (${abbr})`;
};

// Shared date utility functions
const TODAY = '2026-03-26'; // Reference date

/**
 * Get a date relative to today with offset in days
 * @param daysOffset Number of days to offset from today (negative for past, positive for future)
 * @returns Formatted date string (DD/MM/YYYY)
 */
export const getRelativeDate = (daysOffset: number): string => {
  const date = new Date(TODAY);
  date.setDate(date.getDate() + daysOffset);
  return date.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
};

/**
 * Get a formatted date for form inputs (YYYY-MM-DD)
 * @param daysOffset Number of days to offset from today
 * @returns ISO date string (YYYY-MM-DD)
 */
export const getFormattedDate = (daysOffset: number): string => {
  const date = new Date(TODAY);
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

/**
 * Format a date string to display format
 * @param dateString ISO date string
 * @returns Formatted date string (DD/MM/YYYY)
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
};

/**
 * Get relative time description (e.g., "2 days ago", "in 3 days")
 * @param daysOffset Number of days offset
 * @returns Human-readable time description
 */
export const getRelativeTimeDescription = (daysOffset: number): string => {
  const absDays = Math.abs(daysOffset);
  
  if (daysOffset === 0) return 'Today';
  if (daysOffset === -1) return 'Yesterday';
  if (daysOffset === 1) return 'Tomorrow';
  if (daysOffset < 0) return `${absDays} days ago`;
  return `in ${absDays} days`;
};

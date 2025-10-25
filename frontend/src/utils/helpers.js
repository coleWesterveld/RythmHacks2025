// Helper utility functions

/**
 * Format epsilon value for display
 * @param {number} epsilon - Epsilon value
 * @returns {string} - Formatted string
 */
export const formatEpsilon = (epsilon) => {
  return `ε ${epsilon.toFixed(1)}`;
};

/**
 * Calculate percentage of budget remaining
 * @param {number} spent - Epsilon spent
 * @param {number} total - Total epsilon budget
 * @returns {number} - Percentage (0-100)
 */
export const calculateBudgetPercentage = (spent, total) => {
  return ((total - spent) / total) * 100;
};

/**
 * Get color class based on budget percentage
 * @param {number} percentage - Budget percentage remaining
 * @returns {string} - Tailwind color class
 */
export const getBudgetColor = (percentage) => {
  if (percentage > 60) return 'green';
  if (percentage > 30) return 'yellow';
  return 'red';
};

/**
 * Format timestamp for display
 * @param {string|Date} timestamp - Timestamp to format
 * @returns {string} - Formatted string
 */
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Generate a random query ID
 * @returns {string} - Query ID
 */
export const generateQueryId = () => {
  return 'QRY-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

/**
 * Format large numbers with commas
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Download data as JSON file
 * @param {object} data - Data to download
 * @param {string} filename - Filename
 */
export const downloadJSON = (data, filename = 'data.json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default {
  formatEpsilon,
  calculateBudgetPercentage,
  getBudgetColor,
  formatTimestamp,
  truncateText,
  isValidEmail,
  generateQueryId,
  formatNumber,
  downloadJSON,
};


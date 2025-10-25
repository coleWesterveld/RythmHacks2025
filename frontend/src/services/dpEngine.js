// Differential Privacy Engine functions

/**
 * Calculate the amount of noise to add based on epsilon
 * @param {number} epsilon - Privacy parameter
 * @param {number} sensitivity - Query sensitivity
 * @returns {number} - Noise magnitude
 */
export const calculateNoise = (epsilon, sensitivity = 1) => {
  return sensitivity / epsilon;
};

/**
 * Add Laplace noise to a query result
 * @param {number} trueValue - The actual query result
 * @param {number} epsilon - Privacy parameter
 * @param {number} sensitivity - Query sensitivity
 * @returns {number} - Noisy result
 */
export const addLaplaceNoise = (trueValue, epsilon, sensitivity = 1) => {
  const scale = sensitivity / epsilon;
  const u = Math.random() - 0.5;
  const noise = -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
  return trueValue + noise;
};

/**
 * Calculate accuracy estimate (confidence interval)
 * @param {number} epsilon - Privacy parameter
 * @param {number} sensitivity - Query sensitivity
 * @param {number} confidence - Confidence level (default 95%)
 * @returns {number} - Accuracy bound
 */
export const calculateAccuracyBound = (epsilon, sensitivity = 1, confidence = 0.95) => {
  const scale = sensitivity / epsilon;
  return scale * Math.log(2 / (1 - confidence));
};

/**
 * Validate if a query can be executed with remaining budget
 * @param {number} requestedEpsilon - Epsilon for the query
 * @param {number} remainingBudget - User's remaining epsilon budget
 * @returns {object} - Validation result
 */
export const validateBudget = (requestedEpsilon, remainingBudget) => {
  if (requestedEpsilon > remainingBudget) {
    return {
      valid: false,
      message: `Insufficient budget. You have ${remainingBudget.toFixed(1)} ε remaining, but this query requires ${requestedEpsilon.toFixed(1)} ε.`
    };
  }
  
  if (remainingBudget - requestedEpsilon < 0.1) {
    return {
      valid: true,
      warning: 'This query will exhaust most of your remaining budget.'
    };
  }

  return { valid: true };
};

/**
 * Estimate query sensitivity based on query type
 * @param {string} queryType - Type of query (count, sum, average, etc.)
 * @param {object} dataStats - Statistics about the data
 * @returns {number} - Estimated sensitivity
 */
export const estimateSensitivity = (queryType, dataStats = {}) => {
  switch (queryType) {
    case 'count':
      return 1; // Adding/removing one person changes count by 1
    case 'sum':
      return dataStats.maxValue || 100; // Maximum possible contribution
    case 'average':
      return (dataStats.maxValue || 100) / (dataStats.minCount || 100);
    case 'histogram':
      return 1; // Similar to count
    default:
      return 1;
  }
};

/**
 * Generate a privacy certificate for a query result
 * @param {object} queryInfo - Information about the executed query
 * @returns {object} - Privacy certificate
 */
export const generatePrivacyCertificate = (queryInfo) => {
  return {
    queryId: queryInfo.id,
    epsilon: queryInfo.epsilon,
    timestamp: new Date().toISOString(),
    guarantee: `This result satisfies ${queryInfo.epsilon}-differential privacy`,
    explanation: `With probability at least ${((1 - Math.exp(-queryInfo.epsilon)) * 100).toFixed(1)}%, no individual's participation in the dataset can be determined from this result.`,
    verificationHash: generateVerificationHash(queryInfo)
  };
};

/**
 * Generate a verification hash for audit purposes
 * @param {object} data - Data to hash
 * @returns {string} - Hash string
 */
const generateVerificationHash = (data) => {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).toUpperCase();
};

export default {
  calculateNoise,
  addLaplaceNoise,
  calculateAccuracyBound,
  validateBudget,
  estimateSensitivity,
  generatePrivacyCertificate,
};


// API Service - handles all HTTP requests to the backend
// This is the ONLY place in the frontend where we make API calls
// The base URL comes from environment variables (VITE_API_BASE_URL)

// Get the backend API URL from environment variables
// In development: http://localhost:5000/api
// In production: https://your-backend.onrender.com/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Generic function to make API requests
 * All other functions in this file use this helper
 * @param {string} endpoint - the API path (e.g., '/weddings')
 * @param {Object} options - fetch options (method, body, etc.)
 * @returns {Object} - the JSON response from the server
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  // If there's a body object, convert it to JSON string
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  // If the server returned an error status, throw an error
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// =====================
// WEDDING API CALLS
// =====================

// Create a new wedding
export const createWedding = (weddingData) => {
  return apiRequest('/weddings', {
    method: 'POST',
    body: weddingData,
  });
};

// Get all weddings
export const getAllWeddings = () => {
  return apiRequest('/weddings');
};

// Get a single wedding by ID
export const getWeddingById = (id) => {
  return apiRequest(`/weddings/${id}`);
};

// Update a wedding
export const updateWedding = (id, weddingData) => {
  return apiRequest(`/weddings/${id}`, {
    method: 'PUT',
    body: weddingData,
  });
};

// Delete a wedding
export const deleteWedding = (id) => {
  return apiRequest(`/weddings/${id}`, {
    method: 'DELETE',
  });
};

// =====================
// FUNCTION API CALLS
// =====================

// Create a new function for a wedding
export const createFunction = (functionData) => {
  return apiRequest('/functions', {
    method: 'POST',
    body: functionData,
  });
};

// Get all functions for a wedding
export const getWeddingFunctions = (weddingId) => {
  return apiRequest(`/weddings/${weddingId}/functions`);
};

// Delete a function
export const deleteFunction = (id) => {
  return apiRequest(`/functions/${id}`, {
    method: 'DELETE',
  });
};

// =====================
// AI API CALLS
// =====================

// Generate function-wise video plan
export const generateFunctionVideoPlan = (weddingId, functionId) => {
  return apiRequest('/ai/function-video-plan', {
    method: 'POST',
    body: { weddingId, functionId },
  });
};

// Generate overall wedding highlight video plan
export const generateHighlightVideoPlan = (weddingId) => {
  return apiRequest('/ai/highlight-video-plan', {
    method: 'POST',
    body: { weddingId },
  });
};

// Generate album design suggestions
export const generateAlbumDesign = (weddingId) => {
  return apiRequest('/ai/album-design', {
    method: 'POST',
    body: { weddingId },
  });
};

// =====================
// RETRIEVAL API CALLS
// =====================

// Get all video plans for a wedding
export const getWeddingVideoPlans = (weddingId) => {
  return apiRequest(`/weddings/${weddingId}/video-plans`);
};

// Get all album designs for a wedding
export const getWeddingAlbumDesigns = (weddingId) => {
  return apiRequest(`/weddings/${weddingId}/album-designs`);
};

// Health check
export const healthCheck = () => {
  return apiRequest('/health');
};

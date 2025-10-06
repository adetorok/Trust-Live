const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.trustclinicalservices.com/api';
const DEFAULT_TIMEOUT_MS = 12000; // 12s network timeout

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || DEFAULT_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      },
      signal: controller.signal
    });

    if (!response.ok) {
      let message = 'Request failed';
      try {
        const error = await response.json();
        message = error?.error || error?.message || message;
      } catch {
        // no json
      }
      throw new Error(message);
    }

    return response.json();
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
};

export const api = {
  // Auth endpoints
  login: async (credentials) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout: async () => {
    return apiCall('/auth/logout', {
      method: 'POST',
    });
  },

  getProfile: async () => {
    return apiCall('/auth/profile');
  },

  // Admin endpoints
  get: async (endpoint) => {
    return apiCall(endpoint);
  },

  post: async (endpoint, data) => {
    return apiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put: async (endpoint, data) => {
    return apiCall(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (endpoint) => {
    return apiCall(endpoint, {
      method: 'DELETE',
    });
  },

  // Health check
  health: async () => {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.json();
  }
};

export default api;

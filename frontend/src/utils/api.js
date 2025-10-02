const API_BASE_URL = '/api';

export const api = {
  // Submit sponsor quote request
  submitSponsorQuote: async (data) => {
    const response = await fetch(`${API_BASE_URL}/quotes/sponsor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit quote request');
    }
    
    return response.json();
  },

  // Submit site quote request
  submitSiteQuote: async (data) => {
    const response = await fetch(`${API_BASE_URL}/quotes/site`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit quote request');
    }
    
    return response.json();
  },

  // Verify authentication token
  verifyToken: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify?token=${token}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Token verification failed');
    }
    
    return response.json();
  },

  // Submit meeting request
  submitMeetingRequest: async (data) => {
    const response = await fetch(`${API_BASE_URL}/meetings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit meeting request');
    }
    
    return response.json();
  },
};


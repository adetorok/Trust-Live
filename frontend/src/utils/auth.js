const SESSION_KEY = 'tracs_session';

export const auth = {
  // Store session data
  setSession: (userData) => {
    const sessionData = {
      ...userData,
      timestamp: Date.now(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  },

  // Get session data
  getSession: () => {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (!sessionData) return null;
      
      const parsed = JSON.parse(sessionData);
      
      // Check if session is expired (24 hours)
      const isExpired = Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000;
      if (isExpired) {
        auth.clearSession();
        return null;
      }
      
      return parsed;
    } catch (error) {
      console.error('Error parsing session data:', error);
      auth.clearSession();
      return null;
    }
  },

  // Clear session data
  clearSession: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return auth.getSession() !== null;
  },

  // Get user scope (sponsor or site)
  getUserScope: () => {
    const session = auth.getSession();
    return session?.scope || null;
  },

  // Check if user has access to a specific scope
  hasAccess: (requiredScope) => {
    const userScope = auth.getUserScope();
    return userScope === requiredScope;
  },
};


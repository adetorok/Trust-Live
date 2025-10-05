// Auth utility functions
export const auth = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  // Get stored auth token
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Store auth token
  setToken: (token) => {
    localStorage.setItem('authToken', token);
  },

  // Remove auth token
  removeToken: () => {
    localStorage.removeItem('authToken');
  },

  // Get user info from localStorage
  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Store user info
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Clear user info
  clearUser: () => {
    localStorage.removeItem('user');
  },

  // Logout user
  logout: () => {
    auth.removeToken();
    auth.clearUser();
  }
};

export default auth;

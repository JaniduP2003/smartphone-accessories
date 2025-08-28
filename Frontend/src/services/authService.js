import axios from "axios";

const API_URL = "http://localhost:8080/api";

// Create axios instance with common configurations
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response);
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { message: error.message || 'An error occurred' };
  }
);

// Authentication services
export const signIn = async ({ email, password }) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signUp = async ({ username, email, password, role = 'CUSTOMER' }) => {
  try {
    const response = await apiClient.post('/auth/register', { 
      username, 
      email, 
      password,
      role
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await apiClient.post('/password/forgot', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to send reset email" };
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await apiClient.post('/password/reset', { 
      token, 
      newPassword 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Password reset failed" };
  }
};

// User session management
export const getUserFromStorage = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');
  const email = localStorage.getItem('email');
  const username = localStorage.getItem('username');
  const customerId = localStorage.getItem('customerId');
  
  if (token && userId && role) {
    return { token, userId, role, email, username, customerId };
  }
  return null;
};

export const setUserToStorage = (userData) => {
  localStorage.setItem('token', userData.token);
  localStorage.setItem('userId', userData.userId);
  localStorage.setItem('role', userData.role);
  localStorage.setItem('email', userData.email);
  if (userData.username) {
    localStorage.setItem('username', userData.username);
  }
  if (userData.customerId) {
    localStorage.setItem('customerId', userData.customerId);
  }
};

export const clearUserFromStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  localStorage.removeItem('email');
  localStorage.removeItem('username');
  localStorage.removeItem('customerId');
};
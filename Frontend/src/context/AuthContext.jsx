import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from local storage on component mount
  useEffect(() => {
    try {
      const storedUser = authService.getUserFromStorage();
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Error loading user from storage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.signIn({ email, password });
      console.log("Login response:", response); // Debug log

      // Ensure we have the required fields
      if (!response.token || !response.role) {
        throw new Error('Invalid response from server');
      }

      const userData = {
        token: response.token,
        userId: response.userId,
        customerId: response.customerId,
        role: response.role,
        email: response.email,
        username: response.username
      };

      console.log("Storing user data:", userData); // Debug log
      setUser(userData);
      authService.setUserToStorage(userData);
      
      // Redirect based on role
      if (userData.role === 'ADMIN') {
        navigate('/Dashboard');
      } else {
        navigate('/phones');
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.clearUserFromStorage();
    setUser(null);
    navigate('/');
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.signUp(userData);
      return response;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      return await authService.requestPasswordReset(email);
    } catch (error) {
      console.error("Password reset request error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const validateResetToken = async (token) => {
    try {
      setLoading(true);
      return await authService.validateResetToken(token);
    } catch (error) {
      console.error("Token validation error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      return await authService.resetPassword(token, newPassword);
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // The value object that will be passed to components
  const contextValue = {
    user, 
    loading, 
    login, 
    logout, 
    register, 
    requestPasswordReset,
    validateResetToken, 
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isCustomer: user?.role === 'CUSTOMER'
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
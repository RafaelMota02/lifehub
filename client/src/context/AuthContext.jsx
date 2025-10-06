import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setLoading(false);
    } else if (token) {
      // Verify token validity if userData is missing
      const verifyUrl = import.meta.env.PROD
        ? 'https://lifehub-production.up.railway.app/api/auth/verify'
        : 'http://localhost:5000/api/auth/verify';

      fetch(verifyUrl, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        if (response.ok) return response.json();
        throw new Error('Token verification failed');
      })
      .then(data => {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);
  
  // Persist user state to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const loginUrl = import.meta.env.PROD
        ? 'https://lifehub-production.up.railway.app/api/auth/login'
        : 'http://localhost:5000/api/auth/login';

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) throw new Error('Login failed');
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      navigate('/');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (username, email, password) => {
    try {
      const registerUrl = import.meta.env.PROD
        ? 'https://lifehub-production.up.railway.app/api/auth/register'
        : 'http://localhost:5000/api/auth/register';

      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      
      if (!response.ok) throw new Error('Registration failed');
      
      const data = await response.json();
      return { success: true, user: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

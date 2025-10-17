import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Settings Context
const SettingsContext = createContext();

// Custom hook to use the Settings Context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Settings Provider Component
export const SettingsProvider = ({ children }) => {
  // Initialize settings from localStorage
  const [settings, setSettings] = useState(() => ({
    theme: localStorage.getItem('theme') || 'light',
    language: localStorage.getItem('language') || 'en',
    timezone: localStorage.getItem('timezone') || 'UTC',
    notifications: JSON.parse(localStorage.getItem('notifications') || 'true')
  }));

  // Apply theme changes
  useEffect(() => {
    const applyTheme = (themeValue) => {
      if (themeValue === 'auto') {
        // Check system preference
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', isDark);
      } else {
        document.documentElement.classList.toggle('dark', themeValue === 'dark');
      }
      localStorage.setItem('theme', themeValue);
    };

    applyTheme(settings.theme);

    // Listen for system theme changes only in auto mode
    if (settings.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        document.documentElement.classList.toggle('dark', mediaQuery.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  // Update localStorage when settings change
  useEffect(() => {
    Object.entries(settings).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.setItem(key, value);
      }
    });
  }, [settings]);

  // Update individual settings
  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Update multiple settings at once
  const updateSettings = (newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  // Reset settings to defaults
  const resetSettings = () => {
    const defaults = {
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
      notifications: true
    };
    setSettings(defaults);
  };

  // Get formatted date/time based on user's timezone
  const formatDate = (date, options = {}) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString(settings.language, {
      timeZone: settings.timezone,
      ...options
    });
  };

  const formatDateTime = (date, options = {}) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString(settings.language, {
      timeZone: settings.timezone,
      ...options
    });
  };

  const contextValue = {
    ...settings,
    updateSetting,
    updateSettings,
    resetSettings,
    formatDate,
    formatDateTime
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;

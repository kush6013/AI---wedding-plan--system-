// AppContext - provides global state to all components
// This avoids "prop drilling" (passing data through many component layers)
// Instead, any component can access the shared state using useContext

import { createContext, useContext, useState, useCallback } from 'react';

// Create the context object
const AppContext = createContext();

// Custom hook to use the context in any component
// Usage: const { weddings, loading } = useApp();
// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// The Provider component wraps the entire app and provides state
export const AppProvider = ({ children }) => {
  // Track loading state for showing spinners
  const [loading, setLoading] = useState(false);

  // Track error messages
  const [error, setError] = useState('');

  // Clear error message after some time
  const clearError = useCallback(() => {
    setError('');
  }, []);

  // Show error for 5 seconds then auto-clear
  const showError = useCallback((message) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  }, []);

  // Values that will be available to all components
  const value = {
    loading,
    setLoading,
    error,
    setError: showError,
    clearError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

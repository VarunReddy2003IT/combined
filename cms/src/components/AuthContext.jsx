import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check if user session exists in localStorage
    const storedUser = localStorage.getItem('user');
    return !!storedUser; // Return true if user exists
  });

  const [user, setUser] = useState(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Function to log in the user
  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData); // Store user data in memory
    localStorage.setItem('user', JSON.stringify(userData)); // Persist user in localStorage
  };

  // Function to log out the user
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user'); // Clear session data from localStorage
  };

  // Restore session from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

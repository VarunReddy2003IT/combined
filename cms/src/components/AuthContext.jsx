import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Safely check if localStorage is available
    if (typeof window !== "undefined" && localStorage) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setIsLoggedIn(true);
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    if (typeof window !== "undefined" && localStorage) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    if (typeof window !== "undefined" && localStorage) {
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

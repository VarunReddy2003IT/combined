import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  // Load auth from sessionStorage on initialization
  useEffect(() => {
    const storedAuth = sessionStorage.getItem('auth');
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  const login = (userData) => {
    setAuth(userData);
    sessionStorage.setItem('auth', JSON.stringify(userData)); // Save to sessionStorage
  };

  const logout = () => {
    setAuth(null);
    sessionStorage.removeItem('auth'); // Clear from sessionStorage
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

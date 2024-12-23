import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function Logout() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    // Safely clear user data from localStorage
    try {
      if (typeof localStorage !== 'undefined' && localStorage) {
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }

    // Update the AuthContext state
    logout();

    // Ensure navigation happens after state update
    setTimeout(() => {
      navigate('/'); // Redirect to home page after logout
    }, 100); // Small delay to ensure state change is processed
  }, [navigate, logout]);

  return null; // No UI needed, as this is a functional redirect component
} 

export default Logout;

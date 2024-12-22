import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user data from localStorage
    localStorage.removeItem('user');

    // Navigate to login page after logout
    navigate('/login');
  }, [navigate]);

  return null; // No UI needed, as this is a functional redirect component
}

export default Logout;

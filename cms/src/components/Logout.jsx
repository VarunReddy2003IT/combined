import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './components/AuthContext';

function Logout() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    // Perform the logout logic
    logout(); // Update AuthContext state

    // Navigate to the home page after logout
    navigate('/'); // Redirect to home page or login page
  }, [logout, navigate]);

  return null; // No UI needed for logout redirect
}

export default Logout;

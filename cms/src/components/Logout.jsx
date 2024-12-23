import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function Logout() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    logout(); // Update the AuthContext state immediately

    // Redirect after the state update
    setTimeout(() => {
      navigate('/'); // Redirect to the home page after logout
    }, 100); // Short delay to ensure the state is updated before redirecting
  }, [navigate, logout]);

  return null; // No UI required
}

export default Logout;

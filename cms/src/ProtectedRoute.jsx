import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './components/AuthContext';

// This component will protect routes based on login state
const ProtectedRoute = ({ element }) => {
  const { isLoggedIn } = useContext(AuthContext);

  // If the user is logged in, redirect to home page (or any other page)
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  // If the user is not logged in, allow access to the route
  return element;
};

export default ProtectedRoute;

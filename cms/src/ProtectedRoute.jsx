import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './components/AuthContext';

const ProtectedRoute = ({ element, redirectTo, inverse = false }) => {
  const { isLoggedIn } = useContext(AuthContext);

  if (inverse) {
    // Redirect if logged in (for login/signup pages)
    return isLoggedIn ? <Navigate to={redirectTo} /> : element;
  }

  // Redirect if not logged in (for protected pages)
  return isLoggedIn ? element : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;

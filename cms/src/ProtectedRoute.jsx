import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './components/AuthContext';

const ProtectedRoute = ({ element, redirectTo, inverse = false }) => {
  const { isLoggedIn } = useContext(AuthContext);

  // If inverse is true, it means the route is for login/signup (user should be logged out)
  if (inverse) {
    return !isLoggedIn ? element : <Navigate to={redirectTo} />;
  }

  // If inverse is false, it means the route is for protected pages (user should be logged in)
  return isLoggedIn ? element : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;

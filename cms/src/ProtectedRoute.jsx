import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './components/AuthContext';

function ProtectedRoute({ element, redirectTo, inverse = false }) {
  const { auth } = useContext(AuthContext);

  if (inverse) {
    // Allow access if user is NOT authenticated
    return auth ? <Navigate to={redirectTo} /> : element;
  }

  // Allow access if user IS authenticated
  return auth ? element : <Navigate to={redirectTo} />;
}

export default ProtectedRoute;

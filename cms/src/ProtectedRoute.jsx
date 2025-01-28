import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './components/AuthContext';

const ProtectedRoute = ({ element, redirectTo, inverse = false }) => {
  const { user } = useContext(AuthContext);

  const isAuthenticated = user || localStorage.getItem('user');

  if (inverse && isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  if (!inverse && !isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  return element;
};

export default ProtectedRoute;

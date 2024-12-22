import React from 'react';
import { useLocation } from 'react-router-dom';

function SuccessPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const role = params.get('role');

  return (
    <div className="success-page">
      <h2>Login Successful</h2>
      <p>Welcome, {role.charAt(0).toUpperCase() + role.slice(1)}!</p>
    </div>
  );
}

export default SuccessPage;

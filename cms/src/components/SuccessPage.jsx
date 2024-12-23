import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const role = params.get('role');

  // Handle the case when 'role' is not present in the URL
  if (!role) {
    return (
      <div className="error-page">
        <h2>Error: Role not found</h2>
        <p>The role information is missing. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="success-page">
      <h2>Login Successful</h2>
      <p>Welcome, {role.charAt(0).toUpperCase() + role.slice(1)}!</p>

      <div>
        <button onClick={() => navigate('/app')}>Go to Dashboard</button>
        <button onClick={() => navigate('/logout')}>Logout</button>
      </div>
    </div>
  );
}

export default SuccessPage;

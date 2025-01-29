import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const role = localStorage.getItem('userRole');
  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!role || !email) {
        setError('Role and email are required. Please login again.');
        setLoading(false);
        return;
      }

      try {
        console.log('Attempting to fetch data for:', { role, email });
        
        const response = await fetch(`https://finalbackend-8.onrender.com/api/profile?email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}`);
        const result = await response.json();

        console.log('API Response:', result);

        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch user data');
        }

        console.log('User Data:', result.data);
        setUserData(result.data);
      } catch (err) {
        console.error('Error details:', err);
        setError(err.message || 'An error occurred while fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [email, role]);

  if (!role || !email) {
    return (
      <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
        Please login to view your profile
      </div>
    );
  }

  if (loading) {
    console.log('Loading profile data...');
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        Loading profile...
      </div>
    );
  }

  if (error) {
    console.log('Error state:', error);
    return (
      <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '400px',
      margin: '20px auto',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      backgroundColor: 'white'
    }}>
      <h1 style={{
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333'
      }}>
        {role.charAt(0).toUpperCase() + role.slice(1)} Profile
      </h1>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        <div>
          <label style={{ fontWeight: 'bold', color: '#666' }}>Name:</label>
          <div>{userData?.name || 'Not available'}</div>
        </div>

        <div>
          <label style={{ fontWeight: 'bold', color: '#666' }}>Email:</label>
          <div>{userData?.email || 'Not available'}</div>
        </div>

        <div>
          <label style={{ fontWeight: 'bold', color: '#666' }}>Role:</label>
          <div>{role}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
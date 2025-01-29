import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const role = localStorage.getItem('userRole');
  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Pass role in the query to determine which database to query
        const response = await fetch(`https://finalbackend-8.onrender.com/api/profile?email=${email}&role=${role}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [email, role]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
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
          <div>{userData?.name}</div>
        </div>
        
        <div>
          <label style={{ fontWeight: 'bold', color: '#666' }}>Email:</label>
          <div>{email}</div>
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
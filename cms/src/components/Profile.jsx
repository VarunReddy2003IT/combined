import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [notification, setNotification] = useState(null);

  const role = localStorage.getItem('userRole');
  const email = localStorage.getItem('userEmail');
  const club = localStorage.getItem('userClub');

  const clubs = [
    'YES', 'NSS1', 'NSS2', 'YouthForSeva', 'YFS', 'WeAreForHelp', 'HOH', 
    'Vidyadaan', 'Rotract', 'GCCC', 'IEEE', 'CSI', 'AlgoRhythm', 'OpenForge', 
    'VLSID', 'SEEE', 'Sports'
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (!role || !email) {
        setError('Role and email are required. Please login again.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://finalbackend-8.onrender.com/api/profile?email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch user data');
        }

        setUserData(result.data);

        if (role === 'member') {
          const clubsResponse = await fetch(`https://finalbackend-8.onrender.com/api/club-selection/selected-clubs/${email}`);
          const clubsData = await clubsResponse.json();
          setSelectedClubs(clubsData.selectedClubs || []);
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [email, role]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    try {
      const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dc2qstjvr/image/upload', {
        method: 'POST',
        body: formData,
      });

      const cloudinaryData = await cloudinaryResponse.json();
      if (!cloudinaryData.secure_url) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      const updateResponse = await fetch('https://finalbackend-8.onrender.com/api/profile/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          role,
          imageUrl: cloudinaryData.secure_url,
        }),
      });

      const updateResult = await updateResponse.json();

      if (!updateResult.success) {
        throw new Error(updateResult.message || 'Failed to update profile');
      }

      setUserData((prev) => ({ ...prev, imageUrl: cloudinaryData.secure_url }));
      showNotification('Profile image updated successfully');
    } catch (err) {
      showNotification(err.message || 'Error uploading image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleClubSelection = async () => {
    if (!selectedClub) return;

    try {
      const response = await fetch('https://finalbackend-8.onrender.com/api/club-selection/select-clubs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          selectedClub
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to select club');
      }

      setSelectedClubs([...selectedClubs, selectedClub]);
      setSelectedClub('');
      showNotification(data.message);
    } catch (err) {
      showNotification(err.message || 'Error selecting club', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  if (!role || !email) {
    return (
      <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
        Please login to view your profile
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '20px auto',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      backgroundColor: 'white',
    }}>
      {notification && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '4px',
          backgroundColor: notification.type === 'error' ? '#ffebee' : '#e8f5e9',
          color: notification.type === 'error' ? '#c62828' : '#2e7d32',
          textAlign: 'center',
        }}>
          {notification.message}
        </div>
      )}

      {/* Profile Image */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {userData?.imageUrl ? (
          <img
            src={userData.imageUrl}
            alt="Profile"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
          }}>
            No Image
          </div>
        )}
      </div>

      {/* Image Upload */}
      {!userData?.imageUrl && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            style={{ marginBottom: '10px' }}
          />
          {uploading && <div>Uploading...</div>}
        </div>
      )}

      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        {role.charAt(0).toUpperCase() + role.slice(1)} Profile
      </h1>

      {/* Profile Information */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
            Name:
          </label>
          <div>{userData?.name || 'Not available'}</div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
            Email:
          </label>
          <div>{userData?.email || 'Not available'}</div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
            Role:
          </label>
          <div>
            {role}
            {role === 'lead' && club && ` - ${club}`}
          </div>
        </div>
      </div>

      {/* Club Selection for Members */}
      {role === 'member' && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>Club Selection</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ marginBottom: '10px' }}>Selected Clubs:</h4>
            {selectedClubs.length > 0 ? (
              <ul style={{ paddingLeft: '20px' }}>
                {selectedClubs.map((club, index) => (
                  <li key={index}>{club}</li>
                ))}
              </ul>
            ) : (
              <p>No clubs selected yet</p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
            >
              <option value="">Select a club</option>
              {clubs
                .filter(club => !selectedClubs.includes(club))
                .map((club, index) => (
                  <option key={index} value={club}>{club}</option>
                ))}
            </select>
            <button
              onClick={handleClubSelection}
              disabled={!selectedClub}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedClub ? '#007bff' : '#cccccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: selectedClub ? 'pointer' : 'not-allowed',
              }}
            >
              Add Club
            </button>
          </div>
        </div>
      )}

      {/* Admin Link */}
      {role === 'admin' && (
        <Link
          to="/admin-profile"
          style={{
            display: 'block',
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            textAlign: 'center',
            borderRadius: '4px',
            textDecoration: 'none',
            marginTop: '20px',
          }}
        >
          View All Profiles
        </Link>
      )}
    </div>
  );
};

export default Profile;
// Profile.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('https://finalbackend-8.onrender.com/api/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },  // Assuming token-based auth
        });
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch profile data');
      }
    };

    fetchUserProfile();
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');  // Remove token from localStorage
    navigate('/login');  // Redirect to login page
  };

  // Handle Image Upload
  const handleImageUpload = async (e) => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'profile_image'); // Assuming you're using Cloudinary's preset

    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/dc2qstjvr/image/upload', formData);
      const imageUrl = response.data.secure_url;

      // Update the user's image URL in the backend
      await axios.put(`https://finalbackend-8.onrender.com/api/profile/update-image/${user.email}`, { imageUrl }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });

      setUser((prevState) => ({ ...prevState, imageUrl })); // Update profile with new image
    } catch (err) {
      setError('Failed to upload image');
    }
  };

  // Render profile details
  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {error && <p className="error-message">{error}</p>}
      {user ? (
        <div className="profile-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>College ID:</strong> {user.collegeId}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          {user.role === 'lead' && <p><strong>Club:</strong> {user.club}</p>}
          {user.imageUrl && <img src={user.imageUrl} alt="Profile" />}
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setImage(e.target.files[0])} 
          />
          <button onClick={handleImageUpload}>Upload Image</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}

export default Profile;

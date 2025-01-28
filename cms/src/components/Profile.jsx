import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

function Profile() {
  const [profileData, setProfileData] = useState({
    name: '',
    location: '',
    role: '',
    club: '',
    avatar: '',
    stats: {
      friends: 0,
      photos: 0,
      comments: 0
    }
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        const response = await axios.get(`https://finalbackend-8.onrender.com/api/profile/${email}`);
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('email', localStorage.getItem('userEmail'));

      try {
        const response = await axios.post('https://finalbackend-8.onrender.com/api/upload-avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setProfileData(prev => ({
          ...prev,
          avatar: response.data.avatarUrl
        }));
      } catch (error) {
        console.error('Error uploading avatar:', error);
      }
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <button className="icon-button">
            <i className="icon-connect"></i>
            Connect
          </button>
          <button className="icon-button">
            <i className="icon-message"></i>
            Message
          </button>
        </div>

        <div className="profile-content">
          <div className="avatar-container">
            <img
              src={profileData.avatar || "/default-avatar.png"}
              alt="Profile"
              className="avatar"
            />
            <label className="avatar-upload">
              <i className="icon-camera"></i>
              <input
                type="file"
                onChange={handleFileUpload}
                accept="image/*"
                hidden
              />
            </label>
          </div>

          <h1 className="profile-name">{profileData.name}</h1>
          <p className="profile-location">{profileData.location}</p>
          
          <div className="profile-details">
            <p className="profile-role">{profileData.role}</p>
            {profileData.club && (
              <p className="profile-club">{profileData.club}</p>
            )}
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{profileData.stats.friends}</span>
              <span className="stat-label">Friends</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{profileData.stats.photos}</span>
              <span className="stat-label">Photos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{profileData.stats.comments}</span>
              <span className="stat-label">Comments</span>
            </div>
          </div>

          <button className="show-more">
            Show more
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
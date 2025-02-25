import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [pendingClubs, setPendingClubs] = useState([]);
  const [notification, setNotification] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteOTP, setDeleteOTP] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [deletionError, setDeletionError] = useState(null);
  
  // New state variables for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedLocation, setEditedLocation] = useState('');

  const navigate = useNavigate();
  const role = localStorage.getItem('userRole');
  const email = localStorage.getItem('userEmail');

  const clubs = [
    'YES', 'NSS1', 'NSS2', 'YouthForSeva', 'YFS', 'WeAreForHelp', 'HOH', 
    'Vidyadaan', 'Rotract', 'GCCC', 'IEEE', 'CSI', 'AlgoRhythm', 'OpenForge', 
    'VLSID', 'SEEE', 'Sports'
  ];

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

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
        // Initialize editing states with current values
        setEditedName(result.data.name || '');
        setEditedLocation(result.data.location || '');

        if (role === 'member' || role === 'lead') {
          const clubsResponse = await fetch(`https://finalbackend-8.onrender.com/api/club-selection/selected-clubs/${email}/${role}`);
          const clubsData = await clubsResponse.json();
          
          if (clubsData.success) {
            setSelectedClubs(clubsData.selectedClubs || []);
            setPendingClubs(clubsData.pendingClubs || []);
          } else {
            throw new Error(clubsData.message || 'Failed to fetch clubs data');
          }
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching user data');
        showNotification(err.message || 'An error occurred while fetching user data', 'error');
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

  // New function to handle profile editing
  const handleEditProfile = () => {
    setIsEditing(true);
  };

  // New function to save edited profile
  const handleSaveProfile = async () => {
    try {
      const response = await fetch('https://finalbackend-8.onrender.com/api/profile/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          role,
          name: editedName,
          location: editedLocation,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to update profile');
      }

      setUserData((prev) => ({ 
        ...prev, 
        name: editedName,
        location: editedLocation 
      }));
      
      setIsEditing(false);
      showNotification('Profile updated successfully');
    } catch (err) {
      showNotification(err.message || 'Error updating profile', 'error');
    }
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditedName(userData?.name || '');
    setEditedLocation(userData?.location || '');
    setIsEditing(false);
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
          role,
          selectedClub
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to select club');
      }

      setPendingClubs([...pendingClubs, selectedClub]);
      setSelectedClub('');
      showNotification(data.message || 'Club request sent successfully. Awaiting approval.');
    } catch (err) {
      showNotification(err.message || 'Error selecting club', 'error');
    }
  };

  const requestDeleteOTP = async () => {
    try {
      const response = await fetch('https://finalbackend-8.onrender.com/api/profile/request-delete-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setOtpSent(true);
      showNotification('OTP sent to your email');
    } catch (err) {
      setDeletionError(err.message);
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('https://finalbackend-8.onrender.com/api/profile/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          role,
          otp: deleteOTP,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete account');
      }

      localStorage.clear();
      showNotification('Account deleted successfully');
      navigate('/');
    } catch (err) {
      setDeletionError(err.message);
      showNotification(err.message, 'error');
    }
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
    <div className="profile-container">
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

      {/* Profile Image Section */}
      <div style={{ textAlign: 'center', marginBottom: '20px', position: 'relative' }}>
        {userData?.imageUrl ? (
          <div className="profile-image-container">
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
            <label htmlFor="profile-image-upload" className="change-photo-button">
              Change Photo
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        ) : (
          <div className="profile-image-container">
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
            <label htmlFor="profile-image-upload" className="change-photo-button">
              Upload Photo
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        )}
        {uploading && <div style={{ marginTop: '10px' }}>Uploading...</div>}
      </div>

      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        {role.charAt(0).toUpperCase() + role.slice(1)} Profile
      </h1>
      
      {/* Profile Information */}
      <div className="profile-info-section">
        {!isEditing ? (
          <>
            <div className="profile-detail">
              <label>Name:</label>
              <div>{userData?.name || 'Not available'}</div>
            </div>

            <div className="profile-detail">
              <label>Email:</label>
              <div>{userData?.email || 'Not available'}</div>
            </div>

            <div className="profile-detail">
              <label>Role:</label>
              <div>{role}</div>
            </div>

            <div className="profile-detail">
              <label>Location:</label>
              <div>{userData?.location || 'Not available'}</div>
            </div>
            
            <button onClick={handleEditProfile} className="edit-profile-button">
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <div className="profile-detail">
              <label>Name:</label>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="edit-input"
              />
            </div>

            <div className="profile-detail">
              <label>Email:</label>
              <div>{userData?.email || 'Not available'}</div>
            </div>

            <div className="profile-detail">
              <label>Role:</label>
              <div>{role}</div>
            </div>

            <div className="profile-detail">
              <label>Location:</label>
              <input
                type="text"
                value={editedLocation}
                onChange={(e) => setEditedLocation(e.target.value)}
                className="edit-input"
                placeholder="Enter your location"
              />
            </div>
            
            <div className="edit-buttons">
              <button onClick={handleSaveProfile} className="save-button">
                Save Changes
              </button>
              <button onClick={handleCancelEdit} className="cancel-edit-button">
                Cancel
              </button>
            </div>
          </>
        )}
      </div>

      {/* Club Selection for Members and Leads */}
      {(role === 'member' || role === 'lead') && (
        <div className="club-selection-container">
          <h3 className="section-title">Club Selection</h3>
          
          {/* Approved Clubs */}
          <div className="clubs-section">
            <h4 className="subsection-title">Selected Clubs:</h4>
            {selectedClubs.length > 0 ? (
              <ul className="clubs-list">
                {selectedClubs.map((club, index) => (
                  <li key={index} className="club-item approved">
                    {club}
                    <span className="status-badge approved">Approved</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-clubs">No approved clubs yet</p>
            )}
          </div>

          {/* Pending Clubs */}
          <div className="clubs-section">
            <h4 className="subsection-title">Pending Approvals:</h4>
            {pendingClubs.length > 0 ? (
              <ul className="clubs-list">
                {pendingClubs.map((club, index) => (
                  <li key={index} className="club-item pending">
                    {club}
                    <span className="status-badge pending">Pending</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-clubs">No pending requests</p>
            )}
          </div>

          <div className="club-selection-form">
            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="club-select"
              style={{ width: "250px", padding: "8px", fontSize: "16px" }}
            >
              <option value="">Select a club</option>
              {clubs
                .filter(club => !selectedClubs.includes(club) && !pendingClubs.includes(club))
                .map((club, index) => (
                  <option key={index} value={club}>{club}</option>
                ))}
            </select>

            <button
              onClick={handleClubSelection}
              disabled={!selectedClub}
              className={`club-select-button ${!selectedClub ? 'disabled' : ''}`}
            >
              Request to Join
            </button>
          </div>
        </div>
      )}

      {/* Delete Account Section */}
      <div className="delete-account-section">
        <h3 className="section-title">Delete Account</h3>
        <p className="warning-text">
          Warning: This action cannot be undone. All your data will be permanently deleted.
        </p>
        
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="delete-button"
          >
            Delete Account
          </button>
        ) : (
          <div className="delete-confirmation">
            {!otpSent ? (
              <>
                <p>Are you sure you want to delete your account?</p>
                <button
                  onClick={requestDeleteOTP}
                  className="confirm-button"
                >
                  Yes, send OTP
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletionError(null);
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p>Please enter the OTP sent to your email:</p>
                <input
                  type="text"
                  value={deleteOTP}
                  onChange={(e) => setDeleteOTP(e.target.value)}
                  placeholder="Enter OTP"
                  className="otp-input"
                />
                <button
                  onClick={handleDeleteAccount}
                  className="confirm-button"
                  disabled={!deleteOTP}
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setOtpSent(false);
                    setDeleteOTP('');
                    setDeletionError(null);
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </>
            )}
            {deletionError && (
              <p className="error-message">{deletionError}</p>
            )}
          </div>
        )}
      </div>

      {/* Admin/Lead Links */}
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
      {role === 'lead' && (
        <Link
          to="/lead-profile"
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

      <style jsx>{`
        .profile-container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          background-color: white;
        }

        .profile-image-container {
          position: relative;
          display: inline-block;
        }

        .change-photo-button {
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 5px 10px;
          font-size: 0.8rem;
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }

        .change-photo-button:hover {
          opacity: 1;
        }

        .profile-info-section {
          margin-bottom: 30px;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 8px;
        }

        .profile-detail {
          margin-bottom: 15px;
          display: flex;
          flex-direction: column;
        }

        .profile-detail label {
          font-weight: bold;
          margin-bottom: 5px;
          color: #495057;
        }

        .edit-input {
          padding: 8px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 1rem;
          margin-top: 5px;
        }

        .edit-profile-button {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
          transition: background-color 0.2s;
        }

        .edit-profile-button:hover {
          background-color: #218838;
        }

        .edit-buttons {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .save-button {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .save-button:hover {
          background-color: #218838;
        }

        .cancel-edit-button {
          background-color: #6c757d;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .cancel-edit-button:hover {
          background-color: #5a6268;
        }

        .club-selection-container {
          margin-top: 30px;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 8px;
        }

        .section-title {
          color: #2c3e50;
          font-size: 1.5rem;
          margin-bottom: 20px;
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 10px;
        }

        .subsection-title {
          color: #495057;
          font-size: 1.1rem;
          margin: 15px 0;
        }

        .clubs-section {
          margin-bottom: 25px;
        }

        .clubs-list {
          list-style: none;
          padding: 0;
        }

        .club-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 15px;
          margin-bottom: 8px;
          border-radius: 6px;
          background-color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-badge.approved {
          background-color: #d4edda;
          color: #155724;
        }

        .status-badge.pending {
          background-color: #fff3cd;
          color: #856404;
        }

        .club-selection-form {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .club-select {
          flex: 1;
          padding: 10px;
          border: 1px solid #ced4da;
          border-radius: 6px;
          font-size: 1rem;
          color: #495057;
        }

        .club-select-button {
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .club-select-button:hover {
          background-color: #0056b3;
        }

        .club-select-button.disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }

        .no-clubs {
          color: #6c757d;
          font-style: italic;
        }

        .delete-account-section {
          margin-top: 30px;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          border: 1px solid #ffcdd2;
        }

        .warning-text {
          color: #d32f2f;
          margin-bottom: 20px;
        }

        .delete-button {
          background-color: #d32f2f;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .delete-button:hover {
          background-color: #b71c1c;
        }

        .delete-confirmation {
          margin-top: 20px;
        }

        .otp-input {
          width: 200px;
          padding: 8px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .confirm-button {
          background-color: #d32f2f;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          margin-right: 10px;
          cursor: pointer;
        }

        .confirm-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .cancel-button {
          background-color: #757575;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .error-message {
          color: #d32f2f;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default Profile;
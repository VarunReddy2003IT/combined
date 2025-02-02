import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const role = localStorage.getItem('userRole');
  const email = localStorage.getItem('userEmail');
  const club = localStorage.getItem('userClub');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!role || !email || !club) {
        setError('Role and email are required. Please login again.');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching data for:', { role, email, club });

        const response = await fetch(`https://finalbackend-8.onrender.com/api/profile?email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch user data');
        }

        setUserData(result.data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [email, role, club]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // Your Cloudinary preset

    try {
      const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dc2qstjvr/image/upload', {
        method: 'POST',
        body: formData,
      });

      const cloudinaryData = await cloudinaryResponse.json();
      if (!cloudinaryData.secure_url) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      // Update user profile with the image URL
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

      // Update UI and hide input field
      setUserData((prev) => ({ ...prev, imageUrl: cloudinaryData.secure_url }));

    } catch (err) {
      setError(err.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  if (!role || !email) {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>Please login to view your profile</div>;
  }

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '20px' }}>Loading profile...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>Error: {error}</div>;
  }

  return (
    <div style={{
      maxWidth: '400px',
      margin: '20px auto',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      backgroundColor: 'white',
      textAlign: 'center'
    }}>
      {/* Profile Image at the Top */}
      <div style={{ marginBottom: '20px' }}>
        {userData?.imageUrl ? (
          <img src={userData.imageUrl} alt="Profile" style={{ width: '120px', height: '120px', borderRadius: '50%' }} />
        ) : (
          <p>No image uploaded</p>
        )}
      </div>

      <h1 style={{ marginBottom: '20px', color: '#333' }}>
        {role.charAt(0).toUpperCase() + role.slice(1)} Profile
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
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
          <div style={{ display: 'flex', gap: '5px' }}>
            {role}
            {role === 'lead' && (
              <span style={{ marginLeft: '5px' }}>- {club || 'Not available'}</span>
            )}
          </div>
        </div>

        {/* Image Upload Field (Hidden After Upload) */}
        {!userData?.imageUrl && (
          <div>
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <p style={{ color: 'blue' }}>Uploading...</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
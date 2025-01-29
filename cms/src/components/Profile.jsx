import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

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
      console.log('Cloudinary Upload Response:', cloudinaryData);

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
      console.log('Profile Update Response:', updateResult);

      if (!updateResult.success) {
        throw new Error(updateResult.message || 'Failed to update profile');
      }

      // Update UI
      setUserData((prev) => ({ ...prev, imageUrl: cloudinaryData.secure_url }));
    } catch (err) {
      console.error('Upload error:', err);
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
      backgroundColor: 'white'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        {role.charAt(0).toUpperCase() + role.slice(1)} Profile
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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

        <div>
          <label style={{ fontWeight: 'bold', color: '#666' }}>Profile Picture:</label>
          {userData?.imageUrl ? (
            <img src={userData.imageUrl} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
          ) : (
            <p>No image uploaded</p>
          )}
        </div>

        <div>
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
          {uploading && <p style={{ color: 'blue' }}>Uploading...</p>}
        </div>
      </div>
    </div>
  );
};

export default Profile;

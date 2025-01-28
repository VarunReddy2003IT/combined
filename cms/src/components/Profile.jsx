import React, { useState } from 'react';
import axios from 'axios';

function Profile() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Send the image to your backend for Cloudinary upload
      const response = await axios.post(
        'http://finalbackend-8.onrender.com/api/upload-image', // Replace with your backend URL
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setImageUrl(response.data.url); // Set the uploaded image URL
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading the image:', error);
      alert('Failed to upload the image');
    }
  };

  return (
    <div>
      <h2>Profile Clubs</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {imageUrl && (
        <div>
          <p>Uploaded Image:</p>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%' }} />
        </div>
      )}
      <p>Explore profile clubs and their activities.</p>
    </div>
  );
}

export default Profile;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';

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
        // Fetch user profile data
        const response = await fetch(`https://finalbackend-8.onrender.com/api/profile?email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch user data');
        }

        setUserData(result.data);

        // If user is a member, fetch their selected clubs
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

      setUserData((prev) => ({ ...prev, imageUrl: cloudinaryData.secure_url }));
      showNotification('Profile image updated successfully', 'success');

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
      showNotification(data.message, 'success');
    } catch (err) {
      showNotification(err.message || 'Error selecting club', 'error');
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  if (!role || !email) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert variant="destructive">
          Please login to view your profile
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert variant="destructive">
          Error: {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {notification && (
        <Alert
          variant={notification.type === 'error' ? 'destructive' : 'default'}
          className="mb-4"
        >
          {notification.message}
        </Alert>
      )}

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            {role.charAt(0).toUpperCase() + role.slice(1)} Profile
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* Profile Image Section */}
          <div className="flex justify-center mb-6">
            {userData?.imageUrl ? (
              <img
                src={userData.imageUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>

          {/* Image Upload Section */}
          {!userData?.imageUrl && (
            <div className="mb-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                {uploading ? 'Uploading...' : 'Upload Profile Picture'}
              </label>
            </div>
          )}

          {/* Profile Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Name</label>
              <div className="mt-1">{userData?.name || 'Not available'}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <div className="mt-1">{userData?.email || 'Not available'}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Role</label>
              <div className="mt-1 flex gap-2">
                {role}
                {role === 'lead' && (
                  <span>- {club || 'Not available'}</span>
                )}
              </div>
            </div>

            {/* Club Selection Section for Members */}
            {role === 'member' && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Club Selection</h3>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Selected Clubs:</h4>
                  {selectedClubs.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {selectedClubs.map((club, index) => (
                        <li key={index} className="text-gray-700">{club}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No clubs selected yet</p>
                  )}
                </div>

                <div className="flex gap-4">
                  <select
                    value={selectedClub}
                    onChange={(e) => setSelectedClub(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm"
                  >
                    <option value="">Select a club</option>
                    {clubs
                      .filter(club => !selectedClubs.includes(club))
                      .map((club, index) => (
                        <option key={index} value={club}>{club}</option>
                      ))}
                  </select>
                  <Button
                    onClick={handleClubSelection}
                    disabled={!selectedClub}
                  >
                    Add Club
                  </Button>
                </div>
              </div>
            )}

            {/* Admin Link */}
            {role === 'admin' && (
              <Link
                to="/admin-profile"
                className="mt-6 inline-block w-full"
              >
                <Button className="w-full">
                  View All Profiles
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
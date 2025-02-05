import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [pendingClubs, setPendingClubs] = useState([]);
  const [notification, setNotification] = useState(null);

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
    formData.append('email', email);
    formData.append('role', role);

    try {
      const response = await fetch('https://finalbackend-8.onrender.com/api/profile/update-profile', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to update profile');
      }

      setUserData((prev) => ({ ...prev, imageUrl: result.data.imageUrl }));
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

  if (!role || !email) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-lg font-medium">
          Please login to view your profile
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600 text-lg">
          Loading profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {notification && (
        <div className={`mb-4 p-4 rounded-lg text-center ${
          notification.type === 'error' 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-8">
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

          <div className="mt-4">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
              <div className={`inline-flex items-center px-4 py-2 rounded-lg text-white transition-colors ${
                uploading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              }`}>
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </div>
            </label>
          </div>
        </div>

        {/* Profile Information */}
        <div className="space-y-6 mb-8">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            {role.charAt(0).toUpperCase() + role.slice(1)} Profile
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Name:</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {userData?.name || 'Not available'}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Email:</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {userData?.email || 'Not available'}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Role:</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {role}
              </div>
            </div>
          </div>
        </div>

        {/* Club Selection Section */}
        {(role === 'member' || role === 'lead') && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Club Selection</h3>
            
            {/* Approved Clubs */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-700 mb-3">Selected Clubs:</h4>
              {selectedClubs.length > 0 ? (
                <div className="space-y-2">
                  {selectedClubs.map((club, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                      <span>{club}</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        Approved
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No approved clubs yet</p>
              )}
            </div>

            {/* Pending Clubs */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-700 mb-3">Pending Approvals:</h4>
              {pendingClubs.length > 0 ? (
                <div className="space-y-2">
                  {pendingClubs.map((club, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                      <span>{club}</span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                        Pending
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No pending requests</p>
              )}
            </div>

            {/* Club Selection Form */}
            <div className="flex gap-4">
              <select
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  !selectedClub 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Request to Join
              </button>
            </div>
          </div>
        )}

        {/* Admin/Lead Links */}
        {(role === 'admin' || role === 'lead') && (
          <Link
            to={`/${role.toLowerCase()}-profile`}
            className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors"
          >
            View All Profiles
          </Link>
        )}
      </div>
    </div>
  );
};

export default Profile;
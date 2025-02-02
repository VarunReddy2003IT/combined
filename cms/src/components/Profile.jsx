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
  const club = localStorage.getItem('userClub'); // Lead's assigned club

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

        // Fetch selected and pending clubs for both members and leads
        const clubsResponse = await fetch(`https://finalbackend-8.onrender.com/api/club-selection/selected-clubs/${email}`);
        const clubsData = await clubsResponse.json();

        if (clubsData.success) {
          let fetchedSelectedClubs = clubsData.selectedClubs || [];
          
          // If the user is a lead, ensure their assigned club is included
          if (role === 'lead' && club && !fetchedSelectedClubs.includes(club)) {
            fetchedSelectedClubs.push(club);
          }

          setSelectedClubs(fetchedSelectedClubs);
          setPendingClubs(clubsData.pendingClubs || []);
        } else {
          throw new Error(clubsData.message || 'Failed to fetch clubs data');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching user data');
        showNotification(err.message || 'An error occurred while fetching user data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [email, role, club]);

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

      setPendingClubs([...pendingClubs, selectedClub]);
      setSelectedClub('');
      showNotification(data.message || 'Club request sent successfully. Awaiting lead approval.');
    } catch (err) {
      showNotification(err.message || 'Error selecting club', 'error');
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

      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        {role.charAt(0).toUpperCase() + role.slice(1)} Profile
      </h1>

      <div style={{ marginBottom: '20px' }}>
        <div><strong>Name:</strong> {userData?.name || 'Not available'}</div>
        <div><strong>Email:</strong> {userData?.email || 'Not available'}</div>
        <div><strong>Role:</strong> {role} {role === 'lead' && ` - ${club}`}</div>
      </div>

      {/* Club Selection for Members & Leads */}
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

      <Link to="/lead-profile" className="profile-link">View All Profiles</Link>
    </div>
  );
};

export default Profile;

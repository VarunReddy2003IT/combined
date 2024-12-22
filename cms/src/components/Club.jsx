import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Club.css'; // Optional: Add styling for the component

function Club() {
  const navigate = useNavigate();

  // Handlers for navigation
  const handleTechnicalClick = () => navigate('/clubs/technical');
  const handleSocialClick = () => navigate('/clubs/social');
  const handleCulturalClick = () => navigate('/clubs/cultural');

  return (
    <div className="club-container">
      <h2>Clubs</h2>
      <div className="button-group">
        <button className="club-button" onClick={handleTechnicalClick}>Technical</button>
        <button className="club-button" onClick={handleSocialClick}>Social</button>
        <button className="club-button" onClick={handleCulturalClick}>Cultural</button>
      </div>
    </div>
  );
}

export default Club;

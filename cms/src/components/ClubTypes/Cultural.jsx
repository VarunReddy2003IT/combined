import React, { useEffect, useState } from 'react';
import './Cultural.css';

const Cultural = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://finalbackend-8.onrender.com/api/clubs');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setClubs(data);
      } catch (err) {
        console.error('Error fetching clubs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  return (
    <div className="cultural-container">
      <header className="cultural-header">
        <h1 className="text-3xl font-bold text-center text-gray-800">Cultural Clubs</h1>
      </header>

      <main className="clubs-section">
        {loading ? (
          <div className="loading-section">
            <p className="text-gray-600">Loading clubs...</p>
          </div>
        ) : error ? (
          <div className="error-section">
            <p className="text-red-500">Error: {error}</p>
          </div>
        ) : clubs.length > 0 ? (
          <div className="clubs-grid">
            {clubs.map((club) => (
              <div key={club._id} className="club-card">
                {club.image && (
                  <div className="club-image-container">
                    <img
                      src={club.image}
                      alt={club.name}
                      className="club-image"
                    />
                    <div className="club-overlay">
                      <h2 className="club-title">{club.name}</h2>
                    </div>
                  </div>
                )}
                <div className="club-details">
                  <h3 className="club-name">{club.name}</h3>
                  <p className="club-description">{club.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-clubs">
            <p className="text-gray-600">No clubs available at the moment.</p>
          </div>
        )}
      </main>

      <footer className="footer">
        <ul className="footer-links">
          <li>
            <a href="https://culturalclub1.org" target="_blank" rel="noopener noreferrer" className="footer-link">
              Club 1
            </a>
          </li>
          <li>
            <a href="https://culturalclub2.org" target="_blank" rel="noopener noreferrer" className="footer-link">
              Club 2
            </a>
          </li>
          <li>
            <a href="https://culturalclub3.org" target="_blank" rel="noopener noreferrer" className="footer-link">
              Club 3
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default Cultural;

import React, { useEffect, useState } from 'react';
import './Technical.css';

const Technical = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://finalbackend-8.onrender.com/api/events/technical');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="technical-container">
      <header className="technical-header">
        <h1 className="text-3xl font-bold text-center text-gray-800">Technical Events</h1>
      </header>

      <main className="events-section">
        {loading ? (
          <div className="loading-section">
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : error ? (
          <div className="error-section">
            <p className="text-red-500">Error: {error}</p>
          </div>
        ) : events.length > 0 ? (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event._id} className="event-card">
                {event.image && (
                  <div className="event-image-container">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="event-image"
                    />
                    <div className="event-overlay">
                      <h2 className="event-title">{event.name}</h2>
                    </div>
                  </div>
                )}
                <div className="event-details">
                  <h3 className="event-name">{event.eventname}</h3>
                  <p className="event-description">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-events">
            <p className="text-gray-600">No events available at the moment.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Technical;

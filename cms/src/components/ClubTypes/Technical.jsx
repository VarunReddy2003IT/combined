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
        const response = await fetch('https://finalbackend-8.onrender.com/api/events');
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
    <div className="entirebody">
      <header>
        <h1>Technical Events</h1>
      </header>

      <main>
        {loading ? (
          <div className="loading-container">
            <p>Loading events...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>Error: {error}</p>
          </div>
        ) : events.length > 0 ? (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event._id} className="event-card">
                {event.image && (
                  <div className="event-image-container">
                    <img
                      src={event.image}
                      alt={event.image}
                      className="event-image"
                    />
                    <div className="event-overlay">
                      <h2 className="event-title">
                        {event.name}
                      </h2>
                    </div>
                  </div>
                )}
                <div className="event-content">
                  <h5 className="event-name">{event.eventname}</h5>
                  <p className="event-description">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-events">
            <p>No events available at the moment.</p>
          </div>
        )}
      </main>

      <footer>
        <ul>
          <li>
            <a href="https://ieee.org" target="_blank" rel="noopener noreferrer">
              IEEE
            </a>
          </li>
          <li>
            <a href="https://csi-india.org" target="_blank" rel="noopener noreferrer">
              CSI
            </a>
          </li>
          <li>
            <a href="https://vlsi.org" target="_blank" rel="noopener noreferrer">
              VLSID
            </a>
          </li>
          <li>
            <a href="https://seee.org" target="_blank" rel="noopener noreferrer">
              SEEE
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default Technical;
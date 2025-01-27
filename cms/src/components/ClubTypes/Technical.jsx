import React, { useEffect, useState } from 'react';
import './Technical.css';

function Technical() {
  const [events, setEvents] = useState([]); // Store all events
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch('https://finalbackend-8.onrender.com/api/events'); // Replace with your backend URL
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        console.log('Fetched events:', data); // Debug fetched data
        setEvents(data); // Set the fetched events
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message); // Set error state
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="entirebody">
      {/* Main Heading */}
      <header>
        <h1>Technical Club Page</h1>
        <p>Explore technical clubs and their activities.</p>
      </header>

      {/* Main Content */}
      <main>
        {loading ? (
          <p>Loading events...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <h3>{event.name}</h3>
              <p>{event.description}</p>
              <p>
                <strong>Type:</strong> {event.type}
              </p>
              {event.image && <img src={event.image} alt={event.name} />}
            </div>
          ))
        ) : (
          <p>No events available at the moment.</p>
        )}
      </main>

      {/* Footer */}
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
}

export default Technical;

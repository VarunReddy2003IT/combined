import React, { useState, useEffect } from "react";
import "./Home.css";

function Home() {
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
    <div className="home-container">
      {/* Welcome Section */}
      <section className="welcome-section">
        <h2>Welcome to Gayatri Vidya Parishad College of Engineering</h2>
        <p>
          At Gayatri Vidya Parishad College of Engineering, we take pride in our
          vibrant and diverse club culture. With clubs spanning across Social,
          Cultural, Technical, and Coding, our college offers something for
          everyone.
        </p>
      </section>

      {loading ? (
        <div className="loading-section">
          <p>Loading events...</p>
        </div>
      ) : error ? (
        <div className="error-section">
          <p>Error loading events: {error}</p>
        </div>
      ) : (
        <section className="event-section">
          <h2>College Events</h2>
          <div className="events-grid">
            {events.map((event) => (
              <div key={event._id} className="event-card">
                {event.image && (
                  <div className="event-image-container">
                    <img src={event.image} alt={event.name} className="event-image" />
                  </div>
                )}
                <div className="event-details">
                  <h3>{event.name}</h3>
                  <p className="event-description">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
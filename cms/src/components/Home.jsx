import React, { useState, useEffect } from "react";
import "./Home.css";

function Home() {
  const [events, setEvents] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEventId, setExpandedEventId] = useState(null);

  // Retrieve user role (assuming it's stored in localStorage)
  const userRole = localStorage.getItem("userRole"); // Example: "admin" or "user"

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        // Fetch upcoming events
        const upcomingResponse = await fetch("https://finalbackend-8.onrender.com/api/events/upcoming");
        if (!upcomingResponse.ok) {
          throw new Error(`HTTP error! Status: ${upcomingResponse.status}`);
        }
        const upcomingData = await upcomingResponse.json();

        // Fetch past events
        const pastResponse = await fetch("https://finalbackend-8.onrender.com/api/events/past");
        if (!pastResponse.ok) {
          throw new Error(`HTTP error! Status: ${pastResponse.status}`);
        }
        const pastData = await pastResponse.json();

        setEvents({
          upcoming: upcomingData,
          past: pastData,
        });
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleExpandEvent = (eventId) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`https://finalbackend-8.onrender.com/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Remove the deleted event from state
      setEvents({
        upcoming: events.upcoming.filter((event) => event._id !== eventId),
        past: events.past.filter((event) => event._id !== eventId),
      });

      // If the deleted event was expanded, reset expandedEventId
      if (expandedEventId === eventId) {
        setExpandedEventId(null);
      }
    } catch (err) {
      console.error("Error deleting event:", err);
      alert(`Failed to delete event: ${err.message}`);
    }
  };

  const renderEvent = (event) => {
    const isExpanded = expandedEventId === event._id;

    return (
      <div key={event._id} className={`event-card ${isExpanded ? "expanded" : ""}`}>
        <div className="event-card-preview" onClick={() => handleExpandEvent(event._id)}>
          {event.image && (
            <div className="event-image-container">
              <img src={event.image} alt={event.name} className="event-image" />
            </div>
          )}
          <div className="event-preview-details">
            <h3>{event.eventname}</h3>
            <p className="event-club">{event.club}</p>
          </div>
        </div>

        {isExpanded && (
          <div className="event-expanded-details">
            <p>
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Club Type:</strong> {event.clubtype}
            </p>
            <p>
              <strong>Description:</strong> {event.description}
            </p>
            {event.registrationLink && (
              <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="registration-link">
                Register Now
              </a>
            )}

            {/* Show Delete button only if the user is an admin */}
            {userRole === "admin" && (
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteEvent(event._id);
                }}
              >
                Delete Event
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="home-container">
      {/* Welcome Section */}
      <section className="welcome-section">
        <h2>Welcome to Gayatri Vidya Parishad College of Engineering</h2>
        <p>
          At Gayatri Vidya Parishad College of Engineering, we take pride in our vibrant and diverse club culture. With
          clubs spanning across Social, Cultural, Technical, and Coding, our college offers something for everyone.
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
        <>
          {/* Upcoming Events Section */}
          {events.upcoming.length > 0 && (
            <section className="event-section upcoming-events">
              <h2>Upcoming Events</h2>
              <div className="events-grid">{events.upcoming.map(renderEvent)}</div>
            </section>
          )}

          {/* Past Events Section */}
          {events.past.length > 0 && (
            <section className="event-section past-events">
              <h2>Past Events</h2>
              <div className="events-grid">{events.past.map(renderEvent)}</div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default Home;

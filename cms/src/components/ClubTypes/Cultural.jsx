import React, { useEffect, useState } from 'react';
import Footerbar from '../CulturalFootBar';

const Cultural = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Fetch upcoming events for cultural clubtype
        const upcomingResponse = await fetch('https://finalbackend-8.onrender.com/api/events/upcoming/Cultural');
        if (!upcomingResponse.ok) {
          throw new Error(`HTTP error! Status: ${upcomingResponse.status}`);
        }
        const upcomingData = await upcomingResponse.json();
        setUpcomingEvents(upcomingData);

        // Fetch past events for cultural clubtype
        const pastResponse = await fetch('https://finalbackend-8.onrender.com/api/events/past/Cultural');
        if (!pastResponse.ok) {
          throw new Error(`HTTP error! Status: ${pastResponse.status}`);
        }
        const pastData = await pastResponse.json();
        setPastEvents(pastData);
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
    <div className="cultural-container">
      <header className="cultural-header">
        <h1 className="text-3xl font-bold text-center text-gray-800">Cultural Events</h1>
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
        ) : (
          <>
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div className="event-section">
                <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                <div className="events-grid">
                  {upcomingEvents.map((event) => (
                    <div key={event._id} className="event-card">
                      {event.image && (
                        <div className="event-image-container">
                          <img
                            src={event.image}
                            alt={event.eventname}
                            className="event-image"
                          />
                          
                        </div>
                      )}
                      <div className="event-details">
                        <h3 className="event-name">{event.eventname}</h3>
                        <p className="event-description">{event.description}</p>
                        {event.registrationLink && (
                          <a 
                            href={event.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="registration-link"
                          >
                            Register Now
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div className="event-section">
                <h2 className="text-xl font-semibold mb-4">Past Events</h2>
                <div className="events-grid">
                  {pastEvents.map((event) => (
                    <div key={event._id} className="event-card">
                      {event.image && (
                        <div className="event-image-container">
                          <img
                            src={event.image}
                            alt={event.eventname}
                            className="event-image"
                          />
                          
                        </div>
                      )}
                      <div className="event-details">
                        <h3 className="event-name">{event.eventname}</h3>
                        <p className="event-description">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No events available */}
            {upcomingEvents.length === 0 && pastEvents.length === 0 && (
              <div className="no-events">
                <p className="text-gray-600">No events available at the moment.</p>
              </div>
            )}
          </>
        )}
      </main>

      <Footerbar />
    </div>
  );
};

export default Cultural;
import React, { useEffect, useState } from 'react';
import './Technical.css';

function Technical() {
  const [events, setEvents] = useState({ upcoming: [], past: [] });

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://finalbackend-8.onrender.com/api/events');
        const data = await response.json();
  
        // Assuming your events have a 'type' field like "past" or "upcoming"
        const upcomingEvents = data.filter(event => event.type === 'upcoming');
        const pastEvents = data.filter(event => event.type === 'past');
  
        setEvents({
          upcoming: upcomingEvents,
          past: pastEvents,
        });
      } catch (error) {
        console.error('Error fetching events:', error);
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
        {/* Upcoming Events Section */}
        <section>
          <h2>Upcoming Events</h2>
          {events.upcoming.length > 0 ? (
  events.upcoming.map((event) => {
    console.log('Upcoming event:', event); // Add this for debugging
    return (
      <div key={event._id}>
        <h3>{event.name}</h3>
        <p>{event.description}</p>
        {event.image && <img src={event.image} alt={event.name} />}
      </div>
    );
  })
) : (
  <p>No upcoming events at the moment.</p>
)}
        </section>

        {/* Past Events Section */}
        <section>
          <h2>Past Events</h2>
          {events.past.length > 0 ? (
            events.past.map((event) => (
              <div key={event._id}>
                <h3>{event.name}</h3>
                <p>{event.description}</p>
                {event.image && <img src={event.image} alt={event.name} />}
              </div>
            ))
          ) : (
            <p>No past events to show.</p>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer>
        <ul>
          <li>
            <a
              href="https://ieee.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              IEEE
            </a>
          </li>
          <li>
            <a
              href="https://csi-india.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              CSI
            </a>
          </li>
          <li>
            <a
              href="https://vlsi.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              VLSID
            </a>
          </li>
          <li>
            <a
              href="https://seee.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              SEEE
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
}

export default Technical;

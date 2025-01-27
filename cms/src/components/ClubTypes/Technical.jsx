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
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md py-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Technical Events</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Error: {error}</p>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {event.image && (
                  <div className="relative h-48 bg-navy-900">
                    <img
                      src={event.image}
                      alt={event.image}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60">
                      <h2 className="absolute bottom-4 left-4 text-3xl font-bold text-white">
                        {event.name}
                      </h2>
                    </div>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800">{event.eventname}</h3>
                  <p className="text-gray-700 mt-2">{event.description}</p>
                  
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No events available at the moment.</p>
          </div>
        )}
      </main>

      <footer className="bg-white shadow-md mt-8 py-6">
        <ul className="flex justify-center space-x-6">
          <li>
            <a href="https://ieee.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
              IEEE
            </a>
          </li>
          <li>
            <a href="https://csi-india.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
              CSI
            </a>
          </li>
          <li>
            <a href="https://vlsi.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
              VLSID
            </a>
          </li>
          <li>
            <a href="https://seee.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
              SEEE
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default Technical;
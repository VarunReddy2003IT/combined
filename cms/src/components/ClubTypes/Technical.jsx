import React, { useEffect, useState } from 'react';

const Technical = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null); // For new event image URL

  const role = localStorage.getItem('userRole');
  const email = localStorage.getItem('userEmail');

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

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // Cloudinary preset

    try {
      const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dc2qstjvr/image/upload', {
        method: 'POST',
        body: formData,
      });

      const cloudinaryData = await cloudinaryResponse.json();
      if (!cloudinaryData.secure_url) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      // Store the image URL
      setImageUrl(cloudinaryData.secure_url);
      alert('Image uploaded successfully');
    } catch (err) {
      setError(err.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleAddEvent = async () => {
    if (!imageUrl) {
      setError('Please upload an image before adding the event.');
      return;
    }

    const newEvent = {
      eventname: 'New Event',
      description: 'Event description goes here',
      image: imageUrl,
      type: 'upcoming', // Set the type dynamically based on the event
    };

    try {
      const response = await fetch('https://finalbackend-8.onrender.com/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });

      const result = await response.json();
      if (result.success) {
        alert('Event added successfully!');
        setEvents((prevEvents) => [...prevEvents, result.data]); // Update state with new event
      } else {
        throw new Error(result.message || 'Failed to add event');
      }
    } catch (err) {
      setError(err.message || 'Error adding event');
    }
  };

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

      {role === 'admin' && (
        <div className="add-event">
          <button onClick={handleAddEvent} className="btn-add-event">
            + Add New Event
          </button>

          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
          {uploading && <p>Uploading...</p>}
          {imageUrl && <p>Image uploaded! You can now add the event.</p>}
        </div>
      )}
    </div>
  );
};

export default Technical;

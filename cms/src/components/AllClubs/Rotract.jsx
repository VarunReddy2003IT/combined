import React, { useState, useEffect } from "react";
import Footerbar from '../SocialFooter';
import axios from "axios";

function Rotract() {
  const [isLeadForRotract, setIsLeadForRotract] = useState(false);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('upcoming');
  const [registrationLink, setRegistrationLink] = useState('');
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [events, setEvents] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [expandedEventId, setExpandedEventId] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const userClub = localStorage.getItem("userClub");

    if ((userRole === 'lead' && userClub === 'Rotract') || userRole === 'admin') {
      setIsLeadForRotract(true);
    }

    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("https://finalbackend-8.onrender.com/api/events");
      const RotractEvents = response.data.filter(event => event.club === 'Rotract');

      // Get current date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0];

      // Categorize events based on the current date
      const upcomingEvents = RotractEvents.filter(event => event.date >= today);
      const pastEvents = RotractEvents.filter(event => event.date < today);

      setEvents({ upcoming: upcomingEvents, past: pastEvents });
    } catch (error) {
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const handleExpandEvent = (eventId) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await axios.delete(`https://finalbackend-8.onrender.com/api/events/${eventId}`);
      
      // Update local state to remove the deleted event
      setEvents({
        upcoming: events.upcoming.filter(event => event._id !== eventId),
        past: events.past.filter(event => event._id !== eventId),
      });

      // Reset expanded event if it was deleted
      if (expandedEventId === eventId) {
        setExpandedEventId(null);
      }

      alert('Event deleted successfully');
    } catch (err) {
      console.error('Error deleting event:', err);
      alert(`Failed to delete event: ${err.response?.data?.message || err.message}`);
    }
  };
  
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    try {
      const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dc2qstjvr/image/upload', {
        method: 'POST',
        body: formData,
      });

      const cloudinaryData = await cloudinaryResponse.json();
      if (!cloudinaryData.secure_url) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      setImageUrl(cloudinaryData.secure_url);
    } catch (err) {
      setError('Error uploading image: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddEvent = async () => {
    if (!eventName || !eventDate || !eventDescription) {
      setError("Please fill in all fields.");
      return;
    }

    if (eventType === 'upcoming' && !registrationLink) {
      setError("Registration link is required for upcoming events.");
      return;
    }

    try {
      await axios.post("https://finalbackend-8.onrender.com/api/events/add", {
        eventname: eventName,
        clubtype: "Social",
        club: "Rotract",
        date: eventDate,
        description: eventDescription,
        type: eventType,
        image: imageUrl,
        registrationLink: eventType === 'upcoming' ? registrationLink : undefined
      });

      alert("Event added successfully!");
      setEventName('');
      setEventDate('');
      setEventDescription('');
      setEventType('upcoming');
      setRegistrationLink('');
      setImageUrl('');
      setShowAddEventForm(false);
      setError('');
      fetchEvents(); // Refresh events after adding
    } catch (error) {
      setError(error.response?.data?.error || "Failed to add event. Please try again.");
    }
  };

  // Render event card with expandable functionality
  const renderEventCard = (event) => {
    const isExpanded = expandedEventId === event._id;
    
    return (
      <div 
        key={event._id} 
        className={`event-card ${isExpanded ? 'expanded' : ''}`}
      >
        <div className="event-card-preview" onClick={() => handleExpandEvent(event._id)}>
          <div className="event-image-container">
            <img
              src={event.image || '/placeholder-event.jpg'}
              alt={event.eventname}
              className="event-image"
            />
          </div>
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
            
            {/* Show Delete button only for admin or lead of Rotract */}
            {isLeadForRotract && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteEvent(event._id);
                }}
                className="delete-button"
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
    <div className="container">
      <div className="footer">
        <Footerbar />
      </div>
      <div className="content">
        <div className="page-content">
          <h1 className="page-title">Rotract Club</h1>

          {/* Upcoming Events Section */}
          <div className="event-section">
            <h2>Upcoming Events</h2>
            {loading ? (
              <div className="loading-section">Loading events...</div>
            ) : error ? (
              <div className="error-section">{error}</div>
            ) : events.upcoming.length > 0 ? (
              <div className="events-grid">
                {events.upcoming.map(renderEventCard)}
              </div>
            ) : (
              <p>No upcoming events</p>
            )}
          </div>

          {/* Past Events Section */}
          <div className="event-section">
            <h2>Past Events</h2>
            {loading ? (
              <div className="loading-section">Loading events...</div>
            ) : error ? (
              <div className="error-section">{error}</div>
            ) : events.past.length > 0 ? (
              <div className="events-grid">
                {events.past.map(renderEventCard)}
              </div>
            ) : (
              <p>No past events</p>
            )}
          </div>

          {isLeadForRotract && (
            <div className="form-container">
              <button 
                onClick={() => setShowAddEventForm(!showAddEventForm)}
                className="toggle-button"
              >
                {showAddEventForm ? "Cancel" : "Add Event"}
              </button>
              
              {showAddEventForm && (
                <div className="event-form">
                  <div className="form-content">
                    <h3 className="form-title">Add New Event</h3>
                    
                    <div className="form-fields">
                      <div className="form-group">
                        <label>Event Name</label>
                        <input
                          type="text"
                          placeholder="Enter event name"
                          value={eventName}
                          onChange={(e) => setEventName(e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Event Date</label>
                        <input
                          type="date"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Event Description</label>
                        <textarea
                          placeholder="Enter event description"
                          value={eventDescription}
                          onChange={(e) => setEventDescription(e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Event Type</label>
                        <select
                          value={eventType}
                          onChange={(e) => setEventType(e.target.value)}
                        >
                          <option value="upcoming">Upcoming Event</option>
                          <option value="past">Past Event</option>
                        </select>
                      </div>

                      {eventType === 'upcoming' && (
                        <div className="form-group">
                          <label>Registration Link (Google Form)</label>
                          <input
                            type="url"
                            placeholder="Enter Google Form URL"
                            value={registrationLink}
                            onChange={(e) => setRegistrationLink(e.target.value)}
                          />
                        </div>
                      )}

                      <div className="image-upload">
                        <label>Event Poster</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                        {uploading && (
                          <p className="upload-status">Uploading...</p>
                        )}
                        {imageUrl && (
                          <div className="image-preview">
                            <img
                              src={imageUrl}
                              alt="Event poster preview"
                            />
                          </div>
                        )}
                      </div>

                      {error && (
                        <div className="error-message">
                          {error}
                        </div>
                      )}

                      <button 
                        onClick={handleAddEvent}
                        className="submit-button"
                      >
                        Submit Event
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Rotract;
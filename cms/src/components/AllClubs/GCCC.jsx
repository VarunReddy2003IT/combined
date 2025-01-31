import React, { useState, useEffect } from "react";
import Footerbar from '../SocialFooter';
import axios from "axios";

function GCCC() {
  const [isLeadForGCCC, setIsLeadForGCCC] = useState(false);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('upcoming');
  const [registrationLink, setRegistrationLink] = useState('');
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const userClub = localStorage.getItem("userClub");

    if ((userRole === 'lead' && userClub === 'GCCC') || userRole === 'admin') {
      setIsLeadForGCCC(true);
    }

    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("https://finalbackend-8.onrender.com/api/events");
      const GCCCEvents = response.data.filter(event => event.club === 'GCCC');
      setEvents(GCCCEvents);
    } catch (error) {
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
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
        clubtype: "Cultural",
        club: "GCCC",
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
      fetchEvents(); 
    } catch (error) {
      setError(error.response?.data?.error || "Failed to add event. Please try again.");
    }
  };

  const EventCard = ({ event }) => (
    <div className="event-card">
      <div className="event-image-container">
        <img
          src={event.image || '/placeholder-event.jpg'}
          alt={event.eventname}
          className="event-image"
        />
      </div>
      <div className="event-details">
        <h3>{event.eventname}</h3>
        <p className="event-description">{event.description}</p>
        <p>Date: {new Date(event.date).toLocaleDateString()}</p>
        {event.type === 'upcoming' && event.registrationLink && (
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="submit-button"
          >
            Register Now
          </a>
        )}
      </div>
    </div>
  );

  const upcomingEvents = events.filter(event => event.type === 'upcoming');
  const pastEvents = events.filter(event => event.type === 'past');

  return (
    <div className="container">
      <div className="content">
        <div className="page-content">
          <h1 className="page-title">GCCC Club</h1>
          
          <div className="event-section">
            <h2>Upcoming Events</h2>
            {loading ? (
              <div className="loading-section">Loading events...</div>
            ) : error ? (
              <div className="error-section">{error}</div>
            ) : upcomingEvents.length > 0 ? (
              <div className="events-grid">
                {upcomingEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            ) : (
              <p>No upcoming events</p>
            )}
          </div>

          <div className="event-section">
            <h2>Past Events</h2>
            {loading ? (
              <div className="loading-section">Loading events...</div>
            ) : error ? (
              <div className="error-section">{error}</div>
            ) : pastEvents.length > 0 ? (
              <div className="events-grid">
                {pastEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            ) : (
              <p>No past events</p>
            )}
          </div>

          {isLeadForGCCC && (
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
      <div className="footer">
        <Footerbar />
      </div>
    </div>
  );
}

export default GCCC;

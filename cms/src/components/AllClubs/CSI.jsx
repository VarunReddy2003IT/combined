import React, { useState, useEffect } from "react";
import Footerbar from '../TechnicalFootBar';
import axios from "axios";
import './CSI.css';

function CSI() {
  const [isLeadForCSI, setIsLeadForCSI] = useState(false);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('upcoming');
  const [registrationLink, setRegistrationLink] = useState('');
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const userClub = localStorage.getItem("userClub");

    if ((userRole === 'lead' && userClub === 'CSI') || userRole === 'admin') {
      setIsLeadForCSI(true);
    }

    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/events");
      // Filter events for CSI club
      const CSIEvents = response.data.filter(event => event.club === 'CSI');
      setEvents(CSIEvents);
    } catch (error) {
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Set file for upload
    setImageFile(file);
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

    setUploading(true);
    const formData = new FormData();
    formData.append('eventname', eventName);
    formData.append('clubtype', "Technical");
    formData.append('club', "CSI");
    formData.append('date', eventDate);
    formData.append('description', eventDescription);
    formData.append('type', eventType);
    
    // Add file if present
    if (imageFile) {
      formData.append('file', imageFile);
    }

    // Add registration link for upcoming events
    if (eventType === 'upcoming') {
      formData.append('registrationLink', registrationLink);
    }

    try {
      await axios.post("http://localhost:5000/api/events/add", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert("Event added successfully!");
      // Reset form
      setEventName('');
      setEventDate('');
      setEventDescription('');
      setEventType('upcoming');
      setRegistrationLink('');
      setImageFile(null);
      setImagePreview('');
      setShowAddEventForm(false);
      setError('');
      fetchEvents(); // Refresh events after adding
    } catch (error) {
      setError(error.response?.data?.error || "Failed to add event. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const EventCard = ({ event }) => {
    // Construct full image URL for local uploads
    const imageSrc = event.image 
      ? `http://localhost:5000/${event.image}` 
      : '/placeholder-event.jpg';

    return (
      <div className="event-card">
        <div className="event-image-container">
          <img
            src={imageSrc}
            alt={event.eventname}
            className="event-image"
            onError={(e) => { e.target.src = '/placeholder-event.jpg' }}
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
              style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none', marginTop: '1rem' }}
            >
              Register Now
            </a>
          )}
        </div>
      </div>
    );
  };

  // Filter events by type
  const upcomingEvents = events.filter(event => event.type === 'upcoming');
  const pastEvents = events.filter(event => event.type === 'past');

  return (
    <div className="container">
      <div className="footer">
        <Footerbar />
      </div>
      <div className="content">
        <div className="page-content">
          <h1 className="page-title">CSI Club</h1>

          {/* Upcoming Events Section */}
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

          {/* Past Events Section */}
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

          {/* Add Event Button and Form */}
          {isLeadForCSI && (
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
                        {imagePreview && (
                          <div className="image-preview">
                            <img
                              src={imagePreview}
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
                        disabled={uploading}
                      >
                        {uploading ? "Submitting..." : "Submit Event"}
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

export default CSI;
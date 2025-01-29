import React, { useState, useEffect } from "react";
import Footerbar from '../TechnicalFootBar';
import axios from "axios";
import './OpenForge.css';

function OpenForge() {
  const [isLeadForOpenForge, setIsLeadForOpenForge] = useState(false);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('upcoming');
  const [registrationLink, setRegistrationLink] = useState('');
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const userClub = localStorage.getItem("userClub");

    if ((userRole === 'lead' && userClub === 'OpenForge') || userRole === 'admin') {
      setIsLeadForOpenForge(true);
    }
  }, []);

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
        clubtype: "Technical",
        club: "OpenForge",
        date: eventDate,
        description: eventDescription,
        type: eventType,
        posterUrl: imageUrl,
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
    } catch (error) {
      setError(error.response?.data?.error || "Failed to add event. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="content">
        <div className="page-content">
          <h1 className="page-title">OpenForge Club</h1>
          {isLeadForOpenForge && (
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

export default OpenForge;
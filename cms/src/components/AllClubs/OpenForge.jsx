import React, { useState, useEffect } from "react";
import Footerbar from '../TechnicalFootBar';
import axios from "axios";

function OpenForge() {
  const [isLeadForOpenForge, setIsLeadForOpenForge] = useState(false);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if the user is a lead and part of "OpenForge" club
    const userRole = localStorage.getItem("userRole"); // User role (lead/admin/member)
    const userClub = localStorage.getItem("userClub"); // Club name the user belongs to (stored during login)

    if (userRole === 'lead' && userClub === 'OpenForge'||userRole==='admin') {
      setIsLeadForOpenForge(true);
    }
  }, []);

  const handleAddEvent = async () => {
    if (!eventName || !eventDate || !eventDescription) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // Send event data to the backend
      const response = await axios.post("https://finalbackend-8.onrender.com/api/events", {
        eventname: eventName,
        date: eventDate,
        description: eventDescription,
        club: "OpenForge", // Static club name (can be dynamic if needed)
      });

      alert("Event added successfully!");
      setShowAddEventForm(false);
    } catch (error) {
      setError("Failed to add event. Please try again.");
    }
  };

  return (
    <div>
      <h1>This is OpenForge club</h1>
      {isLeadForOpenForge && (
        <div>
          <button onClick={() => setShowAddEventForm(!showAddEventForm)}>
            {showAddEventForm ? "Cancel" : "Add Event"}
          </button>
          {showAddEventForm && (
            <div>
              <h3>Add New Event</h3>
              <input
                type="text"
                placeholder="Event Name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
              <textarea
                placeholder="Event Description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              ></textarea>
              {error && <div className="error-message">{error}</div>}
              <button onClick={handleAddEvent}>Submit Event</button>
            </div>
          )}
        </div>
      )}
      <Footerbar />
    </div>
  );
}

export default OpenForge;

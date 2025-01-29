import React, { useState, useEffect } from "react";
import Footerbar from '../TechnicalFootBar';
import axios from "axios";

function OpenForge() {
  const [isLeadForOpenForge, setIsLeadForOpenForge] = useState(false);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('upcoming');
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const userClub = localStorage.getItem("userClub");

    if (userRole === 'lead' && userClub === 'OpenForge' || userRole === 'admin') {
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

    try {
      const response = await axios.post("https://finalbackend-8.onrender.com/api/events/add", {
        eventname: eventName,
        clubtype: "Technical",
        club: "OpenForge",
        date: eventDate,
        description: eventDescription,
        type: eventType,
        image: imageUrl // Add the image URL to the event document
      });

      alert("Event added successfully!");
      // Clear form fields
      setEventName('');
      setEventDate('');
      setEventDescription('');
      setEventType('upcoming');
      setImageUrl('');
      setShowAddEventForm(false);
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || "Failed to add event. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">OpenForge Club</h1>
      {isLeadForOpenForge && (
        <div className="mb-4">
          <button 
            onClick={() => setShowAddEventForm(!showAddEventForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {showAddEventForm ? "Cancel" : "Add Event"}
          </button>
          
          {showAddEventForm && (
            <div className="mt-4 max-w-lg">
              <h3 className="text-xl font-semibold mb-3">Add New Event</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Event Name"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                
                <textarea
                  placeholder="Event Description"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full p-2 border rounded h-32"
                ></textarea>
                
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="upcoming">Upcoming Event</option>
                  <option value="past">Past Event</option>
                </select>

                {/* Image Upload Section */}
                <div className="border rounded p-4">
                  <p className="mb-2 font-medium">Event Poster</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="w-full"
                  />
                  {uploading && (
                    <p className="text-blue-500 mt-2">Uploading...</p>
                  )}
                  {imageUrl && (
                    <div className="mt-2">
                      <img
                        src={imageUrl}
                        alt="Event poster preview"
                        className="max-w-xs rounded"
                        style={{ width: '120px', height: '120px', borderRadius: '50%' }}
                      />
                    </div>
                  )}
                </div>

                {error && (
                  <div className="text-red-500">{error}</div>
                )}

                <button 
                  onClick={handleAddEvent}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Submit Event
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <Footerbar />
    </div>
  );
}

export default OpenForge;
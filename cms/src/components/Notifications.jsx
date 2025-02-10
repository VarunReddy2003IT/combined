import React, { useState, useEffect } from "react";
import axios from "axios";

// Notification Component
function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const email = localStorage.getItem('userEmail'); // Get email from localStorage

  // Fetch notifications from the backend
  useEffect(() => {
    if (!email) {
      console.error("Email is not available in localStorage");
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`https://finalbackend-8.onrender.com/api/notifications?email=${email}`);

        console.log("API Response:", response.data);

        // Check if notifications field exists and is an array
        if (response.data && Array.isArray(response.data.notifications)) {
          setNotifications(response.data.notifications);
          setUnreadCount(response.data.unreadNotifications || 0);
        } else {
          console.error("Unexpected response format, 'notifications' missing:", response.data);
        }
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    fetchNotifications();
  }, [email]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.put(`https://finalbackend-8.onrender.com/api/notifications/read/${notificationId}`, null, {
        params: { email } // Pass email as query parameter
      });

      if (response.status === 200) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification._id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );
        setUnreadCount((prevUnreadCount) => Math.max(0, prevUnreadCount - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      <p>You have {unreadCount} unread notifications.</p>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification._id}
            className={`notification ${notification.read ? "read" : "unread"}`}
          >
            <h3>{notification.title}</h3>
            <p>{notification.message}</p>
            {notification.read ? (
              <span>Read</span>
            ) : (
              <button onClick={() => markAsRead(notification._id)}>Mark as Read</button>
            )}
          </div>
        ))
      ) : (
        <p>No notifications available.</p>
      )}
    </div>
  );
}

export default Notification;

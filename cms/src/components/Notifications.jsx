import React, { useState, useEffect } from "react";
import axios from "axios";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    if (!email) {
      console.error("Email is not available in localStorage");
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`https://finalbackend-8.onrender.com/api/notifications?email=${email}`);
        if (response.data && Array.isArray(response.data.notifications)) {
          setNotifications(response.data.notifications);
          setUnreadCount(response.data.unreadNotifications || 0);
        }
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    fetchNotifications();
  }, [email]);

  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.put(
        `https://finalbackend-8.onrender.com/api/notifications/read/${notificationId}`,
        null,
        { params: { email } }
      );

      if (response.status === 200) {
        setNotifications(prevNotifications =>
          prevNotifications.map(notification =>
            notification._id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  const handleApproval = async (notificationId) => {
    try {
      const response = await axios.post(
        `https://finalbackend-8.onrender.com/api/notifications/approve-signup/${notificationId}`,
        null,
        { params: { email } }
      );

      if (response.status === 200) {
        setNotifications(prevNotifications =>
          prevNotifications.map(notification =>
            notification._id === notificationId
              ? { ...notification, status: 'APPROVED', read: true }
              : notification
          )
        );
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }
    } catch (error) {
      console.error("Error approving signup request", error);
    }
  };

  const handleRejection = async (notificationId) => {
    try {
      const response = await axios.post(
        `https://finalbackend-8.onrender.com/api/notifications/reject-signup/${notificationId}`,
        null,
        { params: { email } }
      );

      if (response.status === 200) {
        setNotifications(prevNotifications =>
          prevNotifications.map(notification =>
            notification._id === notificationId
              ? { ...notification, status: 'REJECTED', read: true }
              : notification
          )
        );
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }
    } catch (error) {
      console.error("Error rejecting signup request", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Notifications</h2>
        <p className="text-gray-600 mb-6">
          You have {unreadCount} unread notifications
        </p>
        
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  notification.read
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {notification.title}
                </h3>
                <p className="text-gray-600 mb-4">{notification.message}</p>
                
                <div className="flex flex-wrap gap-3">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Mark as Read
                    </button>
                  )}
                  
                  {notification.type === 'SIGNUP_REQUEST' && notification.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleApproval(notification._id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejection(notification._id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  
                  {notification.status && (
                    <span className={`px-3 py-1 text-sm font-medium rounded ${
                      notification.status === 'APPROVED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {notification.status}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No notifications available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
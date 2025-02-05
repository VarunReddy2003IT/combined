import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch pending signup requests for admin/lead roles
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/signup/pending'); // This route should return pending requests
        setPendingRequests(response.data);
      } catch (err) {
        setError('Failed to fetch pending requests');
      }
    };

    fetchPendingRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/signup/approve/${id}`);
      alert(response.data.message);
      // Refresh the list after approval
      setPendingRequests(pendingRequests.filter(request => request._id !== id));
    } catch (error) {
      alert('Error approving request');
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/signup/reject/${id}`);
      alert(response.data.message);
      // Refresh the list after rejection
      setPendingRequests(pendingRequests.filter(request => request._id !== id));
    } catch (error) {
      alert('Error rejecting request');
    }
  };

  return (
    <div>
      <h3>Pending Signup Requests</h3>
      {error && <div className="error">{error}</div>}
      {pendingRequests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <ul>
          {pendingRequests.map((request) => (
            <li key={request._id}>
              <div>
                <p>Name:{request.name}<br></br> Email:&nbsp; {request.email}</p>
                <button onClick={() => handleApprove(request._id)}>Approve</button>
                <button onClick={() => handleReject(request._id)}>Reject</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;

import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';

function Signup() {
  const [name, setName] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [role, setRole] = useState('member'); // Default role as 'member'
  const [loading, setLoading] = useState(false);  // To track loading state
  const [error, setError] = useState(''); // To track error messages

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setName(value);
    } else if (name === 'collegeId') {
      setCollegeId(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'rePassword') {
      setRePassword(value);
    } else if (name === 'role') {
      setRole(value);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Set loading to true while making the request

    // Clear previous error
    setError('');

    // Validations
    if (!name.trim() || !collegeId.trim() || !email.trim() || !password || !rePassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password !== rePassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gvpce\.ac\.in$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email in the format: username@gvpce.ac.in');
      setLoading(false);
      return;
    }

    try {
      // Send signup data to backend
      const response = await axios.post('http://localhost:5000/api/signup', { 
        name, 
        collegeId, 
        email, 
        password, 
        role 
      });

      alert(response.data.message); // Show success message
      // Clear form fields
      setName('');
      setCollegeId('');
      setEmail('');
      setPassword('');
      setRePassword('');
      setLoading(false);
    } catch (error) {
      setError(error.response?.data.message || 'Failed to create account. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className='overall'>
      <h3>Signup</h3>
      <form onSubmit={handleSubmit}>
        {/* Name Input */}
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleInputChange}
          placeholder="Enter your name"
        />

        {/* College ID Input */}
        <input
          type="text"
          name="collegeId"
          value={collegeId}
          onChange={handleInputChange}
          placeholder="Enter your College ID"
        />

        {/* Email Input */}
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          placeholder="Enter your email"
        />

        {/* Password Input */}
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleInputChange}
          placeholder="Enter your password"
        />

        {/* Re-enter Password Input */}
        <input
          type="password"
          name="rePassword"
          value={rePassword}
          onChange={handleInputChange}
          placeholder="Re-enter your password"
        />

        {/* Role Dropdown */}
        <select name="role" value={role} onChange={handleInputChange}>
          <option value="admin">Admin</option>
          <option value="lead">Lead</option>
          <option value="member">Member</option>
        </select>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Submit Button */}
        <div className="button-container">
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;

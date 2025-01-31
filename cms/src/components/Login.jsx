import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';  // Assuming you have this context set up for authentication
import './Login.css'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [club, setClub] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);  // Login function from AuthContext

  // List of clubs for the lead role
  const clubs = [
    'YES','NSS1','NSS2','YouthForSeva','YFS','WeAreForHelp','HOH','Vidyadaan','Rotract'
    ,'GCCC','IEEE','CSI','AlgoRhythm','OpenForge','VLSID','SEEE','Sports'
  ];

  // Handle input change for email, password, role, and club
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'role') setRole(value);
    else if (name === 'club') setClub(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for empty fields
    if (!email.trim() || !password.trim()) {
      setMessage('Please fill in all fields');
      return;
    }

    // Validation for lead role to select a club
    if (role === 'lead' && !club.trim()) {
      setMessage('Please select your club');
      return;
    }

    try {
      // Send the login request to the server
      const response = await axios.post('https://finalbackend-8.onrender.com/api/login', {
        email,
        password,
        role,
        ...(role === 'lead' && { club }),  // Only send club if the role is 'lead'
      });

      // Prepare the user data to store in context
      const userData = { email, role, ...(role === 'lead' && { club }) };

      // Store the email in localStorage after successful login
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', role);
      if(role==='lead'){
        localStorage.setItem('userClub', club);
      }
      console.log(club);
      // Use context login function to store user data
      login(userData);

      // Set the message and navigate to the next page
      setMessage(response.data.message);
      navigate('/app');  // Redirect to the app page after successful login
    } catch (error) {
      console.error('Error during login:', error);
      setMessage(error.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="login-container">
      <h3>Login</h3>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleInputChange}
          placeholder="Password"
          required
        />
        <select
          name="role"
          value={role}
          onChange={handleInputChange}
          required
        >
          <option value="admin">Admin</option>
          <option value="lead">Lead</option>
          <option value="member">Member</option>
        </select>

        {/* Conditionally render the Club dropdown for leads */}
        {role === 'lead' && (
          <select
            name="club"
            value={club}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a Club</option>
            {clubs.map((clubName) => (
              <option key={clubName} value={clubName}>
                {clubName}
              </option>
            ))}
          </select>
        )}

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;

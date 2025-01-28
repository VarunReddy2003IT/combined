import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [club, setClub] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'role') setRole(value);
    else if (name === 'club') setClub(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage('Please fill in all fields');
      return;
    }

    if (role === 'lead' && !club.trim()) {
      setMessage('Please enter your club name');
      return;
    }

    try {
      const response = await axios.post('https://finalbackend-8.onrender.com/api/login', {
        email,
        password,
        role,
        ...(role === 'lead' && { club }),
      });

      const userData = { email, role, ...(role === 'lead' && { club }) };

      login(userData);
      setMessage(response.data.message);
      navigate('/app');
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
        {role === 'lead' && (
          <input
            type="text"
            name="club"
            value={club}
            onChange={handleInputChange}
            placeholder="Club Name"
            required
            className="club-input"
          />
        )}
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
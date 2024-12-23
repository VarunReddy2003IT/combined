import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member'); 
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'role') setRole(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('https://finalbackend-8.onrender.com/api/login', {
        email,
        password,
        role,
      });

      const userData = { email, role };

      // Attempt to save user data in localStorage with error handling
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('userData', JSON.stringify(userData));
        }
      } catch (storageError) {
        console.error('Error saving to localStorage:', storageError);
      }

      login(userData); // Update login state in context
      setMessage(response.data.message);
      navigate('/app');
    } catch (error) {
      console.error('Error during login:', error);
      setMessage(error.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h3>Login</h3>
        {message && <p className="message">{message}</p>}
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          required
        />
        <select name="role" value={role} onChange={handleInputChange}>
          <option value="admin">Admin</option>
          <option value="lead">Lead</option>
          <option value="member">Member</option>
        </select>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}

export default Login;
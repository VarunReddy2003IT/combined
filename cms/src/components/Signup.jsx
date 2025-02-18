import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    collegeId: '',
    email: '',
    mobilenumber: '',
    password: '',
    role: 'member',
    club: '',
  });
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Password visibility state

  const clubs = [
    'YES', 'NSS1', 'NSS2', 'YouthForSeva', 'YFS', 'WeAreForHelp', 'HOH', 'Vidyadaan', 'Rotract',
    'GCCC', 'IEEE', 'CSI', 'AlgoRhythm', 'OpenForge', 'VLSID', 'SEEE', 'Sports'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.collegeId.trim() ||
        !formData.email.trim() || !formData.password.trim() || !formData.mobilenumber.trim()) {
      setError('Please fill in all fields');
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gvpce\.ac\.in$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email in the format: username@gvpce.ac.in');
      return false;
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobilenumber)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return false;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters long and contain a number and a special character');
      return false;
    }

    if (formData.role === 'lead' && !formData.club) {
      setError('Please select a club if you are signing up as a Lead');
      return false;
    }

    return true;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://finalbackend-8.onrender.com/api/signup/send-otp', {
        email: formData.email
      });
      
      setShowOtpInput(true);
      alert(response.data.message);
    } catch (error) {
      setError(error.response?.data.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndSignup = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://finalbackend-8.onrender.com/api/signup/verify', {
        ...formData,
        otp,
        mobilenumber: formData.mobilenumber,
        club: formData.role === 'lead' ? formData.club : undefined
      });

      alert(response.data.message);
      // Reset form
      setFormData({
        name: '',
        collegeId: '',
        email: '',
        mobilenumber: '',
        password: '',
        role: 'member',
        club: ''
      });
      setOtp('');
      setShowOtpInput(false);
    } catch (error) {
      setError(error.response?.data.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="overall">
      <h3>Signup</h3>
      <form onSubmit={showOtpInput ? handleVerifyAndSignup : handleSendOtp}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your name"
          disabled={loading || showOtpInput}
        />

        <input
          type="text"
          name="collegeId"
          value={formData.collegeId}
          onChange={handleInputChange}
          placeholder="Enter your College ID"
          disabled={loading || showOtpInput}
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          disabled={loading || showOtpInput}
        />

        <input
          type="tel"
          name="mobilenumber"
          value={formData.mobilenumber}
          onChange={handleInputChange}
          placeholder="Enter your mobile number"
          disabled={loading || showOtpInput}
          maxLength="10"
        />

        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            disabled={loading || showOtpInput}
          />
          <span className="eye-icon" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <select 
          name="role" 
          value={formData.role} 
          onChange={handleInputChange} 
          disabled={loading || showOtpInput}
        >
          <option value="admin">Admin</option>
          <option value="lead">Lead</option>
          <option value="member">Member</option>
        </select>

        {formData.role === 'lead' && (
          <select 
            name="club" 
            value={formData.club} 
            onChange={handleInputChange} 
            disabled={loading || showOtpInput}
          >
            <option value="">Select a Club</option>
            {clubs.map((clubName) => (
              <option key={clubName} value={clubName}>
                {clubName}
              </option>
            ))}
          </select>
        )}

        {showOtpInput && (
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            disabled={loading}
          />
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="button-container">
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : showOtpInput ? 'Verify & Signup' : 'Send OTP'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;

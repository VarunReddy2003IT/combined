import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';

function Signup() {
  const [name, setName] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member'); // Default role as 'member'
  const [club, setClub] = useState(''); // New state for club selection
  const [loading, setLoading] = useState(false); // To track loading state
  const [error, setError] = useState(''); // To track error messages

  const clubs = [
    'YES','NSS1','NSS2','YouthForSeva','YFS','WeAreForHelp','HOH','Vidyadaan','Rotract'
    ,'GCCC','IEEE','CSI','AlgoRhythm','OpenForge','VLSID','SEEE','Sports'
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    else if (name === 'collegeId') setCollegeId(value);
    else if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'role') setRole(value);
    else if (name === 'club') setClub(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true while making the request

    // Clear previous error
    setError('');

    // Validations
    if (!name.trim() || !collegeId.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gvpce\.ac\.in$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email in the format: username@gvpce.ac.in');
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and contain a number and a special character');
      setLoading(false);
      return;
    }

    if (role === 'lead' && !club) {
      setError('Please select a club if you are signing up as a Lead');
      setLoading(false);
      return;
    }

    try {
      // Send signup data to backend
      const response = await axios.post('https://finalbackend-8.onrender.com/api/signup', { 
        name, 
        collegeId, 
        email, 
        password, 
        role, 
        club: role === 'lead' ? club : undefined // Include club only for leads
      });

      alert(response.data.message); // Show success message
      // Clear form fields
      setName('');
      setCollegeId('');
      setEmail('');
      setPassword('');
      setRole('member');
      setClub('');
      setLoading(false);
    } catch (error) {
      setError(error.response?.data.message || 'Failed to create account. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className="overall">
      <h3>Signup</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleInputChange}
          placeholder="Enter your name"
          disabled={loading}
        />

        <input
          type="text"
          name="collegeId"
          value={collegeId}
          onChange={handleInputChange}
          placeholder="Enter your College ID"
          disabled={loading}
        />

        <input
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          disabled={loading}
        />

        <input
          type="password"
          name="password"
          value={password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          disabled={loading}
        />

        <select name="role" value={role} onChange={handleInputChange} disabled={loading}>
          <option value="admin">Admin</option>
          <option value="lead">Lead</option>
          <option value="member">Member</option>
        </select>

        {/* Conditionally render the Club dropdown for leads */}
        {role === 'lead' && (
          <select name="club" value={club} onChange={handleInputChange} disabled={loading}>
            <option value="">Select a Club</option>
            {clubs.map((clubName) => (
              <option key={clubName} value={clubName}>
                {clubName}
              </option>
            ))}
          </select>
        )}

        {error && <div className="error-message">{error}</div>}

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

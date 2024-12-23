import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './components/AuthContext';
import './Navbar.css';

function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/app">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        {isLoggedIn ? (
          <>
            <li><Link to="/clubs">Clubs</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><button onClick={logout}>Logout</button></li> {/* Logout button styled like a link */}
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;

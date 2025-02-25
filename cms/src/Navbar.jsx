import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './components/AuthContext';
import './Navbar.css';

function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [displayText, setDisplayText] = useState("Clubs");

  useEffect(() => {
    let currentText = "Clubs";
    const intervalId = setInterval(() => {
      currentText = currentText === "Clubs" ? "Chapters" : "Clubs";
      setDisplayText(currentText);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  // Handle logout with confirmation
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      logout();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-wrapper">
        <ul>
          <li><Link to="/app">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          {isLoggedIn ? (
            <>
              <li><Link to="/clubs">{displayText}</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Signup</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

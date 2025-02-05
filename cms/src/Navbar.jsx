import React, { useContext,useEffect,useState } from 'react';
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
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/app">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        {isLoggedIn ? (
          <>
            <li><Link to="/clubs">{displayText}</Link></li>
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

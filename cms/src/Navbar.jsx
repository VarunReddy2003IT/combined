import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom'; // Make sure 'Link' is imported
import { AuthContext } from './components/AuthContext';
import './Navbar.css';

function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <ul>
        <li><NavLink to="/app" activeClassName="active">Home</NavLink></li>
        <li><NavLink to="/about" activeClassName="active">About</NavLink></li>
        {isLoggedIn ? (
          <>
            <li><NavLink to="/clubs" activeClassName="active">Clubs</NavLink></li>
            <li><NavLink to="/profile" activeClassName="active">Profile</NavLink></li>
            <li><Link to="/logout" onClick={logout}>Logout</Link></li> {/* Directly call logout here */}
          </>
        ) : (
          <>
            <li><NavLink to="/login" activeClassName="active">Login</NavLink></li>
            <li><NavLink to="/signup" activeClassName="active">Signup</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;

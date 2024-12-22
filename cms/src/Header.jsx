import React from 'react';
import gvplogo from './gvplogo.png';
import './header.css';

function Header() {
  return (
    <div className="header">
      <img src={gvplogo} className="gvplogo" alt="GVP Logo" />
      <h1>Gayatri Vidya Parishad College Of Engineering</h1>
    </div>
  );
}

export default Header;

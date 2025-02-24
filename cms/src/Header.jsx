import React from 'react';
import gvplogo from './gvp-banner.jpg';
import './header.css';

function Header() {
  return (
    <div className="header">
      <img src={gvplogo} className="gvplogo" alt="GVP Logo" />
    </div>
  );
}

export default Header;

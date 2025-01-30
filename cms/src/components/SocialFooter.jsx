import React from "react";
import { Link } from 'react-router-dom';
import './SocialFootBar.css';

function SocialFooter() {
  return (
    <footer className="footer-bar">
      <nav className="footer-nav">
        <ul className="footer-list">
          <li><Link to="/cfsr" className="footer-link">CFSR</Link></li>
          <li><Link to="/yes" className="footer-link">YES</Link></li>
          <li><Link to="/yfs" className="footer-link">YFS</Link></li>
          <li><Link to="/nss1" className="footer-link">NSS1</Link></li>
          <li><Link to="/nss2" className="footer-link">NSS2</Link></li>
          <li><Link to="/youth-for-seva" className="footer-link">YouthForSeva</Link></li>
          <li><Link to="/we-are-for-help" className="footer-link">WeAreForHelp</Link></li>
          <li><Link to="/hoh" className="footer-link">HOH</Link></li>
          <li><Link to="/rotract" className="footer-link">Rotract</Link></li>
        </ul>
      </nav>
    </footer>
  );
}

export default SocialFooter;
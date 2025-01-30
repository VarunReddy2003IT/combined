import React from "react";
import { Link } from 'react-router-dom'; // Import Link for routing
import './TechnicalFootBar.css'
function footer(){
    return(<footer className="footer-bar">
        <nav className="footer-nav">
          <ul className="footer-list">
            <li><Link to="/ieee" className="footer-link">IEEE</Link></li>
            <li><Link to="/csi" className="footer-link">CSI</Link></li>
            <li><Link to="/openforge" className="footer-link">OpenForge</Link></li>
            <li><Link to="/vlsid" className="footer-link">VLSID</Link></li>
            <li><Link to="/seee" className="footer-link">SEEE</Link></li>
            <li><Link to="/algorhythm" className="footer-link">AlgoRhythm</Link></li>
          </ul>
        </nav>
      </footer>);
}
export default footer;
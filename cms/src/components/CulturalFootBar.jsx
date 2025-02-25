import React from "react";
import { Link } from 'react-router-dom'; // Import Link for routing
function footer(){
    return(<footer className="footer-bar">
        <nav className="footer-nav">
          <ul className="footer-list">
            <li><Link to="/gccc" className="footer-link">GCCC</Link></li>
            
          </ul>
        </nav>
      </footer>);
}
export default footer;
import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ onToggle }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
    onToggle(!isVisible);
  };

  return (
    <div>
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        ☰
      </button>
      <div className={`sidebar ${isVisible ? 'open' : ''}`}>
        <ul>
          <li>
            <h3>Technical</h3>
            <ul>
              <li>AI Club</li>
              <li>Robotics Club</li>
              <li>Web Development Club</li>
              <li>Programming Club</li>
            </ul>
          </li>
          <li>
            <h3>Social</h3>
            <ul>
              <li>Volunteer Club</li>
              <li>Events Club</li>
              <li>Debate Club</li>
              <li>Photography Club</li>
            </ul>
          </li>
          <li>
            <h3>Cultural</h3>
            <ul>
              <li>Dance Club</li>
              <li>Music Club</li>
              <li>Drama Club</li>
              <li>Art Club</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

import React from 'react';
import './Technical.css';
import eventimage from "./event_poster.png";

function Technical() {
  return (
    <div className='entirebody'>
      {/* Main Heading */}
      <header>
        <h1>Technical Club Page</h1>
        <p>Explore technical clubs and their activities.</p>
      </header>

      {/* Main Content */}
      <main>
        {/* Upcoming Events Section */}
        <section>
          <h2>Upcoming Events</h2>
          <div>
            <h3>Upcoming Event 1</h3>
            <p>
              This is the description for the upcoming event 1. It provides
              details about the event, location, and schedule.
            </p>
            <img src={eventimage} alt="Upcoming Event 1" />
          </div>
          <div>
            <h3>Upcoming Event 2</h3>
            <p>
              This is the description for the upcoming event 2. It provides
              details about the event, location, and schedule.
            </p>
            <img src={eventimage} alt="Upcoming Event 2" />
          </div>
        </section>

        {/* Past Events Section */}
        <section>
          <h2>Past Events</h2>
          <div>
            <h3>Past Event 1</h3>
            <p>
              This is the description for past event 1. It highlights the key
              moments and outcomes of the event.
            </p>
            <img src={eventimage} alt="Past Event 1" />
          </div>
          <div>
            <h3>Past Event 2</h3>
            <p>
              This is the description for past event 2. It highlights the key
              moments and outcomes of the event.
            </p>
            <img src={eventimage} alt="Past Event 2" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <ul>
          <li>
            <a
              href="https://ieee.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              IEEE
            </a>
          </li>
          <li>
            <a
              href="https://csi-india.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              CSI
            </a>
          </li>
          <li>
            <a
              href="https://vlsi.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              VLSID
            </a>
          </li>
          <li>
            <a
              href="https://seee.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              SEEE
            </a>
          </li>
          <li>
            <a
              href="https://itclub1.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenForge
            </a>
          </li>
          <li>
            <a
              href="https://itclub2.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              AlgoRhythm
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
}

export default Technical;

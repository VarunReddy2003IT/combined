import React from "react";
import "./Home.css";
import eventPoster from "./assets/event_poster.png"; // Add event poster image in src/assets folder

function Home() {
  return (
    <div className="home-container">
      

      {/* Welcome Section */}
      <section className="welcome-section">
        <h2>Welcome to Gayatri Vidya Parishad College of Engineering</h2>
        <p>
          At Gayatri Vidya Parishad College of Engineering, we take pride in our
          vibrant and diverse club culture. With clubs spanning across Social,
          Cultural, Technical, and Coding, our college offers something for
          everyone.
        </p>
      </section>

      {/* Past Events Section */}
      <section className="event-section">
        <h2>Past Famous Events</h2>
        <div className="event-card">
          <img src={eventPoster} alt="TechFest 2023" />
          <div className="event-details">
            <h3>TechFest 2023</h3>
            <p>Date: 25th November 2023</p>
            <p>
              An exciting and grand tech fest where students showcased their
              innovative projects and participated in coding challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="event-section">
        <h2>Upcoming Events</h2>
        <div className="event-card">
          <img src={eventPoster} alt="Tech Talk" />
          <div className="event-details">
            <h3>Tech Talk: AI and the Future</h3>
            <p>Date: 15th December 2024</p>
            <p>
              Join us for an insightful discussion about AI's impact on our
              future.
            </p>
          </div>
        </div>

        <div className="event-card">
          <img src={eventPoster} alt="Annual Cultural Fest" />
          <div className="event-details">
            <h3>Annual Cultural Fest</h3>
            <p>Date: 20th December 2024</p>
            <p>Be a part of the grand celebration of arts and culture.</p>
            <button>RSVP</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
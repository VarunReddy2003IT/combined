import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <h1>About Us</h1>
      <p className="about-description">
        Welcome to our platform! We are dedicated to providing users with an engaging and efficient experience
        where they can interact with various tools, services, and content. Our goal is to help you connect, learn,
        and grow while offering features that cater to your needs.
      </p>
      <section className="mission-statement">
        <h2>Our Mission</h2>
        <p>
          Our mission is to create a platform that encourages collaboration, creativity, and innovation. We aim
          to foster a community where individuals can thrive and work together to achieve great things.
        </p>
      </section>
      <section className="vision-statement">
        <h2>Our Vision</h2>
        <p>
          Our vision is to be a leading platform for students, professionals, and organizations, offering
          dynamic tools, insightful content, and a collaborative environment to help people reach their full
          potential.
        </p>
      </section>
      <section className="team">
        <h2>Meet the Team</h2>
        <p>
          We are a diverse group of passionate individuals from various backgrounds, all working towards a
          common goal of making the platform an innovative and useful space for everyone.
        </p>
      </section>
    </div>
  );
}

export default About;

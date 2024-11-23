import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo1 from "../Images/logo1.png";
import "../CSS/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Header Section */}
      {/* <header className="header">
        <div className="logo">
          <span className="highlight">NEX</span>US
        </div>
        <div className="header-buttons">
          <button className="btn login-btn">Login</button>
          <button className="btn register-btn">Register Now</button>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-header">
          <Link to="/home">
            <img src={logo1} alt="Logo" className="logo" />
          </Link>

          <div className="hero-nav-buttons">
            <button
              className="btn login-btn"
              onClick={() => navigate("/login")}>
              Login
            </button>
            <button
              className="btn register-btn"
              onClick={() => navigate("/signuptest3")}>
              Register
            </button>
          </div>
        </div>
        <div className="hero-content">
          <h1>
            Welcome to <span className="highlight">UoK</span> <br></br>Club
            Management System!
          </h1>
          <p>
            Discover and Engage with a Diverse Range of Student Clubs at Our
            University. Join Today to Connect with Like-Minded Individuals,
            Participate in Exciting Events, and Enhance Your University
            Experience!
          </p>

          <div className="hero-nav-buttons">
            <button
              className="btn login-btn"
              onClick={() => navigate("/login")}>
              Login
            </button>
            <button
              className="btn register-btn"
              onClick={() => navigate("/signup")}>
              Register Now
            </button>
          </div>
        </div>
      </section>

      {/* Clubs Section */}
      <section className="clubs">
        <h2>Join a Club Today!</h2>
        <p>
          Student clubs provide diverse opportunities for personal growth, skill
          development, and cultural engagement through workshops, events, and
          collaborative activities.
        </p>
        <div className="club-list">
          <div className="club-card">SESA</div>
          <div className="club-card">Gavel Clubs</div>
          <div className="club-card">Cherish Club</div>
          <div className="club-card">Adventure Club</div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="about-content">
          <img
            src="https://source.unsplash.com/600x400/?coding,team"
            alt="Team"
            className="about-image"
          />
          <div className="about-text">
            <h2>
              We Help Students Discover All Available Clubs Within A{" "}
              <span className="highlight">Single Platform</span>.
            </h2>
            <p>
              Our platform centralizes information about all university clubs,
              allowing students to easily browse and find the groups that match
              their interests. By providing detailed insights into each club's
              activities and offerings, we aim to enhance student engagement and
              foster a vibrant campus community.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Club Merchandise Marketplace</h2>
        <p>
          Show your support for your favorite university clubs by exploring our
          collection of exclusive merchandise!
        </p>
        <div className="features-list">
          <div className="feature-card">24/7 Support</div>
          <div className="feature-card">Verified Sellers</div>
          <div className="feature-card">Satisfaction</div>
          <div className="feature-card">No Contracts</div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact">
        <h2>Get In Touch</h2>
        <form className="contact-form">
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email Address" />
          <input type="text" placeholder="Subject" />
          <textarea placeholder="Leave Us A Message"></textarea>
          <button type="submit" className="btn">
            Send Message
          </button>
        </form>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-columns">
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li>Home</li>
              <li>Clubs</li>
              <li>Events</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Content</h3>
            <ul>
              <li>Join Now</li>
              <li>View All Clubs</li>
              <li>Chat Bot</li>
              <li>Notifications</li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Contact Us</h3>
            <p>
              Head Office: Address Here
              <br />
              University of Knowledge
              <br />
              Phone: +123 456 7890
              <br />
              Email: info@example.com
            </p>
          </div>
        </div>
        <p className="footer-bottom">Copyright © UoK | Designed by Nexus</p>
      </footer>
    </div>
  );
};

export default Home;

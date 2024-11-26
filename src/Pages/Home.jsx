import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo1 from "../Images/logo1.png";
import sesa from "../Images/sesa.png";
import gavel from "../Images/gavel.jfif";
import leo from "../Images/leo.png";
import ad from "../Images/ad.png";
import img1 from "../Images/img1.png";
import "../CSS/Home.css";
import { FaRegClock } from "react-icons/fa6";
import { GoShieldCheck } from "react-icons/go";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
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
              onClick={() => navigate("/signup")}>
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

      <section className="club-section">
        <h2>JOIN A CLUB TODAY!</h2>
        <p>
          Student clubs provide diverse opportunities for personal growth, skill
          development, and cultural engagement <br />
          through workshops, events, and collaborative activities.
        </p>
        <div className="club-cards">
          <div className="club-card">
            <img src={sesa} alt="SESA Logo" />
          </div>
          <div className="club-card">
            <img src={gavel} alt="Gavel Club Logo" />
          </div>
          <div className="club-card">
            <img src={leo} alt="Leo Logo" />
          </div>
          <div className="club-card">
            <img src={ad} alt="Adventure Club Logo" />
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="description-section">
        <div className="description-content">
          <img src={img1} alt="Students coding" className="description-image" />
          <div className="description-text">
            <h3>
              We Help Students{" "}
              <span className="highlight">
                Discover <br /> All Available Clubs
              </span>{" "}
              Within A <br />
              Single Platform.
            </h3>
            <p>
              Our platform centralizes information about all university clubs,
              allowing students to easily browse and find groups that match
              their interests. By providing detailed insights into each club's
              activities and offerings, we aim to enhance student engagement and
              foster a vibrant campus community. With just a few clicks,
              students can connect with like-minded peers and get involved in
              enriching experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Add Club Merchandise Marketplace */}
      <section className="marketplace-section">
        <div className="marketplace-content">
          <div className="marketplace-left">
            <h2>
              Club Merchandise <br />
              <span className="highlight">Marketplace</span>
            </h2>
            <p>
              Show your support for your favorite university clubs by <br />
              exploring our collection of exclusive merchandise! From stylish
              <br /> T-shirts and caps to water bottles and hand bands, find{" "}
              <br />
              everything you need to represent your club in style. Shop <br />
              now and wear your pride!
            </p>
            <div className="marketplace-badges">
              <span className="badge red">
                <FaRegClock />
                24/7 Support
              </span>
              <span className="badge green">
                <GoShieldCheck />
                99% Secured
              </span>
            </div>

            <button className="view-products-button">View Products</button>
          </div>
          {/* <div className="marketplace-cards">
            <div className="card">Instant 24/7 Support</div>
            <div className="card">Verified Sellers</div>
            <div className="card">Satisfaction</div>
            <div className="card">No Contracts</div>
          </div> */}
        </div>
      </section>

      {/* Get In Touch Section */}
      <section className="contact-section">
        <h1 className="contact-heading">Get In Touch</h1>
        <form className="contact-form">
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                id="name"
                placeholder="Enter your name here"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                id="email"
                placeholder="johndoe@gmail.com"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="subject"
              placeholder="How can we help"
              required
            />
          </div>
          <div className="form-group">
            <textarea
              id="message"
              rows="4"
              placeholder="Please type your comments..."
              required></textarea>
          </div>
          <button type="submit" className="submit-btn">
            Send Message
          </button>
        </form>
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <div className="footer-content">
          <div className="footer-column">
            <h4>Quick Link</h4>
            <ul>
              <li>Home</li>
              <li>Clubs</li>
              <li>Events</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Content</h4>
            <ul>
              <li>Join Now</li>
              <li>View All Clubs</li>
              <li>Chat Bot</li>
              <li>Notification</li>
              <li>Tasks</li>
              <li>Announcements</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Contact Us</h4>
            <ul>
              <li>
                {" "}
                Head Office Address
                <br />
                University of Kelaniya, Faculty of Science
              </li>
              <li>Phone: Xxx Xxxx Xxx</li>
              <li>Email: info@example.com</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            Copyright © 2024 | Designed by <span>Nexus</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

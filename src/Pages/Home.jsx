import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo1 from "../Images/logo1.png";
import sesa from "../Images/sesa.png";
import gavel from "../Images/gavel.jfif";
import leo from "../Images/leo.png";
import ad from "../Images/ad.png";
import img1 from "../Images/img1.png";
import "../CSS/Home.css";
import { FaComment } from "react-icons/fa";
import profilePic from "../Images/User.jpg";
import UserDetailModal from "../Components/UserDetailModal";
import { jwtDecode } from "jwt-decode";
import { Menu, MenuItem } from "@mui/material";
import Avatar from "@mui/material/Avatar";
const BASE_URL= process.env.REACT_APP_BASE_URL;
const Home = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalUserData, setModalUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/send-email",
        formData
      );
      setResponseMessage("Your message has been sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" }); // Clear form after success
    } catch (error) {
      setResponseMessage("Error sending message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigate = useNavigate();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, []);

  const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev); // Toggle chatbot visibility
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
    navigate("/home"); // Redirect to the login page after logout
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewClubs = () => {
    navigate("/viewclubs");
    handleClose(); // Close the menu after navigation
  };

  const handleMyProfile = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    try {
      const decoded = jwtDecode(accessToken);
      const email = decoded.email;

      const response = await axios.get(`${BASE_URL}/student/${email}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setModalUserData(response.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-header">
          <Link to="/home">
            <img src={logo1} alt="Logo" className="logo" />
          </Link>

          <div className="hero-nav-buttons">
            {isAuthenticated ? (
              <div className="profile-menu-container">
                <Avatar
                  alt="User Profile"
                  src={profilePic} // Replace with dynamic user image URL if available
                  onClick={handleClick}
                  className="profile-avatar"
                />
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem onClick={handleViewClubs}>View Clubs</MenuItem>
                  <MenuItem onClick={handleMyProfile}>My Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            ) : (
              <>
                <button
                  className="btn login-btn"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="btn register-btn"
                  onClick={() => navigate("/signup")}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
        <div className="hero-content">
          <h1>
            Welcome to <span className="highlight">UoK</span> <br /> Club
            Management System!
          </h1>
          <p>
            Discover and Engage with a Diverse Range of Student Clubs at Our
            University. Join Today to Connect with Like-Minded Individuals,
            Participate in Exciting Events, and Enhance Your University
            Experience!
          </p>

          {!isAuthenticated && (
            <div className="hero-nav-buttons">
              <button
                className="btn login-btn"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="btn register-btn"
                onClick={() => navigate("/signup")}
              >
                Register Now
              </button>
            </div>
          )}
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
            <div className="marketplace-badges"></div>

            <button className="view-products-button">View Products</button>
          </div>
        </div>
      </section>

      {/* Chatbot Icon */}
      <div className="chatbot-icon" onClick={toggleChatbot}>
        <FaComment size={50} color="#fff" />
      </div>

      {/* Chatbot Popup */}
      {isChatbotOpen && (
        <div className="chatbot-popup">
          <div className="chatbot-header">
            <h3>Chat with Us!</h3>
            <button onClick={toggleChatbot} className="close-chatbot">
              X
            </button>
          </div>
          <div className="chatbot-body">
            <p>Hi! How can I assist you today?</p>
          </div>
        </div>
      )}

      {/* Get In Touch Section */}
      <section className="contact-section">
        <h1 className="contact-heading">Get In Touch</h1>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="How can we help?"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              id="message"
              name="message"
              rows="4"
              placeholder="Please type your comments..."
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
        {responseMessage && <p>{responseMessage}</p>}
      </section>
      <UserDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={modalUserData}
      />

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

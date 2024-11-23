import React from "react";
import { Link } from "react-router-dom";
import "../CSS/Signup.css";
import logo1 from "../Images/logo1.png";

const Signup = () => {
  return (
    <div className="signup-container">
      <Link to="/home">
        <img src={logo1} alt="Logo" className="logo" />
      </Link>
      <div className="signup-box">
        <h2>
          WELCOME <span className="highlight">NEXUS</span>
        </h2>
        <p>Welcome to Nexus dashboard Community</p>
        <form className="signup-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="First Name"
              className="input-field"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="input-field"
              required
            />
          </div>
          <div className="form-row">
            <input
              type="email"
              placeholder="Email Address"
              className="input-field"
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="input-field"
              required
            />
          </div>
          <div className="form-row">
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="input-field"
              required
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Faculty"
              className="input-field"
              required
            />
            <input
              type="text"
              placeholder="Department"
              className="input-field"
              required
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Year"
              className="input-field"
              required
            />
            <input
              type="text"
              placeholder="Course Name"
              className="input-field"
              required
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Student Number"
              className="input-field"
              required
            />
            <input
              type="date"
              placeholder="Date of Birth"
              className="input-field"
              required
            />
          </div>
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember Me</label>
          </div>
          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
        <p className="register">
          If you don’t have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;

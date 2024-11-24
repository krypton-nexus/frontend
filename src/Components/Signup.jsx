import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../CSS/Signup.css";
import logo1 from "../Images/logo1.png";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@stu\.kln\.ac\.lk$/;
    if (!value) {
      setEmailError("Email is required.");
    } else if (!emailRegex.test(value)) {
      setEmailError("Email must end with @stu.kln.ac.lk.");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (value) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!value) {
      setPasswordError("Password is required.");
    } else if (!passwordRegex.test(value)) {
      setPasswordError(
        "Password must include at least 8 characters with uppercase, lowercase, number, and special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = (value) => {
    if (!value) {
      setConfirmPasswordError("Confirm Password is required.");
    } else if (value !== password) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateEmail(email);
    validatePassword(password);
    validateConfirmPassword(confirmPassword);
    if (!emailError && !passwordError && !confirmPasswordError) {
      alert("Form submitted successfully!");
      // Add your form submission logic here
    }
  };

  return (
    <div className="signup-container">
      <Link to="/home">
        <img src={logo1} alt="Logo" className="logo" />
      </Link>
      <div className="signup-box">
        <h2>
          WELCOME <span className="highlight">NEXUS</span>
        </h2>
        <p>Welcome to Nexus Dashboard Community</p>
        <form className="signup-form" onSubmit={handleSubmit}>
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
            <div className="input-wrapper">
              <input
                type="email"
                placeholder="Email Address"
                className={`input-field ${emailError ? "error-border" : ""}`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                required
              />
              {emailError && (
                <div className="error-box">
                  <span className="error-icon">!</span>
                  {emailError}
                </div>
              )}
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Phone Number"
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-wrapper">
              <input
                type="password"
                placeholder="Password"
                className={`input-field ${passwordError ? "error-border" : ""}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                required
              />
              {passwordError && (
                <div className="error-box">
                  <span className="error-icon">!</span>
                  {passwordError}
                </div>
              )}
            </div>
            <div className="input-wrapper">
              <input
                type="password"
                placeholder="Confirm Password"
                className={`input-field ${
                  confirmPasswordError ? "error-border" : ""
                }`}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateConfirmPassword(e.target.value);
                }}
                required
              />
              {confirmPasswordError && (
                <div className="error-box">
                  <span className="error-icon">!</span>
                  {confirmPasswordError}
                </div>
              )}
            </div>
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

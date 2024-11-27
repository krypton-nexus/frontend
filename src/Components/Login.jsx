import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/Login.css";
import logo1 from "../Images/logo1.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form behavior
    setError(""); 

    try {
      // Make API call to the updated endpoint
      const response = await axios.post(
        "http://13.232.48.203:5000/auth/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle the response
      if (response.data.success) {
        localStorage.setItem("access_token", response.data.token); // Save token to localStorage
        alert("Login successful!");
        navigate("/Home.jsx"); // Redirect to home page
      } else {
        setError(response.data.message || "Login failed!");
      }
    } catch (error) {
      if (error.response) {
        console.error("API Error Response:", error.response.data);
        setError(error.response.data.message || "Server error occurred.");
      } else if (error.request) {
        console.error("No response from API. Error Request:", error.request);
        setError("No response from server. Please try again later.");
      } else {
        console.error("Error in request setup:", error.message);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      {/* Logo */}
      <Link to="/home">
        <img src={logo1} alt="Logo" className="logo" />
      </Link>

      <div className="login-box">
        {/* Header */}
        <h2>
          WELCOME <span className="highlight">NEXUS</span>
        </h2>
        <p>Welcome to Nexus dashboard Community</p>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember Me</label>
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        {/* Register Link */}
        <p className="register">
          Don’t have an account? <Link to="/signup">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

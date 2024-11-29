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
    e.preventDefault();
    setError("");

    console.log("Email:", email);
    console.log("Password:", password);

    try {
      const response = await axios.post(
        "http://13.232.48.203:5000/auth/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.token) {
        const token = response.data.token;
        localStorage.setItem("access_token", token);

        if (
          response.data.error &&
          response.data.error === "Email is not verified."
        ) {
          alert(
            "Your email is not verified. Please verify your email before logging in."
          );
          localStorage.removeItem("access_token");
          navigate("/verifyemail");
          return;
        }

        alert("Login successful!");
        navigate("/viewclubs");
      } else {
        setError(response.data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login Error:", error);

      // Handle different types of errors
      if (error.response) {
        console.error("Response data:", error.response.data); // Log response data for more insights
        switch (error.response.status) {
          case 404:
            setError("User not found. Please check your email.");
            break;
          case 401:
            setError("Invalid email or password. Please try again.");
            break;
          case 400:
            if (error.response.data.error === "Email is not verified.") {
              setError("Your email is not verified. Please check your inbox.");
              // Redirect to the email verification page
              navigate("/verifyemail");
            } else {
              setError(error.response.data.message || "Login failed.");
            }
            break;
          default:
            setError(
              error.response.data.message || "An unexpected error occurred."
            );
        }
      } else if (error.request) {
        // Request was made, but no response received
        setError("Unable to reach the server. Please check your connection.");
      } else {
        // Something went wrong while setting up the request
        setError("An unexpected error occurred. Please try again later.");
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

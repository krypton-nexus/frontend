import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../CSS/Login.css";
import logo1 from "../Images/logo1.png";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const adminAccessToken = localStorage.getItem("admin_access_token");
    if (adminAccessToken) {
      try {
        const decodedToken = jwtDecode(adminAccessToken);
        const expiryTime = decodedToken.exp * 1000; // Convert to milliseconds
        if (new Date().getTime() < expiryTime) {
          navigate("/admindashboard");
        } else {
          localStorage.removeItem("admin_access_token");
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("admin_access_token");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");


    try {
      const response = await axios.post(
        "http://43.205.202.255:5000/auth/admin/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.token) {
        const token = response.data.token;
        localStorage.setItem("admin_access_token", token);
console.log(token);

        if (response.data.error === "Email is not verified.") {
          alert(
            "Your email is not verified. Please verify your email before logging in."
          );
          localStorage.removeItem("admin_access_token");
          navigate("/verifyemail");
          return;
        }
        navigate("/admindashboard"); 
      } else {
        setError(response.data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response) {
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
              navigate("/verifyemail");
            } else {
              setError(error.response.data.message || "Login failed.");
            }
            break;
          default:
            setError("An unexpected error occurred.");
        }
      } else if (error.request) {
        setError("Unable to reach the server. Please check your connection.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="login-container">
      <Link to="/home">
        <img src={logo1} alt="Logo" className="logo" />
      </Link>

      <div className="login-box">
        <h2>
          WELCOME <span className="highlight">NEXUS</span>
        </h2>
        <p>Welcome to Nexus Admin Dashboard Community</p>

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

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default AdminLogin;
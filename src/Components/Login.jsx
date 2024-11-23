import React from "react";
import { Link } from "react-router-dom";
import "../CSS/Login.css";
import logo1 from "../Images/logo1.png";

const Login = () => {
  return (
    <div className="login-container">
      <Link to="/home">
        <img src={logo1} alt="Logo" className="logo" />
      </Link>

      <div className="login-box">
        <h2>
          WELCOME <span className="highlight">NEXUS</span>
        </h2>
        <p>Welcome to Nexus dashboard Community</p>
        <form>
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
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
        <p className="register">
          If you don’t have an account? <a href="/signup">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { enqueueSnackbar } from "notistack";
import useAuthCheck from "./UseAuthCheck";
import "../CSS/Login.css";
import logo1 from "../Images/logo1.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useAuthCheck(navigate);

  // Function to check if the token is valid (exists and not expired)
  const isTokenValid = () => {
    const token = localStorage.getItem("access_token");
    const tokenExpiry = localStorage.getItem("token_expiry");

    if (!token || !tokenExpiry) {
      return false; // Token or expiry time is missing
    }

    // Check if token is expired
    const currentTime = new Date().getTime();
    if (currentTime >= tokenExpiry) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_expiry");
      return false; // Token is expired
    }

    return true; // Token is valid
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    try {
      const { data } = await axios.post(
        "http://43.205.202.255:5000/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.token) {
        const { exp } = jwtDecode(data.token);
        const expiryTime = exp * 1000;

        // Save token and expiry time in localStorage
        localStorage.setItem("access_token", data.token);
        localStorage.setItem("token_expiry", expiryTime);

        console.log(data.token);
        console.log(expiryTime);

        enqueueSnackbar("Login Successful", { variant: "success" });
        navigate("/viewclubs");
      } else {
        setError(data.message || "Login failed!");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        "An unexpected error occurred. Please try again later.";
      enqueueSnackbar(errorMessage, { variant: "error" });
      setError(errorMessage);
    }
  };

  useEffect(() => {
    // Check if the token is valid when the component loads
    if (isTokenValid()) {
      enqueueSnackbar("Already logged in.", { variant: "info" });
      navigate("/viewclubs");
    }
  }, [navigate]);

  return (
    <div className="login-container">
      <Link to="/home">
        <img src={logo1} alt="Logo" className="logo" />
      </Link>

      <div className="login-box">
        <h2>
          WELCOME <span className="highlight">NEXUS</span>
        </h2>
        <p>Welcome to Nexus Dashboard Community</p>

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

        <p className="register">
          Don’t have an account? <Link to="/signup">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

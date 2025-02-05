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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await axios.post(
        "http://43.205.202.255:5000/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.token) {
        const { exp } = jwtDecode(data.token);
        const expiryTime = exp * 1000;

        localStorage.setItem("access_token", data.token);
        localStorage.setItem("token_expiry", expiryTime);

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

  const isTokenValid = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return false;

    try {
      const { exp } = jwtDecode(token);
      const isExpired = new Date().getTime() >= exp * 1000;

      if (isExpired) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("token_expiry");
        return false;
      }

      return true;
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_expiry");
      return false;
    }
  };

  useEffect(() => {
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

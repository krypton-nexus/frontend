import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { enqueueSnackbar } from "notistack";
import useAuthCheck from "./UseAuthCheck";
import "../CSS/Login.css";
import logo1 from "../Images/logo1.png";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useAuthCheck(navigate);

  const isTokenValid = () => {
    const token = localStorage.getItem("access_token");
    const tokenExpiry = localStorage.getItem("token_expiry");
    if (!token || !tokenExpiry) return false;

    const currentTime = Date.now();
    if (currentTime >= tokenExpiry) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_expiry");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${BASE_URL}/auth/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.token) {
        const decoded = jwtDecode(data.token);
        const expiryTime = (decoded?.exp || 0) * 1000;
        console.log(data.token);
        localStorage.setItem("access_token", data.token);
        localStorage.setItem("token_expiry", expiryTime);
        // 🔽 Fetch user clubs and all clubs
        const [userClubsRes, allClubsRes] = await Promise.all([
          axios.get(`${BASE_URL}/student/clubs/${decoded.email}`, {
            headers: { Authorization: `Bearer ${data.token}` },
          }),
          axios.get(`${BASE_URL}/club/list`, {
            headers: { Authorization: `Bearer ${data.token}` },
          }),
        ]);

        // 🔽 Store in localStorage
        localStorage.setItem(
          "user_clubs",
          JSON.stringify(userClubsRes.data.clubs || [])
        );

        localStorage.setItem(
          "all_clubs",
          JSON.stringify(allClubsRes.data.clubs || [])
        );
        enqueueSnackbar("Login Successful", { variant: "success" });
        navigate("/viewclubs");
      } else {
        enqueueSnackbar(data.message || "Login failed!", { variant: "error" });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        "An unexpected error occurred. Please try again later.";
      enqueueSnackbar(errorMessage, { variant: "error" });
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
        <p className="register">
          Don’t have an account? <Link to="/signup">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

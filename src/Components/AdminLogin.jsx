import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../CSS/Login.css";
import logo1 from "../Images/logo1.png";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const BASE_URL = process.env.REACT_APP_BASE_URL; 

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const adminAccessToken = localStorage.getItem("admin_access_token");
    if (adminAccessToken) {
      try {
        const decodedToken = jwtDecode(adminAccessToken);
        const expiryTime = decodedToken.exp * 1000;
        if (new Date().getTime() < expiryTime) {
          navigate("/admindashboard");
        } else {
          localStorage.removeItem("admin_access_token");
        }
      } catch (error) {
        localStorage.removeItem("admin_access_token");
      }
    }
  }, [navigate]);

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setSnackbar((prev) => ({ ...prev, open: false }));

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/admin/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, error: loginError, message } = response.data;

      if (token) {
        localStorage.setItem("admin_access_token", token);
        if (loginError === "Email is not verified.") {
          showSnackbar(
            "Your email is not verified. Check your inbox.",
            "warning"
          );
          localStorage.removeItem("admin_access_token");
          navigate("/verifyemail");
          return;
        }
        showSnackbar("Login successful!", "success");
        setTimeout(() => navigate("/admindashboard"), 800);
      } else {
        showSnackbar(message || "Login failed!", "error");
        setPassword("");
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            showSnackbar("User not found. Please check your email.", "error");
            break;
          case 401:
            showSnackbar("Invalid email or password.", "error");
            break;
          case 400:
            if (error.response.data.error === "Email is not verified.") {
              showSnackbar(
                "Your email is not verified. Check your inbox.",
                "warning"
              );
              navigate("/verifyemail");
            } else {
              showSnackbar(
                error.response.data.message || "Login failed.",
                "error"
              );
            }
            break;
          default:
            showSnackbar("Unexpected error occurred. Try again.", "error");
        }
      } else if (error.request) {
        showSnackbar("Server is unreachable. Check your internet.", "error");
      } else {
        showSnackbar("An unexpected error occurred.", "error");
      }
    }
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
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
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminLogin;

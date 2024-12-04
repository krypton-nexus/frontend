import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaRss,
  FaCalendarAlt,
  FaComment,
  FaListAlt,
  FaSignOutAlt,
  FaRegBell,
} from "react-icons/fa";
import logo1short from "../Images/logo1short.png";
import "../CSS/SideBar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Step 1: Remove token and any client-side session data
    localStorage.removeItem("access_token");
    sessionStorage.clear(); // Clear session storage if used

    // Step 2: Make an API call to the server to invalidate the session
    try {
      const response = await fetch("http://13.232.48.203:5000/student/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials if needed for cookie-based sessions
      });

      if (response.ok) {
        // Step 3: Redirect to the home page after successful logout
        navigate("/home", { replace: true });
      } else {
        console.error("Logout failed:", response.status);
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout. Please try again.");
    }
  };

  return (
    <aside className="sidebar">
      <Link to="/home">
        <img src={logo1short} alt="Nexus Club Platform Logo" className="logo" />
      </Link>
      <ul className="menu">
        <li className={location.pathname === "/viewclubs" ? "active" : ""}>
          <Link to="/viewclubs">
            <FaUsers /> View Clubs
          </Link>
        </li>
        <li className={location.pathname === "/view-feed" ? "active" : ""}>
          <Link to="/view-feed">
            <FaRss /> View Feed
          </Link>
        </li>
        <li className={location.pathname === "/view-events" ? "active" : ""}>
          <Link to="/view-events">
            <FaCalendarAlt /> View Events
          </Link>
        </li>
        <li className={location.pathname === "/communication" ? "active" : ""}>
          <Link to="/communication">
            <FaComment /> Communication
          </Link>
        </li>
        <li className={location.pathname === "/merchandise" ? "active" : ""}>
          <Link to="/merchandise">
            <FaListAlt /> Purchase Merchandise
          </Link>
        </li>
        <li className={location.pathname === "/notifications" ? "active" : ""}>
          <Link to="/notifications" className="notifications">
            <FaRegBell />
            Notification
          </Link>
        </li>
      </ul>
      <button className="logout" onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;
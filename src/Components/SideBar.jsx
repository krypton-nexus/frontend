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

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    sessionStorage.clear();
    navigate("/home", { replace: true });
  };

  const menuItems = [
    { path: "/viewclubs", label: "View Clubs", icon: <FaUsers /> },
    { path: "/view-feed", label: "View Feed", icon: <FaRss /> },
    { path: "/viewevents", label: "View Events", icon: <FaCalendarAlt /> },
    { path: "/communication", label: "Communication", icon: <FaComment /> },
    { path: "/merchandise", label: "Merchandise", icon: <FaListAlt /> },
    { path: "/notifications", label: "Notification", icon: <FaRegBell /> },
  ];

  return (
    <aside className="sidebar">
      <Link to="/home">
        <img src={logo1short} alt="Nexus Club Platform Logo" className="logo" />
      </Link>

      <ul className="menu">
        {menuItems.map(({ path, label, icon }) => (
          <li
            key={label}
            className={location.pathname === path ? "active" : ""}
          >
            <Link to={path}>
              {icon} {label}
            </Link>
          </li>
        ))}
      </ul>

      <button className="logout" onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;

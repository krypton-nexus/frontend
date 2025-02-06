import React, { useState } from "react";
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
import CommunicationChannel from "./CommunicationChannel"; // Import the modal

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // Popup state

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    sessionStorage.clear();
    navigate("/home", { replace: true });
  };

  const menuItems = [
    { path: "/viewclubs", label: "View Clubs", icon: <FaUsers /> },
    { path: "/view-feed", label: "View Feed", icon: <FaRss /> },
    { path: "/viewevents", label: "View Events", icon: <FaCalendarAlt /> },
    {
      path: "#",
      label: "Communication",
      icon: <FaComment />,
      action: () => setIsModalOpen(true),
    }, // Open Modal
    {
      path: "/merchandise",
      label: "Purchase Merchandise",
      icon: <FaListAlt />,
    },
    { path: "/notifications", label: "Notification", icon: <FaRegBell /> },
  ];

  return (
    <>
      <aside className="sidebar">
        <Link to="/home">
          <img
            src={logo1short}
            alt="Nexus Club Platform Logo"
            className="logo"
          />
        </Link>
        <ul className="menu">
          {menuItems.map(({ path, label, icon, action }) => (
            <li
              key={label}
              className={location.pathname === path ? "active" : ""}
              onClick={action ? action : null} // Calls the function if action exists
            >
              <Link to={path} className={action ? "no-link" : ""}>
                {icon} {label}
              </Link>
            </li>
          ))}
        </ul>
        <button className="logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Communication Modal */}
      {isModalOpen && (
        <CommunicationChannel
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaTasks,
  FaRss,
  FaWallet,
  FaStore,
  FaListAlt,
  FaRegBell,
  FaSignOutAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import logo1short from "../Images/logo1short.png";
import "../CSS/SideBar.css";
import CommunicationChannel from "./CommunicationChannel";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    sessionStorage.clear();
    navigate("/home", { replace: true });
  };

  const menuItems = [
    { path: "/admindashboard", label: "Membership", icon: <FaUsers /> },
    { path: "/adminevent", label: "Events", icon: <FaCalendarAlt /> },
    { path: "/addtask", label: "Tasks", icon: <FaTasks /> },
    { path: "/feed", label: "Feed", icon: <FaRss /> },
    { path: "/finance", label: "Finance", icon: <FaWallet /> },
    // {
    //   path: "/communication",
    //   label: "Communication",
    //   icon: <FaComment />,
    //   action: () => setIsModalOpen(true),
    // },
    {
      path: "/merchandise",
      label: "Merchandise",
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
      {/* {isModalOpen && (
        <CommunicationChannel
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )} */}
    </>
  );
};

export default AdminSidebar;

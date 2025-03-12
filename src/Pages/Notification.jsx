import React from "react";
import { Link } from "react-router-dom";
import "../CSS/Notification.css";
import logo1short from "../Images/logo1short.png";
import {
  FaUsers,
  FaRegBell,
  FaSignOutAlt,
  FaRss,
  FaCalendarAlt,
  FaComment,
  FaListAlt,
} from "react-icons/fa";

const Notification = () => {
  const notifications = [
    {
      id: 1,
      message:
        "You have received a join request for Gavel Club. Accept or Decline?",
      time: "2 days ago",
      type: "action",
      read: false,
    },
    {
      id: 2,
      message:
        "Gavel Club posted: 'Meeting on Public Speaking at 5 PM tomorrow.'",
      time: "3 days ago",
      type: "post",
      read: false,
    },
    {
      id: 3,
      message:
        "Software Engineering Student Association: New event 'Hackathon 2025' is open for registration!",
      time: "1 week ago",
      type: "event",
      read: true,
    },
    {
      id: 4,
      message:
        "Club Management System: Your membership for the Drama Club has been approved.",
      time: "2 weeks ago",
      type: "membership",
      read: true,
    },
    {
      id: 5,
      message:
        "University of Kelaniya: Annual Career Fair is scheduled for next month.",
      time: "1 month ago",
      type: "announcement",
      read: true,
    },
  ];

  return (
    <div className="view-clubs-container">
      <aside className="sidebar">
        <Link to="/home">
          <img src={logo1short} alt="Nexus Logo" className="logo" />
        </Link>
        <ul className="menu">
          <li>
            <FaUsers /> View Clubs
          </li>
          <li>
            <FaRss /> View Feed
          </li>
          <li>
            <FaCalendarAlt /> View Events
          </li>
          <li>
            <FaComment /> Communication
          </li>
          <li>
            <FaListAlt /> Purchase Merchandise
          </li>
          <li className="active">
            <div className="notifications">
              <FaRegBell />
              Notification
            </div>
          </li>
        </ul>
        <button className="logout">
          <FaSignOutAlt /> Logout
        </button>
      </aside>
      <main className="main-content">
        <div className="notifications-container">
          <h2>Notifications</h2>
          {notifications.map((notification) => (
            <div
              className={`notification-card ${
                !notification.read ? "unread" : ""
              }`}
              key={notification.id}>
              <p>{notification.message}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Notification;

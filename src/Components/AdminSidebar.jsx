import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FaUsers,
  FaCalendarAlt,
  FaTasks,
  FaRss,
  FaWallet,
  FaStore,
  FaListAlt,
  FaRegBell,
  FaSignOutAlt,
} from "react-icons/fa";
import logo1short from "../Images/logo1short.png";
import "../CSS/SideBar.css";

const baseURL = "http://43.205.202.255:5000";

// NotificationPopup sub-component
const NotificationPopup = ({
  notifications,
  filter,
  setFilter,
  markAllAsRead,
  onClose,
}) => {
  // Sort notifications (most recent first) and format date
  const sortedNotifications = notifications
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((notif) => ({
      ...notif,
      formattedDate: new Date(notif.created_at).toLocaleString(),
    }));

  return (
    <div
      className="notification-popup"
      style={{
        position: "fixed",
        top: "60px", // Adjusted top value
        left: "250px", // Adjusted left value
        zIndex: 99999, // High z-index to appear on top
        backgroundColor: "#fff",
        color: "#000",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
        width: "320px",
        padding: "10px",
        borderRadius: "5px",
      }}>
      <div
        className="notification-dropdown-header"
        style={{
          marginBottom: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <button
          onClick={markAllAsRead}
          style={{
            background: "#1a1a1a",
            color: "#fff",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "3px",
          }}>
          Mark All as Read
        </button>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
          }}>
          &times;
        </button>
      </div>
      {sortedNotifications.length > 0 ? (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {sortedNotifications.map((notif) => (
            <li
              key={notif.id}
              style={{
                fontWeight: notif.is_read ? "normal" : "bold",
                borderBottom: "1px solid #ccc",
                padding: "5px 0",
              }}>
              <div>{notif.notification}</div>
              <div style={{ fontSize: "0.8em", color: "#666" }}>
                {notif.formattedDate}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>No notifications available.</div>
      )}
      <div
        className="notification-filters"
        style={{ marginTop: "10px", textAlign: "center" }}>
        <button onClick={() => setFilter("all")} style={{ margin: "0 5px" }}>
          All
        </button>
        <button onClick={() => setFilter("unread")} style={{ margin: "0 5px" }}>
          Unread
        </button>
        <button onClick={() => setFilter("read")} style={{ margin: "0 5px" }}>
          Read
        </button>
      </div>
    </div>
  );
};

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const adminAccessToken = localStorage.getItem("admin_access_token");
  const adminEmail = adminAccessToken
    ? jwtDecode(adminAccessToken).email
    : null;

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [filter, setFilter] = useState("all");

  // Helper GET function
  const apiGet = async (endpoint) => {
    const res = await fetch(`${baseURL}${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${adminAccessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`GET ${endpoint} failed with status: ${res.status}`);
    }
    return await res.json();
  };

  useEffect(() => {
    if (!adminEmail) return;
    const fetchNotifications = async () => {
      try {
        const countData = await apiGet(
          `/notification_admin/unread/count?admin_email=${adminEmail}`
        );
        setUnreadCount(countData.unread_count || 0);
        const allData = await apiGet(
          `/notification_admin/all?admin_email=${adminEmail}`
        );
        setNotifications(allData.all_notifications || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();
  }, [adminEmail, adminAccessToken]);

  useEffect(() => {
    const count = notifications.filter((n) => n.is_read === 0).length;
    setUnreadCount(count);
  }, [notifications]);

  const toggleNotificationsDropdown = () => {
    setShowNotifications((prev) => !prev);
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter((n) => n.is_read === 0)
        .map((n) => n.id);
      if (unreadIds.length === 0) return;
      const res = await fetch(`${baseURL}/notification_admin/mark-as-read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          admin_email: adminEmail,
          notification_ids: unreadIds,
        }),
      });
      if (!res.ok) {
        throw new Error(
          `Failed to mark notifications as read, status: ${res.status}`
        );
      }
      const updatedNotifications = notifications.map((n) => ({
        ...n,
        is_read: 1,
      }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_access_token");
    sessionStorage.clear();
    navigate("/home", { replace: true });
  };

  const menuItems = [
    { path: "/admindashboard", label: "Membership", icon: <FaUsers /> },
    { path: "/adminevent", label: "Events", icon: <FaCalendarAlt /> },
    { path: "/addtask", label: "Tasks", icon: <FaTasks /> },
    { path: "/feed", label: "Feed", icon: <FaRss /> },
    { path: "/finance", label: "Finance", icon: <FaWallet /> },
    { path: "/merchandise", label: "Merchandise", icon: <FaListAlt /> },
  ];

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return n.is_read === 0;
    if (filter === "read") return n.is_read === 1;
    return true;
  });

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
          {menuItems.map(({ path, label, icon }) => (
            <li
              key={label}
              className={location.pathname === path ? "active" : ""}>
              <Link to={path}>
                {icon} {label}
              </Link>
            </li>
          ))}
          <li>
            <div
              className="notifications"
              onClick={toggleNotificationsDropdown}
              style={{ cursor: "pointer" }}>
              <FaRegBell /> Notification{" "}
              <span className="badge">{unreadCount}</span>
            </div>
          </li>
        </ul>
        <button className="logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {showNotifications && (
        <NotificationPopup
          notifications={filteredNotifications}
          filter={filter}
          setFilter={setFilter}
          markAllAsRead={markAllAsRead}
          onClose={toggleNotificationsDropdown}
        />
      )}
    </>
  );
};

export default AdminSidebar;

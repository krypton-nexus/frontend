import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FaUsers,
  FaCalendarAlt,
  FaTasks,
  FaRss,
  FaWallet,
  FaListAlt,
  FaRegBell,
  FaSignOutAlt,
} from "react-icons/fa";
import logo1short from "../Images/logo1short.png";
import "../CSS/SideBar.css";
import { Skeleton } from "@mui/material";
import NotificationPopup from "./NotificationPopup";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const adminAccessToken = localStorage.getItem("admin_access_token");
  const adminEmail = adminAccessToken
    ? jwtDecode(adminAccessToken).email
    : null;

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [filter, setFilter] = useState("all");
  const [notifLoading, setNotifLoading] = useState(false);
  const popupPositionStyle = {
    position: "fixed",
    top: "40px",
    left: "220px",
    zIndex: 99999,
    backgroundColor: "#fff",
    color: "#000",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
    width: "400px",
    height: "450px",
    padding: "10px",
    borderRadius: "5px",
  };
  // Helper GET function
  const apiGet = async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
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

  const fetchNotificationsOnBell = async () => {
    if (showNotifications || notifLoading) return;
    setShowNotifications(true);
    setNotifLoading(true);
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
    setNotifLoading(false);
  };

  useEffect(() => {
    const count = notifications.filter((n) => n.is_read === 0).length;
    setUnreadCount(count);
  }, [notifications]);

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter((n) => n.is_read === 0)
        .map((n) => n.id);
      if (unreadIds.length === 0) return;
      const res = await fetch(`${BASE_URL}/notification_admin/mark-as-read`, {
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
    navigate("/admin", { replace: true });
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
    setFilter("all");
  };

  const NotificationPopupSkeleton = () => (
    <div style={popupPositionStyle}>
      <Skeleton
        variant="text"
        width={120}
        height={28}
        style={{ marginBottom: 10 }}
      />
      {[...Array(5)].map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          width="100%"
          height={38}
          style={{ marginBottom: 8, borderRadius: 5 }}
        />
      ))}
    </div>
  );

  const menuItems = [
    { path: "/admindashboard", label: "Membership", icon: <FaUsers /> },
    { path: "/adminevent", label: "Events", icon: <FaCalendarAlt /> },
    { path: "/task", label: "Tasks", icon: <FaTasks /> },
    { path: "/feed", label: "Feed", icon: <FaRss /> },
    { path: "/finance", label: "Finance", icon: <FaWallet /> },
    { path: "/adminmarketplace", label: "Merchandise", icon: <FaListAlt /> },
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
              className={location.pathname === path ? "active" : ""}
            >
              <Link to={path}>
                {icon} {label}
              </Link>
            </li>
          ))}
          <li className={showNotifications ? "active" : ""}>
            <div
              className="notifications"
              onClick={fetchNotificationsOnBell}
              style={{ cursor: "pointer" }}
              aria-label="Open notifications"
            >
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
        <>
          {/* Overlay to catch outside clicks */}
          <div
            onClick={handleCloseNotifications}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 99998,
              // backgroundColor: "transparent",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // dark transparent
              zIndex: 999,
            }}
          />
          {notifLoading ? (
            <NotificationPopupSkeleton />
          ) : (
            <NotificationPopup
              notifications={filteredNotifications}
              filter={filter}
              setFilter={setFilter}
              markAllAsRead={markAllAsRead}
              onClose={handleCloseNotifications}
            />
          )}
        </>
      )}
    </>
  );
};

export default AdminSidebar;

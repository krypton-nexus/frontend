import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaRegBell,
  FaSignOutAlt,
  FaRss,
  FaCalendarAlt,
  FaComment,
  FaListAlt,
  FaCheck,
  FaTimes,
  FaEye,
  FaTrash,
} from "react-icons/fa";
import Sidebar from "../Components/SideBar"; // Use your Sidebar component
import "../CSS/Notification.css";
import { color } from "@mui/system";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest

  // Mock API functions - replace with your API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Your API call here...
      const mockData = [
        {
          id: 1,
          message:
            "You have received a join request for Gavel Club. Accept or Decline?",
          time: "2024-06-02T10:30:00Z",
          type: "action",
          read: false,
          actionRequired: true,
          clubId: "gavel-club",
        },
        {
          id: 2,
          message:
            "Gavel Club posted: 'Meeting on Public Speaking at 5 PM tomorrow.",
          time: "2024-06-01T15:45:00Z",
          type: "post",
          read: false,
          actionRequired: false,
          clubId: "gavel-club",
        },
        {
          id: 3,
          message:
            "Software Engineering Student Association: New event 'Hackathon 2025' is open for registration!",
          time: "2024-05-28T09:20:00Z",
          type: "event",
          read: true,
          actionRequired: false,
          clubId: "sesa",
        },
        {
          id: 4,
          message:
            "Club Management System: Your membership for the Drama Club has been approved.",
          time: "2024-05-21T14:15:00Z",
          type: "membership",
          read: true,
          actionRequired: false,
          clubId: "drama-club",
        },
        {
          id: 5,
          message:
            "University of Kelaniya: Annual Career Fair is scheduled for next month.",
          time: "2024-05-04T11:00:00Z",
          type: "announcement",
          read: true,
          actionRequired: false,
          clubId: null,
        },
      ];

      setNotifications(mockData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch notifications");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    // Replace with API call
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAsUnread = async (notificationId) => {
    // Replace with API call
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: false } : n))
    );
  };

  const deleteNotification = async (notificationId) => {
    // Replace with API call
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const handleJoinRequestAction = async (notificationId, action) => {
    // Replace with API call
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    alert(`Join request ${action}ed successfully!`);
  };

  const markAllAsRead = async () => {
    // Replace with API call
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2419200)
      return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    return `${Math.floor(diffInSeconds / 2419200)} months ago`;
  };

  const getFilteredAndSortedNotifications = () => {
    let filtered = notifications;

    if (filter === "unread") {
      filtered = notifications.filter((n) => !n.read);
    } else if (filter === "read") {
      filtered = notifications.filter((n) => n.read);
    }

    return filtered.sort((a, b) => {
      const timeA = new Date(a.time);
      const timeB = new Date(b.time);
      return sortBy === "newest" ? timeB - timeA : timeA - timeB;
    });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications = getFilteredAndSortedNotifications();

  if (loading) {
    return (
      <div className="view-clubs-container">
        <Sidebar />
        <main className="main-content">
          <div className="notifications-container">
            <h2>Loading Notifications...</h2>
            <div className="loading-spinner">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-clubs-container">
        <Sidebar />
        <main className="main-content">
          <div className="notifications-container">
            <h2>Error Loading Notifications</h2>
            <p>{error}</p>
            <button onClick={fetchNotifications} className="retry-btn">
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="view-clubs-container">
      <Sidebar />
      <main className="main-content">
        <div className="notifications-container">
          <div className="notifications-header">
            <div className="notification_title">
              <h2 style={{ color: "black" }}>Notifications</h2>
            </div>
            <div className="notifications-actions">
              <div className="filter-controls">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="filter-select">
                  <option value="all">All ({notifications.length})</option>
                  <option value="unread">Unread ({unreadCount})</option>
                  <option value="read">
                    Read ({notifications.length - unreadCount})
                  </option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="mark-all-read-btn">
                  Mark All as Read
                </button>
              )}
            </div>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="no-notifications">
              <FaRegBell className="empty-icon" />
              <p>No notifications found</p>
              <p className="empty-subtitle">
                {filter === "unread"
                  ? "All caught up!"
                  : "You don't have any notifications yet."}
              </p>
            </div>
          ) : (
            <div className="notifications-list">
              {filteredNotifications.map((notification) => (
                <div
                  className={`notification-card ${
                    !notification.read ? "unread" : ""
                  } ${notification.type}`}
                  key={notification.id}>
                  <div className="notification-content">
                    <div className="notification-type-indicator">
                      {notification.type === "action" && <FaUsers />}
                      {notification.type === "post" && <FaRss />}
                      {notification.type === "event" && <FaCalendarAlt />}
                      {notification.type === "membership" && <FaCheck />}
                      {notification.type === "announcement" && <FaRegBell />}
                    </div>
                    <div className="notification-body">
                      <p className="notification-message">
                        {notification.message}
                      </p>
                      <span className="notification-time">
                        {formatTime(notification.time)}
                      </span>
                    </div>
                  </div>

                  <div className="notification-actions">
                    {notification.actionRequired &&
                      notification.type === "action" && (
                        <div className="action-buttons">
                          <button
                            onClick={() =>
                              handleJoinRequestAction(notification.id, "accept")
                            }
                            className="notification-accept-btn"
                            title="Accept">
                            <FaCheck />
                          </button>
                          <button
                            onClick={() =>
                              handleJoinRequestAction(
                                notification.id,
                                "decline"
                              )
                            }
                            className="decline-btn"
                            title="Decline">
                            <FaTimes />
                          </button>
                        </div>
                      )}

                    <div className="notification-controls">
                      {notification.read ? (
                        <button
                          onClick={() => markAsUnread(notification.id)}
                          className="mark-unread-btn"
                          title="Mark as unread">
                          <FaEye />
                        </button>
                      ) : (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="mark-read-btn"
                          title="Mark as read">
                          <FaEye />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="notification-delete-btn"
                        title="Delete notification">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Notification;

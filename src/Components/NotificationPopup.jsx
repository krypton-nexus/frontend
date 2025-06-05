import React from "react";
import PropTypes from "prop-types";

const NotificationPopup = ({
  notifications,
  filter,
  setFilter,
  markAllAsRead,
  onClose,
}) => {
  // Sort and format
  const sortedNotifications = notifications
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((notif) => ({
      ...notif,
      formattedDate: new Date(notif.created_at).toLocaleString(),
    }));

  const popupPositionStyle = {
    position: "fixed",
    top: "100px",
    left: "500px",
    // alignItems: "center",
    zIndex: 99999,
    backgroundColor: "#fff",
    color: "#000",
    boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
    width: "400px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    maxHeight: "450px",
    minHeight: "200px",
  };

  const headerStyle = {
    padding: "12px 16px 8px 16px",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
  };

  const filterButtonStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 16px",
    borderBottom: "1px solid #eee",
    background: "#fff",
  };

  const listScrollStyle = {
    flex: "1 1 auto",
    overflowY: "auto",
    padding: "6px 16px",
    minHeight: "60px",
  };

  return (
    <>
      {/* Overlay: clicking outside closes the popup */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99998,
          backgroundColor: "transparent",
        }}
      />

      {/* Popup */}
      <div
        className="notification-popup"
        style={popupPositionStyle}
        onClick={(e) => e.stopPropagation()}>
        {/* HEADER - Always visible */}
        <div style={headerStyle}>
          <span style={{ fontWeight: 600, fontSize: 16 }}>Notifications</span>
          <button
            onClick={onClose}
            style={{
              // background: "transparent",
              background: "none",
              border: "none",
              color: "red",
              fontSize: "28px",
              fontWeight: "200",
              cursor: "pointer",
            }}
            aria-label="Close notifications">
            &times;
          </button>
        </div>

        {/* BUTTONS */}
        <div style={filterButtonStyle}>
          <button
            onClick={markAllAsRead}
            style={{
              background: "#222",
              color: "#fff",
              border: "none",
              padding: "4px 12px",
              cursor: "pointer",
              borderRadius: "3px",
              fontSize: "14px",
            }}>
            Mark All as Read
          </button>
          <div>
            <button
              onClick={() => setFilter("all")}
              style={{
                margin: "0 2px",
                background: filter === "all" ? "#eee" : "transparent",
                border: "none",
                borderRadius: 4,
                padding: "2px 8px",
                color: "#000",
                cursor: "pointer",
              }}>
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              style={{
                margin: "0 2px",
                background: filter === "unread" ? "#eee" : "transparent",
                border: "none",
                borderRadius: 4,
                padding: "2px 8px",
                cursor: "pointer",
              }}>
              Unread
            </button>
            <button
              onClick={() => setFilter("read")}
              style={{
                margin: "0 2px",
                background: filter === "read" ? "#eee" : "transparent",
                border: "none",
                borderRadius: 4,
                padding: "2px 8px",
                cursor: "pointer",
              }}>
              Read
            </button>
          </div>
        </div>

        {/* SCROLLABLE LIST */}
        <div style={listScrollStyle}>
          {sortedNotifications.length > 0 ? (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {sortedNotifications.map((notif) => (
                <li
                  key={notif.id}
                  style={{
                    fontWeight: notif.is_read ? "normal" : "bold",
                    padding: "10px 0 10px 0",
                    borderBottom: "1px solid #f2f2f2",
                  }}>
                  <div>{notif.notification}</div>
                  <div style={{ fontSize: "0.8em", color: "#666" }}>
                    {notif.formattedDate}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ color: "#666", padding: "16px 0" }}>
              No notifications available.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

NotificationPopup.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      notification: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      is_read: PropTypes.number.isRequired,
    })
  ).isRequired,
  filter: PropTypes.oneOf(["all", "unread", "read"]).isRequired,
  setFilter: PropTypes.func.isRequired,
  markAllAsRead: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NotificationPopup;

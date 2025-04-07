import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import AdminSidebar from "../Components/AdminSidebar";
import "../CSS/AdminDashboard.css";
import "../CSS/SideBar.css";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { Ban } from "lucide-react";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const apiGet = async (endpoint, token) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!res.ok)
    throw new Error(`GET ${endpoint} failed with status: ${res.status}`);
  return res.json();
};

const apiPut = async (endpoint, token, body) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok)
    throw new Error(`PUT ${endpoint} failed with status: ${res.status}`);
  return res.json();
};

const apiPatch = async (endpoint, token, body) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok)
    throw new Error(`PATCH ${endpoint} failed with status: ${res.status}`);
  return res.json();
};

const apiDelete = async (endpoint, token, body) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let errorDetails = "";
    try {
      errorDetails = await res.text();
    } catch {
      errorDetails = "No additional error info";
    }
    throw new Error(
      `DELETE ${endpoint} failed with status: ${res.status}. Details: ${errorDetails}`
    );
  }
  return res.json();
};

// ------------------ NotificationPopup with Overlay ------------------
const NotificationPopup = ({
  notifications,
  filter,
  setFilter,
  markAllAsRead,
  onClose,
}) => {
  const sortedNotifications = notifications
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((notif) => ({
      ...notif,
      formattedDate: new Date(notif.created_at).toLocaleString(),
    }));

  return (
    <>
      {/* Overlay: clicking outside triggers onClose */}
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
      <div
        className="notification-popup"
        style={{
          position: "fixed",
          top: "60px",
          left: "250px",
          zIndex: 99999,
          backgroundColor: "#fff",
          color: "#000",
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          width: "320px",
          padding: "10px",
          borderRadius: "5px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="notification-dropdown-header"
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={markAllAsRead}
            style={{
              background: "#1a1a1a",
              color: "#fff",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius: "3px",
            }}
          >
            Mark All as Read
          </button>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
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
                }}
              >
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
          style={{ marginTop: "10px", textAlign: "center" }}
        >
          <button onClick={() => setFilter("all")} style={{ margin: "0 5px" }}>
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            style={{ margin: "0 5px" }}
          >
            Unread
          </button>
          <button onClick={() => setFilter("read")} style={{ margin: "0 5px" }}>
            Read
          </button>
        </div>
      </div>
    </>
  );
};

// ------------------ UserDetailModal Component ------------------
const UserDetailModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
        <h2 className="modal-title">Member Details</h2>
        <div className="user-info">
          <div className="info-item">
            <strong>First Name:</strong> <span>{user.first_name || "N/A"}</span>
          </div>
          <div className="info-item">
            <strong>Last Name:</strong> <span>{user.last_name || "N/A"}</span>
          </div>
          <div className="info-item">
            <strong>Email:</strong> <span>{user.email || "N/A"}</span>
          </div>
          <div className="info-item">
            <strong>Phone Number:</strong>{" "}
            <span>{user.phone_number || "N/A"}</span>
          </div>
          <div className="info-item">
            <strong>Date of Birth:</strong>{" "}
            <span>
              {user.dob
                ? new Date(user.dob).toLocaleDateString("en-US", {
                    timeZone: "Asia/Colombo",
                    dateStyle: "long",
                  })
                : "N/A"}
            </span>
          </div>
          <div className="info-item">
            <strong>Student Number:</strong>{" "}
            <span>{user.student_number || "N/A"}</span>
          </div>
          <div className="info-item">
            <strong>Year:</strong> <span>{user.year || "N/A"}</span>
          </div>
          <div className="info-item">
            <strong>Course Name:</strong>{" "}
            <span>{user.course_name || "N/A"}</span>
          </div>
          <div className="info-item">
            <strong>Department:</strong> <span>{user.department || "N/A"}</span>
          </div>
          <div className="info-item">
            <strong>Faculty:</strong> <span>{user.faculty || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------ MembershipTable Component ------------------
const MembershipTable = ({
  title,
  data,
  isCurrentMembers,
  onViewDetails,
  onStatusChange,
  onMemberDeletion,
}) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div>
        <div className="membership-header">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search members..."
              className="membership-search"
            />
            <button className="search-icon">
              <FaSearch />
            </button>
          </div>
          <FaUserCircle className="membership-avatar" size={30} />
        </div>
        <hr className="section-divider" />
        <div className="no-membership-request">
          <h2>
            <span className="ban-icon">
              <Ban size={18} className="text-red-400" />
            </span>
            No {title.toLowerCase()} available.
          </h2>
        </div>
      </div>
    );
  }

  const yearCounts = data.reduce((acc, member) => {
    const year = member.year || "Unknown";
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  const total = Object.values(yearCounts).reduce(
    (sum, count) => sum + count,
    0
  );
  const colors = ["#a91d3a", "#007bff", "#28a745", "#ffc107", "#6610f2"];
  const getColor = (index) => colors[index % colors.length];

  return (
    <div className="membership-table-container">
      <div className="year-analysis">
        <h2>Year-wise Analysis</h2>
        <ul>
          {Object.entries(yearCounts).map(([year, count]) => (
            <li key={year}>
              Year {year}: {count} student{count > 1 ? "s" : ""}
            </li>
          ))}
        </ul>
      </div>
      <br />
      <h2>{title}</h2>
      <table className="membership-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Last Name</th>
            <th>Course Name</th>
            <th>Year</th>
            <th>Faculty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((member) => (
            <tr key={member.student_email}>
              <td>{member.firstName}</td>
              <td>{member.lastName}</td>
              <td>{member.courseName}</td>
              <td>{member.year}</td>
              <td>{member.faculty}</td>
              <td>
                {isCurrentMembers ? (
                  <>
                    <button
                      className="view-btn"
                      onClick={() => onViewDetails(member.student_email)}
                    >
                      View
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => onMemberDeletion(member.student_email)}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="view-btn"
                      onClick={() => onViewDetails(member.student_email)}
                    >
                      View
                    </button>
                    <button
                      className="accept-btn"
                      onClick={() =>
                        onStatusChange("Approved", member.student_email)
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() =>
                        onStatusChange("rejected", member.student_email)
                      }
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ------------------ Main AdminDashboard Component ------------------
const AdminDashboard = () => {
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [newMembershipRequests, setNewMembershipRequests] = useState([]);
  const [currentMembers, setCurrentMembers] = useState([]);
  const [clubId, setClubId] = useState(null);
  const [notificationFilter, setNotificationFilter] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUserData, setModalUserData] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("today");

  const navigate = useNavigate();
  const adminAccessToken = localStorage.getItem("admin_access_token");

  const getAdminEmailFromToken = useCallback((token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.email;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  }, []);

  const adminEmail = adminAccessToken
    ? getAdminEmailFromToken(adminAccessToken)
    : null;

  useEffect(() => {
    if (!adminEmail) navigate("/admin");
  }, [adminEmail, navigate]);

  // ------------------ Notification Fetching Functions ------------------
  const fetchAdminDetails = async () => {
    try {
      const data = await apiGet(
        `/admin/email?email=${adminEmail}`,
        adminAccessToken
      );
      setClubId(data.club_id);
    } catch (error) {
      console.error("Failed to fetch admin's club ID:", error);
    }
  };

  const fetchUnreadNotifications = async () => {
    try {
      const endpoint = `/notification_admin/unread?admin_email=${adminEmail}`;
      const data = await apiGet(endpoint, adminAccessToken);
      setUnreadNotifications(data.unread_notifications || []);
    } catch (error) {
      console.error("Failed to fetch unread notifications:", error);
    }
  };

  const fetchUnreadNotificationCount = async () => {
    try {
      const endpoint = `/notification_admin/unread/count?admin_email=${adminEmail}`;
      const data = await apiGet(endpoint, adminAccessToken);
      setUnreadCount(data.unread_count || 0);
    } catch (error) {
      console.error("Failed to fetch unread notification count:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await apiGet(
        `/notification_admin/all?admin_email=${adminEmail}`,
        adminAccessToken
      );
      setAllNotifications(data.all_notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  // ------------------ Membership Data Fetching ------------------
  const fetchMembershipData = async () => {
    if (!clubId) return;
    try {
      const membershipPromise = apiGet(
        `/membership/list?club_id=${clubId}`,
        adminAccessToken
      );
      const studentPromise = apiGet("/student/list", adminAccessToken);
      const [membershipData, studentData] = await Promise.all([
        membershipPromise,
        studentPromise,
      ]);
      const memberships = membershipData.memberships || [];
      const allStudents = studentData.students || [];
      const emailToStudentDataMap = allStudents.reduce((acc, student) => {
        acc[student.email] = {
          firstName: student.first_name,
          lastName: student.last_name,
          courseName: student.course_name,
          year: student.year,
          faculty: student.faculty,
        };
        return acc;
      }, {});
      const enrichedMemberships = memberships.map((member) => ({
        ...member,
        firstName:
          emailToStudentDataMap[member.student_email]?.firstName || "Unknown",
        lastName:
          emailToStudentDataMap[member.student_email]?.lastName || "Unknown",
        courseName:
          emailToStudentDataMap[member.student_email]?.courseName || "Unknown",
        year: emailToStudentDataMap[member.student_email]?.year || "Unknown",
        faculty:
          emailToStudentDataMap[member.student_email]?.faculty || "Unknown",
      }));
      setNewMembershipRequests(
        enrichedMemberships.filter((m) => m.status === "Pending")
      );
      setCurrentMembers(
        enrichedMemberships.filter((m) => m.status === "Approved")
      );
    } catch (error) {
      console.error("Failed to fetch membership data:", error);
    }
  };

  // ------------------ Initial Data Fetching ------------------
  useEffect(() => {
    if (!adminEmail) return;
    fetchAdminDetails();
    fetchUnreadNotifications();
    fetchUnreadNotificationCount();
    fetchNotifications();
  }, [adminEmail, adminAccessToken]);

  useEffect(() => {
    if (clubId) {
      fetchMembershipData();
    }
  }, [clubId, adminAccessToken]);

  useEffect(() => {
    const filtered =
      notificationFilter === "all"
        ? allNotifications
        : allNotifications.filter((notif) =>
            notificationFilter === "unread"
              ? notif.is_read === 0
              : notif.is_read === 1
          );
    setFilteredNotifications(filtered);
  }, [notificationFilter, allNotifications]);

  // ------------------ Handlers for Membership Actions ------------------
  const handleLogout = () => {
    localStorage.removeItem("admin_access_token");
    sessionStorage.clear();
    navigate("/home", { replace: true });
    toast.success("You have logged out successfully.");
  };

  const handleViewDetails = async (email) => {
    try {
      const data = await apiGet(`/student/${email}`, adminAccessToken);
      setModalUserData(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      toast.error("Failed to load user details.");
    }
  };

  const handleMembershipStatus = async (action, email) => {
    try {
      const requestBody = {
        student_email: email,
        club_id: clubId,
        status: action,
      };
      const data = await apiPut(
        `/membership/update/status`,
        adminAccessToken,
        requestBody
      );
      if (data) {
        toast.success(
          `${
            action === "Approved" ? "Approved" : "Rejected"
          } membership request for ${email}.`
        );
        setNewMembershipRequests((prev) =>
          prev.filter((member) => member.student_email !== email)
        );
        if (action === "Approved") {
          const approvedMember = newMembershipRequests.find(
            (member) => member.student_email === email
          );
          setCurrentMembers((prev) => [...prev, approvedMember]);
        }
      }
    } catch (error) {
      console.error("Failed to update membership status:", error);
      toast.error("Failed to update membership status.");
    }
  };

  const handleMemberDeletion = async (email) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      const requestBody = { student_id: email, club_id: clubId };
      await apiDelete(`/membership/delete`, adminAccessToken, requestBody);
      toast.success(`Member ${email} has been removed from the club.`);
      fetchMembershipData(); // Refresh membership data after deletion
    } catch (error) {
      console.error("Failed to delete member:", error);
      toast.error("Failed to delete member.");
    }
  };

  // ------------------ Notification Popup Handlers ------------------
  const openNotifications = () => setIsNotificationsVisible(true);
  const closeNotifications = () => setIsNotificationsVisible(false);

  const markAllAsRead = async () => {
    try {
      const unreadIds = allNotifications
        .filter((n) => n.is_read === 0)
        .map((n) => n.id);
      if (unreadIds.length === 0) return;
      const res = await apiPatch(
        `/notification_admin/mark-as-read`,
        adminAccessToken,
        {
          admin_email: adminEmail,
          notification_ids: unreadIds,
        }
      );
      if (!res) throw new Error("Failed to mark notifications as read");
      toast.success("All notifications marked as read.");
      // After marking as read, re-fetch notifications to update the state
      fetchNotifications();
      // Also update the unread count
      fetchUnreadNotificationCount();
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
      toast.error("Failed to mark notifications as read.");
    }
  };

  // ------------------ End of Handlers ------------------

  return (
    <div className="view-clubs-container">
      <ToastContainer />
      <AdminSidebar
        unreadCount={unreadCount}
        notifications={filteredNotifications}
        toggleNotifications={openNotifications}
        handleLogout={handleLogout}
      />
      <UserDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={modalUserData}
      />
      {isNotificationsVisible && (
        <NotificationPopup
          notifications={filteredNotifications}
          filter={notificationFilter}
          setFilter={setNotificationFilter}
          markAllAsRead={markAllAsRead}
          onClose={closeNotifications}
        />
      )}
      <main className="main-content-admin">
        <section className="membership-section">
          <MembershipTable
            title="New Membership Requests"
            data={newMembershipRequests}
            isCurrentMembers={false}
            onViewDetails={handleViewDetails}
            onStatusChange={handleMembershipStatus}
          />
          <MembershipTable
            title="Current Members List"
            data={currentMembers}
            isCurrentMembers={true}
            onViewDetails={handleViewDetails}
            onMemberDeletion={handleMemberDeletion}
          />
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;

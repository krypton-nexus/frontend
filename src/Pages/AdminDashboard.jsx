import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import AdminSidebar from "../Components/AdminSidebar"; // External sidebar component
import "../CSS/AdminDashboard.css";
import "../CSS/SideBar.css";
import { FaSearch, FaUserCircle } from "react-icons/fa"; // Corrected import for FaBan
import { Ban } from "lucide-react";

// ------------------ Helper API Functions ------------------
const baseURL = "http://43.205.202.255:5000";

const apiGet = async (endpoint, token) => {
  const res = await fetch(`${baseURL}${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`GET ${endpoint} failed with status: ${res.status}`);
  }
  return await res.json();
};

const apiPut = async (endpoint, token, body) => {
  const res = await fetch(`${baseURL}${endpoint}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`PUT ${endpoint} failed with status: ${res.status}`);
  }
  return await res.json();
};

const apiPatch = async (endpoint, token, body) => {
  const res = await fetch(`${baseURL}${endpoint}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`PATCH ${endpoint} failed with status: ${res.status}`);
  }
  return await res.json();
};

const apiDelete = async (endpoint, token, body) => {
  const res = await fetch(`${baseURL}${endpoint}`, {
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
    } catch (err) {
      errorDetails = "No additional error info";
    }
    throw new Error(
      `DELETE ${endpoint} failed with status: ${res.status}. Details: ${errorDetails}`
    );
  }
  return await res.json();
};

// ------------------ NotificationPopup Component ------------------
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
    <div
      className="notification-popup"
      style={{
        position: "fixed",
        top: "60px", // Adjust as needed
        left: "250px", // Adjust based on sidebar width + margin
        zIndex: 99999,
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

  // Group members by year for analysis
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
      {/* <div className="bar-analysis-container">
        <h3>🎓 Year-wise Member Distribution</h3>
        <div className="bars-wrapper">
          {Object.entries(yearCounts).map(([year, count], index) => {
            const percent = total === 0 ? 0 : Math.round((count / total) * 100);
            return (
              <div key={year} className="bar-item">
                <div className="bar-label">Year {year}</div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: getColor(index),
                    }}>
                    <span className="bar-percent">{percent}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div> */}
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
                      onClick={() => onViewDetails(member.student_email)}>
                      View
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => onMemberDeletion(member.student_email)}>
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="view-btn"
                      onClick={() => onViewDetails(member.student_email)}>
                      View
                    </button>
                    <button
                      className="accept-btn"
                      onClick={() =>
                        onStatusChange("Approved", member.student_email)
                      }>
                      Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() =>
                        onStatusChange("rejected", member.student_email)
                      }>
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
  // Dashboard states
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

  const navigate = useNavigate();
  const adminAccessToken = localStorage.getItem("admin_access_token");
  console.log("Admin Access Token:", adminAccessToken);

  const getAdminEmailFromToken = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.email;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };
  const adminEmail = adminAccessToken
    ? getAdminEmailFromToken(adminAccessToken)
    : null;
  console.log("Admin Email:", adminEmail);

  // Redirect if token/email missing
  useEffect(() => {
    if (!adminEmail) {
      navigate("/adminlogin");
    }
  }, [adminEmail, navigate]);

  // Fetch admin details and unread notifications
  useEffect(() => {
    if (!adminEmail) return;
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
        console.log("Fetching unread notifications from:", endpoint);
        const data = await apiGet(endpoint, adminAccessToken);
        console.log("Unread notifications response:", data);
        setUnreadNotifications(data.unread_notifications || []);
      } catch (error) {
        console.error("Failed to fetch unread notifications:", error);
      }
    };
    fetchAdminDetails();
    fetchUnreadNotifications();
  }, [adminEmail, adminAccessToken, navigate]);

  // Fetch unread notification count
  useEffect(() => {
    if (!adminEmail) return;
    const fetchUnreadNotificationCount = async () => {
      try {
        const endpoint = `/notification_admin/unread/count?admin_email=${adminEmail}`;
        console.log("Fetching unread notification count from:", endpoint);
        const data = await apiGet(endpoint, adminAccessToken);
        setUnreadCount(data.unread_count || 0);
        console.log("Unread notification count:", data.unread_count);
      } catch (error) {
        console.error("Failed to fetch unread notification count:", error);
      }
    };
    fetchUnreadNotificationCount();
  }, [adminEmail, adminAccessToken]);

  // Fetch all notifications
  useEffect(() => {
    if (!adminEmail) return;
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
    fetchNotifications();
  }, [adminEmail, adminAccessToken]);

  // Filter notifications based on filter state
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

  // Fetch membership data for the club
  useEffect(() => {
    if (!clubId) return;
    const fetchMembershipData = async () => {
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
            emailToStudentDataMap[member.student_email]?.courseName ||
            "Unknown",
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
    fetchMembershipData();
  }, [clubId, adminAccessToken]);

  // Handlers for membership actions
  const handleLogout = () => {
    localStorage.removeItem("admin_access_token");
    sessionStorage.clear();
    navigate("/home", { replace: true });
    alert("You have logged out successfully.");
  };

  const handleViewDetails = async (email) => {
    try {
      const data = await apiGet(`/student/${email}`, adminAccessToken);
      console.log("User details:", data);
      setModalUserData(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
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
        alert(
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
    }
  };

  const handleMemberDeletion = async (email) => {
    try {
      const requestBody = { student_id: email, club_id: clubId };
      const data = await apiDelete(
        `/membership/delete`,
        adminAccessToken,
        requestBody
      );
      alert(`Member ${email} has been removed from the club.`);
      setCurrentMembers((prev) =>
        prev.filter((member) => member.student_id !== email)
      );
    } catch (error) {
      console.error("Failed to delete member:", error);
    }
  };

  // Toggle notification popup
  const toggleNotifications = () => {
    setIsNotificationsVisible(!isNotificationsVisible);
  };

  // Function to mark all notifications as read
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
      if (!res) {
        throw new Error("Failed to mark notifications as read");
      }
      const updatedNotifications = allNotifications.map((n) => ({
        ...n,
        is_read: 1,
      }));
      setAllNotifications(updatedNotifications);
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  return (
    <div className="view-clubs-container">
      <ToastContainer />
      {/* Render the integrated AdminSidebar component */}
      <AdminSidebar
        unreadCount={unreadCount}
        notifications={filteredNotifications}
        toggleNotifications={toggleNotifications}
        handleLogout={handleLogout}
      />
      <UserDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={modalUserData}
      />
      {/* Render NotificationPopup if visible */}
      {isNotificationsVisible && (
        <NotificationPopup
          notifications={filteredNotifications}
          filter={notificationFilter}
          setFilter={setNotificationFilter}
          markAllAsRead={markAllAsRead}
          onClose={toggleNotifications}
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

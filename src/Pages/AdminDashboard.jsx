import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Ban } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

import {
  FaUsers,
  FaTasks,
  FaRss,
  FaWallet,
  FaStore,
  FaRegBell,
  FaSignOutAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import logo1short from "../Images/logo1short.png";
import "../CSS/AdminDashboard.css";
import { IoCloseCircleOutline } from "react-icons/io5";

// AdminDashboard Component
const AdminDashboard = () => {
  // State variables
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [newMembershipRequests, setNewMembershipRequests] = useState([]);
  const [currentMembers, setCurrentMembers] = useState([]);
  const [clubId, setClubId] = useState(null);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUserData, setModalUserData] = useState(null);
  const [notificationFilter, setNotificationFilter] = useState("all");

  const navigate = useNavigate();
  const adminAccessToken = localStorage.getItem("admin_access_token");

  // Axios instance
  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: "http://43.205.202.255:5000",
      headers: {
        Authorization: `Bearer ${adminAccessToken}`, // Include token in headers
      },
    });
  }, [adminAccessToken]);

  // Decode JWT Token
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

  // Fetch initial data
  useEffect(() => {
    if (!adminEmail) {
      navigate("/adminlogin");
      return;
    }

    const fetchAdminDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/admin/email?email=${adminEmail}`
        );
        setClubId(response.data.club_id);
      } catch (error) {
        console.error("Failed to fetch admin's club ID:", error);
      }
    };

    const fetchUnreadNotifications = async () => {
      try {
        const response = await axiosInstance.get(
          `/notifications/unread?admin_email=${adminEmail}`
        );
        setUnreadNotifications(response.data.unread_notifications || []);
      } catch (error) {
        console.error("Failed to fetch unread notifications:", error);
      }
    };

    fetchAdminDetails();
    fetchUnreadNotifications();
  }, [adminEmail, navigate, axiosInstance]);

  // Fetch all notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get(
          `/notification_admin/all?admin_email=${adminEmail}`
        );
        setAllNotifications(response.data.all_notifications || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();
  }, [adminEmail, axiosInstance]);

  // Filter notifications
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

  // Fetch membership data
  useEffect(() => {
    if (!clubId) return;

    const fetchMembershipData = async () => {
      try {
        const [membershipResponse, studentResponse] = await Promise.all([
          axiosInstance.get(`/membership/list?club_id=${clubId}`),
          axiosInstance.get("/student/list"),
        ]);
        const memberships = membershipResponse.data?.memberships || [];
        const allStudents = studentResponse.data.students || [];

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
  }, [clubId, axiosInstance]);

  // Handlers
  const handleLogout = () => {
    localStorage.removeItem("admin_access_token");
    sessionStorage.clear();
    navigate("/home", { replace: true });
    alert("You have logged out successfully.");
  };

  const handleViewDetails = async (email) => {
    try {
      const response = await axiosInstance.get(`/student/${email}`);
      setModalUserData(response.data);
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

      const response = await axiosInstance.put(
        `/membership/update/status`,
        requestBody
      );

      if (response.status === 200) {
        alert(
          `${
            action === "Approved" ? "Approved" : "Rejected"
          } membership request for ${email}.`
        );

        setNewMembershipRequests((prevRequests) =>
          prevRequests.filter((member) => member.student_email !== email)
        );

        if (action === "Approved") {
          const ApprovedMember = newMembershipRequests.find(
            (member) => member.student_email === email
          );
          setCurrentMembers((prevMembers) => [...prevMembers, ApprovedMember]);
        }
      }
    } catch (error) {
      console.error("Failed to update membership status:", error);
    }
  };

  const handleMemberDeletion = async (email) => {
    try {
      const response = await axiosInstance.delete(`/membership/delete`, {
        data: { student_email: email, club_id: clubId },
      });

      if (response.status === 200) {
        alert(`Member ${email} has been removed from the club.`);
        setCurrentMembers((prevMembers) =>
          prevMembers.filter((member) => member.student_email !== email)
        );
      }
    } catch (error) {
      console.error("Failed to delete member:", error);
    }
  };

  const toggleNotifications = () => {
    setIsNotificationsVisible(!isNotificationsVisible);
  };

  const MembershipTable = ({ title, data, isCurrentMembers }) => {
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

    return (
      <div className="membership-table-container">
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
                        onClick={() => handleViewDetails(member.student_email)}>
                        View
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleMemberDeletion(member.student_email)
                        }>
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="view-btn"
                        onClick={() => handleViewDetails(member.student_email)}>
                        View
                      </button>
                      <button
                        className="accept-btn"
                        onClick={() =>
                          handleMembershipStatus(
                            "Approved",
                            member.student_email
                          )
                        }>
                        Accept
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() =>
                          handleMembershipStatus(
                            "rejected",
                            member.student_email
                          )
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

  const NotificationPopup = () => {
    const markAllAsRead = async () => {
      try {
        const unreadNotificationIds = filteredNotifications
          .filter((notification) => notification.is_read === 0)
          .map((notification) => notification.id);

        if (unreadNotificationIds.length > 0) {
          await axiosInstance.patch("/notification_admin/mark-as-read", {
            admin_email: adminEmail,
            notification_ids: unreadNotificationIds,
          });
          // Update the notifications locally
          setFilteredNotifications((prevNotifications) =>
            prevNotifications.map((notif) => ({
              ...notif,
              is_read: 1,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to mark notifications as read:", error);
      }
    };

    const handleUnreadClick = () => {
      setNotificationFilter("unread");
    };

    const handleClose = () => {
      if (notificationFilter === "unread") {
        markAllAsRead();
      }
      toggleNotifications();
    };

    const sortedNotifications = filteredNotifications
      .slice()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((notification) => {
        const gmtDate = new Date(notification.created_at);
        const gmtPlus530Date = new Date(
          gmtDate.getTime() + 5.5 * 60 * 60 * 1000
        );
        const formattedDate = gmtPlus530Date
          .toUTCString()
          .replace("GMT", "SLT");
        return { ...notification, formattedDate };
      });

    return (
      <div>
        {isNotificationsVisible && (
          <div className="notification-popup">
            <div className="notification-header">
              <h2>Notifications</h2>
              <IoCloseCircleOutline
                className="close-icon"
                onClick={handleClose}
              />
            </div>
            <div className="filter-menu">
              <button onClick={() => setNotificationFilter("all")}>All</button>
              <button onClick={handleUnreadClick}>Unread</button>
              <button onClick={() => setNotificationFilter("read")}>
                Read
              </button>
            </div>
            <div className="notification-list">
              <ul>
                {sortedNotifications.length > 0 ? (
                  sortedNotifications.map((notification) => (
                    <li
                      key={notification.id}
                      style={{
                        fontWeight:
                          notification.is_read === 0 ? "bold" : "normal",
                      }}>
                      <div>{notification.notification}</div>
                      <div>{notification.formattedDate}</div>
                    </li>
                  ))
                ) : (
                  <li>No notifications available</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

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
              <strong>First Name:</strong>{" "}
              <span>{user.first_name || "N/A"}</span>
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
              <strong>Date of Birth:</strong>
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
              <strong>Department:</strong>{" "}
              <span>{user.department || "N/A"}</span>
            </div>
            <div className="info-item">
              <strong>Faculty:</strong> <span>{user.faculty || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="view-clubs-container">
      <ToastContainer />
      <aside className="sidebar">
        <Link to="/home">
          <img src={logo1short} alt="Nexus Logo" className="logo" />
        </Link>
        <ul className="menu">
          <li className="active">
            <FaUsers /> Membership
          </li>
          <li>
            <Link to="/adminevent">
              <FaCalendarAlt /> Events
            </Link>
          </li>

          <li>
            <Link to="/tasks">
              <FaTasks /> Tasks
            </Link>
          </li>

          <li>
            <Link to="/feed">
              <FaRss /> Feed
            </Link>
          </li>

          <li>
            <Link to="/finance">
              <FaWallet /> Finance
            </Link>
          </li>

          <li>
            <Link to="/marketplace">
              <FaStore /> Marketplace
            </Link>
          </li>

          <li>
            <div className="notifications" onClick={toggleNotifications}>
              <FaRegBell /> Notification{" "}
              <span className="badge">{unreadNotifications.length}</span>
            </div>
          </li>
        </ul>
        <button className="logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <NotificationPopup />

      <UserDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={modalUserData}
      />

      <main className="main-content-admin">
        <section className="membership-section">
          <MembershipTable
            title="New Membership Requests"
            data={newMembershipRequests}
            isCurrentMembers={false}
          />
          <MembershipTable
            title="Current Members List"
            data={currentMembers}
            isCurrentMembers={true}
          />
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import AdminSidebar from "../Components/AdminSidebar";
import "../CSS/AdminDashboard.css";
import "../CSS/SideBar.css";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { Skeleton, Box, Stack } from "@mui/material";
import MemberAnalysisCharts from "../Components/MemberAnalysisCharts";
import NotificationPopup from "../Components/NotificationPopup";
import UserDetailModal from "../Components/UserDetailModal";
import MembershipTable from "../Components/MembershipTable";

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

const TableSkeleton = () => (
  <Box
    sx={{
      background: "#fff",
      borderRadius: 3,
      p: 3,
      boxShadow: "0 2px 24px 0 rgba(60,72,130,0.10)",
      minHeight: 330,
      mb: 4,
    }}
  >
    <Skeleton variant="text" width="30%" height={34} sx={{ mb: 3 }} />
    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
      <Skeleton variant="rectangular" width="30%" height={28} />
      <Skeleton variant="rectangular" width="20%" height={28} />
      <Skeleton variant="rectangular" width="20%" height={28} />
      <Skeleton variant="rectangular" width="20%" height={28} />
      <Skeleton variant="rectangular" width={40} height={28} />
    </Stack>
    {[...Array(6)].map((_, i) => (
      <Stack direction="row" spacing={2} key={i} sx={{ mb: 1 }}>
        <Skeleton variant="text" width="30%" height={24} />
        <Skeleton variant="text" width="20%" height={24} />
        <Skeleton variant="text" width="20%" height={24} />
        <Skeleton variant="text" width="20%" height={24} />
        <Skeleton variant="circular" width={28} height={28} />
      </Stack>
    ))}
  </Box>
);

const ChartSkeleton = () => (
  <Box
    sx={{
      background: "#fff",
      borderRadius: 3,
      p: 3,
      boxShadow: "0 2px 24px 0 rgba(60,72,130,0.08)",
      minHeight: 270,
      width: 310,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <Skeleton variant="text" width={120} height={26} sx={{ mb: 2 }} />
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        mb: 2,
      }}
    >
      <Skeleton variant="circular" width={120} height={120} />
      <Skeleton
        variant="rectangular"
        width={48}
        height={22}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: 2,
        }}
      />
    </Box>
    <Stack spacing={1} sx={{ width: "80%", mt: 2 }}>
      {[...Array(4)].map((_, i) => (
        <Stack key={i} direction="row" alignItems="center" spacing={1}>
          <Skeleton
            variant="rectangular"
            width={18}
            height={18}
            sx={{ borderRadius: "50%" }}
          />
          <Skeleton variant="text" width={70 + i * 10} height={18} />
        </Stack>
      ))}
    </Stack>
  </Box>
);

const ChartsRowSkeleton = () => (
  <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 4 }}>
    <ChartSkeleton />
    <ChartSkeleton />
    <ChartSkeleton />
    <ChartSkeleton />
    <ChartSkeleton />
  </Stack>
);

const AdminDashboard = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [allNotifications, setAllNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [notificationFilter, setNotificationFilter] = useState("all");
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
  const [isLoadingPopup, setIsLoadingPopup] = useState(false);
  const [newMembershipRequests, setNewMembershipRequests] = useState([]);
  const [currentMembers, setCurrentMembers] = useState([]);
  const [clubId, setClubId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUserData, setModalUserData] = useState(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);

  const navigate = useNavigate();
  const adminAccessToken = localStorage.getItem("admin_access_token");
  const popupRef = useRef();

  const getAdminEmailFromToken = useCallback((token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.email;
    } catch {
      return null;
    }
  }, []);
  const adminEmail = adminAccessToken
    ? getAdminEmailFromToken(adminAccessToken)
    : null;

  useEffect(() => {
    if (!adminEmail) navigate("/admin");
  }, [adminEmail, navigate]);

  useEffect(() => {
    const initDashboard = async () => {
      setIsLoadingDashboard(true);
      try {
        const adminData = await apiGet(
          `/admin/email?email=${adminEmail}`,
          adminAccessToken
        );
        setClubId(adminData.club_id);

        const [membershipData, studentData] = await Promise.all([
          apiGet(
            `/membership/list?club_id=${adminData.club_id}`,
            adminAccessToken
          ),
          apiGet("/student/list", adminAccessToken),
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

        const enriched = memberships.map((member) => ({
          ...member,
          ...emailToStudentDataMap[member.email],
        }));

        setNewMembershipRequests(
          enriched.filter((m) => m.status === "Pending")
        );
        setCurrentMembers(enriched.filter((m) => m.status === "Approved"));
      } catch {}
      setIsLoadingDashboard(false);
    };

    if (adminEmail) {
      initDashboard();
      fetchUnreadNotificationCount();
    }
  }, [adminEmail, adminAccessToken]);

  const fetchUnreadNotificationCount = async () => {
    try {
      const data = await apiGet(
        `/notification_admin/unread/count?admin_email=${adminEmail}`,
        adminAccessToken
      );
      setUnreadCount(data.unread_count || 0);
    } catch {}
  };

  const fetchNotifications = async () => {
    setIsLoadingPopup(true);
    try {
      const data = await apiGet(
        `/notification_admin/all?admin_email=${adminEmail}`,
        adminAccessToken
      );
      setAllNotifications(data.all_notifications || []);
    } catch {
      toast.error("Failed to load notifications.");
      setAllNotifications([]);
    }
    setIsLoadingPopup(false);
  };

  const openNotifications = () => {
    setIsNotificationsVisible(true);
    fetchNotifications();
  };

  const closeNotifications = () => setIsNotificationsVisible(false);

  useEffect(() => {
    if (!isNotificationsVisible) return;
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsNotificationsVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationsVisible]);

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

  const markAllAsRead = async () => {
    const unreadNotifs =
      notificationFilter === "all"
        ? allNotifications.filter((n) => n.is_read === 0)
        : filteredNotifications.filter((n) => n.is_read === 0);
    if (unreadNotifs.length === 0) return;
    try {
      await apiPatch(`/notification_admin/mark-as-read`, adminAccessToken, {
        admin_email: adminEmail,
        notification_ids: unreadNotifs.map((n) => n.id),
      });
      toast.success("Marked as read.");
      fetchNotifications();
      fetchUnreadNotificationCount();
    } catch {
      toast.error("Failed to mark notifications as read.");
    }
  };

  useEffect(() => {
    if (notificationFilter === "unread" && filteredNotifications.length > 0) {
      markAllAsRead();
    }
  }, [notificationFilter]);

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
    } catch {
      toast.error("Failed to load user details.");
    }
  };

  const handleMembershipStatus = async (action, email) => {
    try {
      await apiPut(`/membership/update/status`, adminAccessToken, {
        student_email: email,
        club_id: clubId,
        status: action,
      });
      toast.success(`${action} membership request for ${email}.`);
      setNewMembershipRequests((prev) => prev.filter((m) => m.email !== email));
      if (action === "Approved") {
        const approved = newMembershipRequests.find((m) => m.email === email);
        if (approved) setCurrentMembers((prev) => [...prev, approved]);
      }
    } catch {
      toast.error("Failed to update membership status.");
    }
  };

  const handleMemberDeletion = async (email) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await apiDelete(`/membership/delete`, adminAccessToken, {
        student_id: email,
        club_id: clubId,
      });
      toast.success(`Member ${email} has been removed from the club.`);
      fetchUnreadNotificationCount();
    } catch {
      toast.error("Failed to delete member.");
    }
  };

  return (
    <div
      className="view-clubs-container"
      style={{
        background: "#f5f7fb",
        minHeight: "100vh",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      <ToastContainer />
      <AdminSidebar
        unreadCount={unreadCount}
        notifications={filteredNotifications}
        toggleNotifications={openNotifications}
        handleLogout={handleLogout}
      />
      <main className="main-content-admin">
        <section className="membership-section">
          <div className="membership-header">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search members..."
                className="membership-search"
              />
              <button className="searchIcon">
                <FaSearch />
              </button>
            </div>
            <FaUserCircle className="membership-avatar" size={30} />
          </div>
          {isLoadingDashboard ? (
            <>
              <TableSkeleton />
              <ChartsRowSkeleton />
              <TableSkeleton />
              <ChartsRowSkeleton />
            </>
          ) : (
            <>
              <MembershipTable
                title="New Membership Requests"
                data={newMembershipRequests}
                isCurrentMembers={false}
                onViewDetails={handleViewDetails}
                onStatusChange={handleMembershipStatus}
              />
              {newMembershipRequests.length > 0 && (
                <MemberAnalysisCharts
                  data={newMembershipRequests}
                  titlePrefix="New Request"
                  newRequests={newMembershipRequests}
                  approvedMembers={currentMembers}
                  notifications={allNotifications}
                />
              )}
              <MembershipTable
                title="Current Members List"
                data={currentMembers}
                isCurrentMembers={true}
                onViewDetails={handleViewDetails}
                onMemberDeletion={handleMemberDeletion}
              />
              {currentMembers.length > 0 && (
                <MemberAnalysisCharts
                  data={currentMembers}
                  titlePrefix="Current"
                  newRequests={newMembershipRequests}
                  approvedMembers={currentMembers}
                  notifications={allNotifications}
                />
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;

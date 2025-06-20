import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {jwtDecode} from "jwt-decode";
import { Skeleton, Stack, Card, CardContent, Box } from "@mui/material";
import AdminSidebar from "../Components/AdminSidebar";
import "../CSS/ViewEvents.css";
import "../CSS/AddEvent.css";
import "../CSS/SideBar.css";
import {
  FaSearch,
  FaEllipsisV,
  FaPen,
  FaTrash,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";
import { Ban } from "lucide-react";
import bannerImage from "../Images/bannerevent.png";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// ------------------ Helper API Functions ------------------
const apiGet = async (endpoint, token) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
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
  if (!res.ok) {
    throw new Error(`PUT ${endpoint} failed with status: ${res.status}`);
  }
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
  if (!res.ok) {
    throw new Error(`PATCH ${endpoint} failed with status: ${res.status}`);
  }
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
    } catch (err) {
      errorDetails = "No additional error info";
    }
    throw new Error(
      `DELETE ${endpoint} failed with status: ${res.status}. Details: ${errorDetails}`
    );
  }
  return res.json();
};

// // ------------------ NotificationPopup with Overlay ------------------
// const NotificationPopup = ({
//   notifications,
//   filter,
//   setFilter,
//   markAllAsRead,
//   onClose,
// }) => {
//   const sortedNotifications = notifications
//     .slice()
//     .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
//     .map((notif) => ({
//       ...notif,
//       formattedDate: new Date(notif.created_at).toLocaleString(),
//     }));

//   return (
//     <>
//       {/* Overlay to close the popup when clicked */}
//       <div
//         onClick={onClose}
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           zIndex: 99998,
//           backgroundColor: "transparent",
//         }}
//       />
//       <div
//         className="notification-popup"
//         style={{
//           position: "fixed",
//           top: "60px",
//           left: "250px",
//           zIndex: 99999,
//           backgroundColor: "#fff",
//           color: "#000",
//           boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
//           width: "320px",
//           padding: "10px",
//           borderRadius: "5px",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div
//           className="notification-dropdown-header"
//           style={{
//             marginBottom: "10px",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <button
//             onClick={markAllAsRead}
//             style={{
//               background: "#1a1a1a",
//               color: "#fff",
//               border: "none",
//               padding: "5px 10px",
//               cursor: "pointer",
//               borderRadius: "3px",
//             }}
//           >
//             Mark All as Read
//           </button>
//           <button
//             onClick={onClose}
//             style={{
//               background: "transparent",
//               border: "none",
//               fontSize: "24px",
//               cursor: "pointer",
//             }}
//           >
//             &times;
//           </button>
//         </div>
//         {sortedNotifications.length > 0 ? (
//           <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
//             {sortedNotifications.map((notif) => (
//               <li
//                 key={notif.id}
//                 style={{
//                   fontWeight: notif.is_read ? "normal" : "bold",
//                   borderBottom: "1px solid #ccc",
//                   padding: "5px 0",
//                 }}
//               >
//                 <div>{notif.notification}</div>
//                 <div style={{ fontSize: "0.8em", color: "#666" }}>
//                   {notif.formattedDate}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <div>No notifications available.</div>
//         )}
//         <div style={{ marginTop: "10px", textAlign: "center" }}>
//           <button onClick={() => setFilter("all")} style={{ margin: "0 5px" }}>
//             All
//           </button>
//           <button
//             onClick={() => setFilter("unread")}
//             style={{ margin: "0 5px" }}
//           >
//             Unread
//           </button>
//           <button onClick={() => setFilter("read")} style={{ margin: "0 5px" }}>
//             Read
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// ------------------ Main AdminEvent Component ------------------
const AdminEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentEmail, setStudentEmail] = useState("");
  const [clubId, setClubId] = useState("");
  const [token, setToken] = useState(null);
  const [participantCounts, setParticipantCounts] = useState({});
  const [trendingImages, setTrendingImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [modalUserData, setModalUserData] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch and decode token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("admin_access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setStudentEmail(decoded.email);
        setClubId(decoded.club_id);
        setToken(token);
      } catch (err) {
        console.error("Invalid token", err);
        setError("Failed to decode token. Please log in again.");
      }
    } else {
      console.error("No token found");
      setError("User is not authenticated. Please log in.");
    }
  }, []);

  // Fetch events from API
  useEffect(() => {
    if (!token) return;
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/event/get_events?club_id=${clubId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (data.events && Array.isArray(data.events)) {
          setEvents(data.events);
          // Extract event images for trending section
          const images = data.events
            .map((event) => getImageUrl(event.images))
            .filter((img) => img !== "");
          setTrendingImages(images);
          data.events.forEach((event) => {
            fetchParticipantCount(event.club_id, event.id);
          });
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [token, clubId]);

  // Delete event handler with toast messages
  const handleDelete = async (eventId, clubId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const response = await fetch(`${BASE_URL}/event/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          event_id: eventId,
          club_id: clubId,
        }),
      });

      if (!response.ok)
        throw new Error(`Failed to delete event: ${response.status}`);

      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event.");
    }
  };

  // Update participant count for an event
  const fetchParticipantCount = async (clubId, eventId) => {
    if (!token) return;
    try {
      const response = await fetch(`${BASE_URL}/event/get_participant_count`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ club_id: clubId, event_id: eventId }),
      });
      if (!response.ok)
        throw new Error(
          `Failed to fetch participant count: ${response.status}`
        );
      const data = await response.json();
      setParticipantCounts((prev) => ({
        ...prev,
        [eventId]: data.participant_count || 0,
      }));
    } catch (error) {
      console.error("Error fetching participant count:", error);
    }
  };

  // Helper to get image URL from event images JSON
  const getImageUrl = (images) => {
    if (!images) return "";
    try {
      const parsedImages =
        typeof images === "string" ? JSON.parse(images) : images;
      return parsedImages.event_img1 || parsedImages[0] || "";
    } catch (e) {
      console.error("Error parsing image JSON", e);
      return "";
    }
  };

  // Handle edit click to open modal with event details
  const handleEditClick = (event) => {
    setEditEvent(event);
    setEditModalOpen(true);
  };

  // Handle changes in the edit modal
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditEvent((prev) => ({ ...prev, [name]: value }));
  };

  // Helper function to format date to yyyy-mm-dd for input[type="date"]
  const formatDateForInput = (dateString) => {
    const d = new Date(dateString);
    return !isNaN(d) ? d.toISOString().split("T")[0] : "";
  };

  // Handle edit submit with toast notifications
  const handleEditSubmit = async () => {
    const payload = {
      event_id: editEvent.id, // backend expects 'event_id'
      event_name: editEvent.event_name,
      event_date: editEvent.event_date,
      event_time: editEvent.event_time,
      venue: editEvent.venue,
      mode: editEvent.mode,
      event_description: editEvent.event_description,
      category: editEvent.category,
    };

    console.log(JSON.stringify(payload));

    try {
      const response = await fetch(`${BASE_URL}/event/update`, {
        method: "POST", // changed from POST to PUT
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok)
        throw new Error(`Failed to update event: ${response.status}`);

      setEvents((prev) =>
        prev.map((ev) => (ev.id === editEvent.id ? editEvent : ev))
      );
      setEditModalOpen(false);
      toast.success("Event updated successfully!");
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event.");
    }
  };

  const todayDate = new Date().toDateString();

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.event_date);
    let matchesTab = false;

    if (activeTab === "upcoming") {
      matchesTab = eventDate > new Date();
    } else if (activeTab === "past") {
      matchesTab = eventDate < new Date();
    } else if (activeTab === "today") {
      matchesTab = eventDate.toDateString() === todayDate;
    }

    // Apply search filter: event name, description, or venue (case-insensitive)
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch =
      event.event_name?.toLowerCase().includes(search) ||
      event.event_description?.toLowerCase().includes(search) ||
      event.venue?.toLowerCase().includes(search);

    return matchesTab && (search === "" || matchesSearch);
  });

  // ------------------ Render Section ------------------
  return (
    <div className="view-events-container">
      <AdminSidebar />
      <main className="main-content">
        <div className="membership-header">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search events..."
              className="membership-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="searchIcon"
              onClick={() => {
                /* no-op, since filtering happens live */
              }}
              aria-label="Search"
            >
              <FaSearch />
            </button>
          </div>
          <button
            className="create-event"
            onClick={() => navigate("/addevent")}
          >
            Create Event
          </button>
        </div>
        <div className="trending-my-events">
          <div className="trending-events">
            <div className="participants-table">
              <h2>Event Summary</h2>
              <table>
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Venue</th>
                    <th>Time</th>
                    <th>Yes Count</th>
                    <th>Maybe Count</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr key={event.id}>
                      <td>{event.event_name}</td>
                      <td>{event.venue}</td>
                      <td>{new Date(event.event_date).toLocaleTimeString()}</td>
                      <td>{event.participant_count || 0}</td>
                      <td>{event.count_maybe || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="my-events">
            <h2>Club Events</h2>
            <div className="event-tabs">
              <span
                className={`event-tab ${
                  activeTab === "today" ? "active-tab" : ""
                }`}
                onClick={() => setActiveTab("today")}
              >
                This Month
              </span>
              <span
                className={`event-tab ${
                  activeTab === "upcoming" ? "active-tab" : ""
                }`}
                onClick={() => setActiveTab("upcoming")}
              >
                Next Month
              </span>
            </div>
            <div className="event-list">
              {events
                .filter((event) =>
                  activeTab === "today"
                    ? new Date(event.event_date).toDateString() ===
                      new Date().toDateString()
                    : new Date(event.event_date) > new Date()
                )
                .map((event) => (
                  <h5 key={event.id} className="event-item">
                    {event.event_name} <hr className="section-divider" />
                  </h5>
                ))}
            </div>
          </div>
        </div>
        <div className="events-header">
          <h2>Customize Your Events</h2>
        </div>
        <div className="all-event-tabs2">
          <span
            className={`event-tab ${activeTab === "past" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("past")}
          >
            Past Events
          </span>
          <span
            className={`event-tab ${
              activeTab === "upcoming" ? "active-tab" : ""
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Events
          </span>
        </div>
        {loading ? (
          <div>
            <Box sx={{ width: "100%", mb: 4 }}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Skeleton variant="text" height={40} width={200} />
                    <Stack direction="row" spacing={2}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton
                          key={i}
                          variant="rectangular"
                          height={40}
                          sx={{ flex: 1 }}
                        />
                      ))}
                    </Stack>
                    {[1, 2, 3].map((row) => (
                      <Stack key={row} direction="row" spacing={2}>
                        {[1, 2, 3, 4, 5].map((col) => (
                          <Skeleton
                            key={`${row}-${col}`}
                            variant="text"
                            sx={{ flex: 1 }}
                            height={30}
                          />
                        ))}
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ width: "100%", mb: 4 }}>
              <Stack spacing={2}>
                <Skeleton variant="text" height={40} width={150} />
                <Stack direction="row" spacing={2}>
                  <Skeleton variant="rectangular" width={120} height={35} />
                  <Skeleton variant="rectangular" width={120} height={35} />
                </Stack>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} variant="text" height={30} />
                ))}
              </Stack>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Stack spacing={2}>
                <Skeleton variant="text" height={40} width={250} />
                <div className="events-grid2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} sx={{ height: "100%" }}>
                      <CardContent>
                        <Stack spacing={1}>
                          <Skeleton variant="rectangular" height={160} />
                          <Skeleton variant="text" height={30} width="80%" />
                          <Skeleton variant="text" height={20} width="60%" />
                          <Skeleton variant="text" height={20} width="40%" />
                          <Skeleton variant="text" height={20} width="70%" />
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Stack>
            </Box>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : filteredEvents.length > 0 ? (
          <div className="events-grid2">
            {filteredEvents.map((event) => (
              <div className="event-card2" key={event.id}>
                <img
                  src={getImageUrl(event.images)}
                  alt={event.event_name}
                  className="event-image2"
                />
                <div className="event-info2">
                  <h3>{event.event_name}</h3>
                  <p>{new Date(event.event_date).toDateString()}</p>
                  <p>{event.venue}</p>
                  <p>{event.event_description}</p>
                </div>
                <div className="event-menu-container">
                  <FaEllipsisV
                    className="menu-icon"
                    onClick={() =>
                      setMenuOpen(menuOpen === event.id ? null : event.id)
                    }
                  />
                  {menuOpen === event.id && (
                    <div className="event-menu">
                      <button onClick={() => handleEditClick(event)}>
                        <FaPen /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id, event.club_id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-membership-request">
            <h2>No events yet! Check back later for upcoming activities.</h2>
          </div>
        )}
      </main>
      {editModalOpen && (
        <div className="modal-overlay2">
          <div className="modal-content2">
            <h2>Edit Event</h2>
            <label>
              Event Name:
              <input
                type="text"
                name="event_name"
                value={editEvent.event_name}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Event Date:
              <input
                type="date"
                name="event_date"
                value={formatDateForInput(editEvent.event_date)}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Venue:
              <input
                type="text"
                name="venue"
                value={editEvent.venue}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Event Description:
              <textarea
                name="event_description"
                value={editEvent.event_description}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Mode:
              <select
                name="mode"
                value={editEvent.mode}
                onChange={handleEditChange}
              >
                <option value="physical">Physical</option>
                <option value="virtual">Virtual</option>
              </select>
            </label>
            <label>
              Category:
              <select
                name="category"
                value={editEvent.category}
                onChange={handleEditChange}
              >
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Networking">Networking</option>
                <option value="Volunteering">Volunteering</option>
              </select>
            </label>
            <button className="update-btn" onClick={handleEditSubmit}>
              Update Event
            </button>
            <FaTimes
              className="close-modal"
              onClick={() => setEditModalOpen(false)}
            />
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default AdminEvent;

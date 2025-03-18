import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import "../CSS/ViewEvents.css";
import "../CSS/AddEvent.css";
import AdminSidebar from "../Components/AdminSidebar";
import bannerImage from "../Images/bannerevent.png";
import { FaSearch, FaEllipsisV, FaPen, FaTrash, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentEmail, setStudentEmail] = useState("");
  const [token, setToken] = useState(null);
  const [participantCounts, setParticipantCounts] = useState({});
  const [trendingImages, setTrendingImages] = useState([]); // Store event images for trending
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("today");
  const [menuOpen, setMenuOpen] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setStudentEmail(decoded.email);
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

  useEffect(() => {
    if (!token) return;

    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "http://43.205.202.255:5000/event/get_events?club_id=club_sesa",
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
            .filter((img) => img !== ""); // Remove empty images
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
  }, [token]);

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(
        `http://43.205.202.255:5000/event/delete/${eventId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok)
        throw new Error(`Failed to delete event: ${response.status}`);

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
      alert("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event.");
    }
  };
  // Auto change images every 4 seconds for the trending section
  useEffect(() => {
    if (trendingImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === trendingImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [trendingImages]);

  const fetchParticipantCount = async (clubId, eventId) => {
    if (!token) return;

    try {
      const response = await fetch(
        "http://43.205.202.255:5000/event/get_participant_count",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            club_id: clubId,
            event_id: eventId,
          }),
        }
      );
      if (!response.ok)
        throw new Error(
          `Failed to fetch participant count: ${response.status}`
        );

      const data = await response.json();
      setParticipantCounts((prevCounts) => ({
        ...prevCounts,
        [eventId]: data.participant_count || 0,
      }));
    } catch (error) {
      console.error("Error fetching participant count:", error);
    }
  };

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

  const handleEditClick = (event) => {
    setEditEvent(event);
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(
        `http://43.205.202.255:5000/event/update/${editEvent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editEvent),
        }
      );

      if (!response.ok)
        throw new Error(`Failed to update event: ${response.status}`);

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === editEvent.id ? editEvent : event
        )
      );

      setEditModalOpen(false);
      alert("Event updated successfully!");
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event.");
    }
  };

  const todayDate = new Date().toDateString();

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.event_date);

    // if (activeTab === "all") {
    //   return true; // Show all events
    // }
    // if (activeTab === "today") {
    //   return eventDate.toDateString() === todayDate;
    // }
    if (activeTab === "upcoming") {
      return eventDate > new Date();
    }
    if (activeTab === "past") {
      return eventDate < new Date();
    }
    return false;
  });

  return (
    <div className="view-events-container">
      <AdminSidebar />
      <main className="main-content">
        <div className="membership-header">
          <div className="search-container">
            <input
              type="text"
              placeholder="Discover Your Event..."
              className="membership-search"
            />
            <button className="search-icon">
              <FaSearch />
            </button>
          </div>

          <button
            className="create-event"
            onClick={() => navigate("/addevent")}>
            Create Event
          </button>
        </div>
        <div className="trending-my-events">
          <div className="trending-events">
            <div className="participants-table">
              <h2>Participants Count</h2>
              <table>
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Venue</th>
                    <th>Time</th>
                    <th>Yes Count</th>
                    <th>No Count</th>
                    <th>Maybe Count</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr key={event.id}>
                      <td>{event.event_name}</td>
                      <td>{event.venue}</td>
                      <td>{new Date(event.event_date).toLocaleTimeString()}</td>
                      <td>{event.yes_count || 0}</td>
                      <td>{event.no_count || 0}</td>
                      <td>{event.maybe_count || 0}</td>
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
                onClick={() => setActiveTab("today")}>
                Today’s Events
              </span>
              <span
                className={`event-tab ${
                  activeTab === "upcoming" ? "active-tab" : ""
                }`}
                onClick={() => setActiveTab("upcoming")}>
                Upcoming Events
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
          {/* <span
            className={`event-tab ${activeTab === "all" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("all")}>
            All Events
          </span>
          <span
            className={`event-tab ${activeTab === "today" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("today")}>
            Today Events
          </span> */}
          <span
            className={`event-tab ${
              activeTab === "upcoming" ? "active-tab" : ""
            }`}
            onClick={() => setActiveTab("upcoming")}>
            Upcoming Events
          </span>
          <span
            className={`event-tab ${activeTab === "past" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("past")}>
            Past Events
          </span>
        </div>

        {loading ? (
          <div>Loading events...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : filteredEvents.length > 0 ? (
          <div className="events-grid">
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
                      <button onClick={() => handleDelete(event.id)}>
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
            <h2> No events yet! Check back later for upcoming activities.</h2>
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
                value={editEvent.event_date}
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
                requiredE
              />
            </label>

            <label>
              Mode:
              <select
                name="mode"
                value={editEvent.mode}
                onChange={handleEditChange}>
                <option value="physical">Physical</option>
                <option value="virtual">Virtual</option>
              </select>
            </label>
            <label>
              Category:
              <select
                name="category"
                value={editEvent.category}
                onChange={handleEditChange}>
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
    </div>
  );
};

export default AdminEvent;

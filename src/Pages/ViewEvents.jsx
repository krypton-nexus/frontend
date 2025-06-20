import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "../CSS/ViewEvents.css";
import Sidebar from "../Components/SideBar";
import bannerImage from "../Images/bannerevent.png";
import { FaUserCircle, FaSearch, FaMapPin } from "react-icons/fa";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import UserProfile from "../Components/UserProfile";
import Skeleton from "@mui/material/Skeleton";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [token, setToken] = useState(null);
  const [participantCounts, setParticipantCounts] = useState({});
  const [trendingImages, setTrendingImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("today");
  const [clubs, setClubs] = useState(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const showSnackbar = (msg, severity = "info") => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason !== "clickaway") setSnackbarOpen(false);
  };

  // Decode JWT on mount
  useEffect(() => {
    const access = localStorage.getItem("access_token");
    if (access) {
      try {
        const decoded = jwtDecode(access);
        setStudentEmail(decoded.email);
        setToken(access);
      } catch {
        showSnackbar("Invalid token. Please log in again.", "error");
      }
    } else {
      showSnackbar("Please log in to continue.", "error");
    }
  }, []);

  // Fetch clubs once token & studentEmail are known
  useEffect(() => {
    if (!token || !studentEmail) return;

    setLoading(true);
    const fetchClubs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/student/clubs/${studentEmail}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        // Even if data.clubs is undefined, default to []
        setClubs(data.clubs || []);
      } catch {
        setClubs([]); // treat as “no clubs” on error
        showSnackbar("Failed to load clubs.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, [token, studentEmail]);

  // Fetch all events only if clubs is a non-empty array
  useEffect(() => {
    // If clubs === null => not fetched yet. If clubs.length === 0 => user has no clubs
    if (!token || clubs === null) return;

    if (clubs.length === 0) {
      // No clubs → we’re “done loading” (no need to fetch events)
      setLoading(false);
      return;
    }

    setLoading(true);
    const fetchAllEvents = async () => {
      try {
        const allEvents = [];
        const allImages = [];

        for (let clubId of clubs) {
          const res = await fetch(
            `${BASE_URL}/event/get_events?club_id=${clubId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await res.json();
          console.log(data);

          if (Array.isArray(data.events)) {
            allEvents.push(...data.events);

            // Collect the first valid image URL from each event
            const images = data.events
              .map((event) => getImageUrl(event.images))
              .filter((img) => img !== "");
            allImages.push(...images);

            // Fetch each event’s participant count in parallel (fire-and-forget)
            data.events.forEach((evt) =>
              fetchParticipantCount(evt.club_id, evt.id)
            );
          }
        }

        setEvents(allEvents);
        setTrendingImages(allImages);
      } catch {
        showSnackbar("Failed to load events.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, [token, clubs]);

  // Rotate trending images every 4 seconds
  useEffect(() => {
    if (trendingImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((i) =>
        i === trendingImages.length - 1 ? 0 : i + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [trendingImages]);

  const fetchParticipantCount = async (clubId, eventId) => {
    try {
      const res = await fetch(`${BASE_URL}/event/get_participant_count`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ club_id: clubId, event_id: eventId }),
      });
      const data = await res.json();
      setParticipantCounts((prev) => ({
        ...prev,
        [eventId]: data.participant_count,
      }));
    } catch {
      showSnackbar("Failed to get participant count.", "error");
    }
  };

  const handleYesVote = async (eventItem) => {
    const participants = JSON.parse(eventItem.participants || "[]");
    if (participants.includes(studentEmail)) {
      return showSnackbar("You're already participating.", "warning");
    }

    try {
      await fetch(`${BASE_URL}/event/add_participant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          club_id: eventItem.club_id,
          event_id: eventItem.id,
          student_email: studentEmail,
        }),
      });
      fetchParticipantCount(eventItem.club_id, eventItem.id);
      updateEventParticipants(eventItem.id, [...participants, studentEmail]);
      showSnackbar("Participation confirmed.", "success");
    } catch {
      showSnackbar("Failed to participate.", "error");
    }
  };

  const handleNoVote = async (eventItem) => {
    if (!window.confirm("Are you sure you want to leave this event?")) return;

    const participants = JSON.parse(eventItem.participants || "[]");
    if (!participants.includes(studentEmail)) {
      return showSnackbar("You're not a participant.", "warning");
    }

    try {
      await fetch(`${BASE_URL}/event/delete_participant`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          club_id: eventItem.club_id,
          event_id: eventItem.id,
          student_email: studentEmail,
        }),
      });
      fetchParticipantCount(eventItem.club_id, eventItem.id);
      updateEventParticipants(
        eventItem.id,
        participants.filter((p) => p !== studentEmail)
      );
      showSnackbar("You left the event.", "info");
    } catch {
      showSnackbar("Failed to remove participation.", "error");
    }
  };

  const updateEventParticipants = (eventId, updatedList) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === eventId
          ? { ...ev, participants: JSON.stringify(updatedList) }
          : ev
      )
    );
  };

  const handleMaybeVote = () => {
    showSnackbar("Maybe functionality coming soon!", "info");
  };

  const getImageUrl = (images) => {
    try {
      const parsed = typeof images === "string" ? JSON.parse(images) : images;
      return parsed.event_img1 || parsed[0] || "";
    } catch {
      return "";
    }
  };

  const today = new Date().toDateString();
  const filteredEvents = events.filter((event) => {
    const date = new Date(event.event_date);
    if (activeTab === "all") return true;
    if (activeTab === "today") return date.toDateString() === today;
    if (activeTab === "upcoming") return date > new Date();
    if (activeTab === "past") return date < new Date();
    return false;
  });
  const isPastEvent = (eventDateString) => {
    const eventDate = new Date(eventDateString);
    const today = new Date();
    return eventDate < today;
  };
  
  return (
    <div className="view-events-container">
      <Sidebar />
      <main className="main-content">
        <div className="membership-header">
          <div className="search-container">
            <input
              placeholder="Discover Your Event..."
              className="membership-search"
            />
            <button className="searchIcon">
              <FaSearch />
            </button>
          </div>
          <FaUserCircle
            className="membership-avatar"
            size={30}
            onClick={() => setProfileOpen(true)}
            style={{ cursor: "pointer" }}
          />
          <UserProfile
            open={profileOpen}
            onClose={() => setProfileOpen(false)}
            user={user}
          />
        </div>

        <header className="banner">
          <img src={bannerImage} alt="Events Banner" className="banner-image" />
        </header>

        <div className="trending-my-events">
          <div className="trending-events">
            <h2>Trending Events</h2>
            {trendingImages.length > 0 && (
              <div className="trending-image-container">
                <img
                  src={trendingImages[currentImageIndex]}
                  alt="Trending Event"
                  className="trending-image"
                />
              </div>
            )}
          </div>
          <div className="my-events">
            <h2>My Events</h2>
            <div className="event-tabs">
              <span
                className={`event-tab ${
                  activeTab === "today" ? "active-tab" : ""
                }`}
                onClick={() => setActiveTab("today")}
              >
                Today’s Events
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
            <div className="event-list">
              {events
                .filter((event) =>
                  activeTab === "today"
                    ? new Date(event.event_date).toDateString() === today
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
          <h2>Popular Events</h2>
        </div>

        <div className="all-event-tabs">
          {["all", "today", "upcoming", "past"].map((tab) => (
            <span
              key={tab}
              className={`event-tab ${activeTab === tab ? "active-tab" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Events
            </span>
          ))}
        </div>

        {clubs === null || loading ? (
          <div style={{ padding: 20 }}>
            <Skeleton variant="rectangular" height={50} />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="50%" />
          </div>
        ) : clubs.length === 0 ? (
          <div className="no-membership-request">
            <h2>Join any clubs to view the events!</h2>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <div className="event-card" key={event.id}>
                <img
                  src={getImageUrl(event.images)}
                  alt={event.event_name}
                  className="event-image"
                />
                <div className="event-info">
                  <h3>{event.event_name}</h3>
                  <p>{new Date(event.event_date).toDateString()}</p>
                  <p>{event.venue}</p>
                  <p className="event-participants">
                    <strong>Participants:</strong>{" "}
                    {participantCounts[event.id] || 0}
                  </p>
                  <div className="event-buttons">
                    {/* <button
                      className="yes-btn"
                      onClick={() => handleYesVote(event)}
                    >
                      Yes
                    </button>
                    <button
                      className="no-btn"
                      onClick={() => handleNoVote(event)}
                    >
                      No
                    </button>
                    <button className="maybe-btn" onClick={handleMaybeVote}>
                      Maybe
                    </button> */}
                    {!isPastEvent(event.event_date) ? (
                      <>
                        <button
                          className="yes-btn"
                          onClick={() => handleYesVote(event)}
                        >
                          Yes
                        </button>
                        <button
                          className="no-btn"
                          onClick={() => handleNoVote(event)}
                        >
                          No
                        </button>
                        <button className="maybe-btn" onClick={handleMaybeVote}>
                          Maybe
                        </button>
                      </>
                    ) : (
                      <div className="past-event-label">This event has ended.</div>
                    )}
                  </div>
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          onClose={handleSnackbarClose}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ViewEvents;

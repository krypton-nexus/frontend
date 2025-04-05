import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import "../CSS/ViewEvents.css";
import Sidebar from "../Components/SideBar";
import bannerImage from "../Images/bannerevent.png";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentEmail, setStudentEmail] = useState("");
  const [token, setToken] = useState(null);
  const [participantCounts, setParticipantCounts] = useState({});
  const [trendingImages, setTrendingImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("today");
  const [userVotes, setUserVotes] = useState({});
  const [clubs, setClubs] = useState([]);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Snackbar close handler.
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  // Decode token and set student email.
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setStudentEmail(decoded.email);
        setToken(token);
        console.debug("Token decoded successfully", decoded);
      } catch (err) {
        console.error("Invalid token", err);
        setError("Failed to decode token. Please log in again.");
        setSnackbarMessage("Failed to decode token. Please log in again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } else {
      console.error("No token found");
      setError("User is not authenticated. Please log in.");
      setSnackbarMessage("User is not authenticated. Please log in.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, []);

  // Fetch clubs the user follows.
  useEffect(() => {
    if (!token) return;
    const fetchClubs = async () => {
      try {
        console.debug("Fetching clubs for the user...");
        const response = await fetch(
          `http://43.205.202.255:5000/student/clubs/${studentEmail}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch clubs: ${response.status}`);
        }
        const data = await response.json();
        console.debug("Clubs fetched successfully", data);
        setClubs(data.clubs || []);
      } catch (error) {
        console.error("Error fetching clubs:", error);
        setError("Failed to load clubs.");
        setSnackbarMessage("Failed to load clubs.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };
    fetchClubs();
  }, [token, studentEmail]);

  // Fetch events from all clubs the user is part of.
  useEffect(() => {
    if (!token || clubs.length === 0) return;
    const fetchAllEvents = async () => {
      try {
        console.debug("Fetching events from all clubs...");
        const allEvents = [];
        for (let club of clubs) {
          const response = await fetch(
            `http://43.205.202.255:5000/event/get_events?club_id=${club}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok)
            throw new Error(`Failed to fetch events for ${club}`);
          const data = await response.json();
          console.debug(`Events for club ${club}:`, data);
          if (data.events && Array.isArray(data.events)) {
            allEvents.push(...data.events);
            // Extract images for trending section.
            const images = data.events
              .map((event) => getImageUrl(event.images))
              .filter((img) => img !== "");
            setTrendingImages((prev) => [...prev, ...images]);

            // For each event, fetch its participant count.
            data.events.forEach((event) => {
              fetchParticipantCount(event.club_id, event.id);
            });
          }
        }
        setEvents(allEvents);
        console.debug("All events fetched successfully", allEvents);
      } catch (error) {
        console.error("Error fetching all events:", error);
        setError("Failed to load events.");
        setSnackbarMessage("Failed to load events.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
        console.debug("Event loading complete.");
      }
    };
    fetchAllEvents();
  }, [token, clubs]);

  // Cycle trending images every 4 seconds.
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

  // Fetch the participant count for an event.
  const fetchParticipantCount = async (clubIdParam, eventId) => {
    if (!token) return;
    try {
      console.debug(`Fetching participant count for event ${eventId}`);
      const response = await fetch(
        "http://43.205.202.255:5000/event/get_participant_count",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            club_id: clubIdParam,
            event_id: eventId,
          }),
        }
      );
      if (!response.ok)
        throw new Error(
          `Failed to fetch participant count: ${response.status}`
        );
      const data = await response.json();
      setParticipantCounts((prev) => ({
        ...prev,
        [eventId]: data.participant_count || 0,
      }));
      console.debug(`Participant count for event ${eventId}:`, data);
    } catch (error) {
      console.error("Error fetching participant count:", error);
      setSnackbarMessage("Error fetching participant count.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Handle "Yes" vote.
  const handleYesVote = async (eventItem) => {
    if (userVotes[eventItem.id] === "yes") {
      setSnackbarMessage("You are already participating in this event.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }
    try {
      console.debug(`Handling "Yes" vote for event ${eventItem.id}`);
      const response = await fetch(
        "http://43.205.202.255:5000/event/add_event_participant",
        {
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
        }
      );
      if (!response.ok)
        throw new Error(`Failed to add participant: ${response.status}`);
      const data = await response.json();
      setParticipantCounts((prev) => ({
        ...prev,
        [eventItem.id]: data.participant_count,
      }));
      setUserVotes((prev) => ({ ...prev, [eventItem.id]: "yes" }));
      setSnackbarMessage("You are now participating in the event.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding participant:", error);
      setSnackbarMessage(
        "Error updating your participation. Please try again."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Handle "No" vote.
  const handleNoVote = async (eventItem) => {
    if (userVotes[eventItem.id] !== "yes") {
      setSnackbarMessage("You are not currently participating in this event.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }
    try {
      console.debug(`Handling "No" vote for event ${eventItem.id}`);
      const response = await fetch(
        "http://43.205.202.255:5000/event/delete_participant",
        {
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
        }
      );
      if (!response.ok)
        throw new Error(`Failed to remove participant: ${response.status}`);
      const data = await response.json();
      setParticipantCounts((prev) => ({
        ...prev,
        [eventItem.id]: data.participant_count,
      }));
      setUserVotes((prev) => ({ ...prev, [eventItem.id]: "no" }));
      setSnackbarMessage("Your participation has been removed.");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting participant:", error);
      setSnackbarMessage(
        "Error updating your participation. Please try again."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // (Optional) Handle "Maybe" vote.
  const handleMaybeVote = (eventItem) => {
    setSnackbarMessage("Maybe functionality is not implemented yet.");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  // Helper to extract image URL.
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

  const todayDate = new Date().toDateString();
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.event_date);
    if (activeTab === "all") return true;
    if (activeTab === "today") return eventDate.toDateString() === todayDate;
    if (activeTab === "upcoming") return eventDate > new Date();
    if (activeTab === "past") return eventDate < new Date();
    return false;
  });

  return (
    <div className="view-events-container">
      <Sidebar />
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
          <FaUserCircle className="membership-avatar" size={30} />
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
          <h2>Popular Events</h2>
        </div>
        <div className="all-event-tabs">
          <span
            className={`event-tab ${activeTab === "all" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Events
          </span>
          <span
            className={`event-tab ${activeTab === "today" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("today")}
          >
            Today Events
          </span>
          <span
            className={`event-tab ${
              activeTab === "upcoming" ? "active-tab" : ""
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Events
          </span>
          <span
            className={`event-tab ${activeTab === "past" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("past")}
          >
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
                    {participantCounts[event.id] !== undefined
                      ? participantCounts[event.id]
                      : 0}
                  </p>
                  <div className="event-buttons">
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
                    <button
                      className="maybe-btn"
                      onClick={() => handleMaybeVote(event)}
                    >
                      Maybe
                    </button>
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
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ViewEvents;

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import "../CSS/ViewEvents.css";
import Sidebar from "../Components/SideBar";
import bannerImage from "../Images/bannerevent.png";
import {
  FaUsers,
  FaRegBell,
  FaSignOutAlt,
  FaRss,
  FaCalendarAlt,
  FaComment,
  FaListAlt,
} from "react-icons/fa";

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentEmail, setStudentEmail] = useState("");
  const [token, setToken] = useState(null);
  const [participantCounts, setParticipantCounts] = useState({});

  // Fetch and decode the JWT token, set token in state
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setStudentEmail(decoded.email);
        setToken(token); // Save token in state
      } catch (err) {
        console.error("Invalid token or failed to decode", err);
        setError("Failed to decode token. Please log in again.");
      }
    } else {
      console.error("No token found");
      setError("User is not authenticated. Please log in.");
    }
  }, []);

  // Fetch events only when token is available
  useEffect(() => {
    if (!token) return; // Don't fetch events if token is not available

    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "http://43.205.202.255:5000/event/get_events?club_id=club_sesa",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Pass token in the Authorization header
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.events && Array.isArray(data.events)) {
          setEvents(data.events);

          // Fetch participant count for each event
          data.events.forEach((event) => {
            fetchParticipantCount(event.club_id, event.id);
          });
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching events data:", error);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]); // Only fetch when token is available and changed

  const fetchParticipantCount = async (clubId, eventId) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const response = await fetch(
        "http://43.205.202.255:5000/event/get_participant_count",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Pass token in the Authorization header
          },
          body: JSON.stringify({
            club_id: clubId,
            event_id: eventId,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch participant count: ${response.status}`
        );
      }
      const data = await response.json();
      setParticipantCounts((prevCounts) => ({
        ...prevCounts,
        [eventId]: data.participant_count || 0,
      }));
    } catch (error) {
      console.error("Error fetching participant count:", error);
    }
  };

  const handleYesClick = async (eventId) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("Authorization token is missing.");
      return;
    }

    const decoded = jwtDecode(token);
    const studentEmail = decoded.email;

    const event = events.find((event) => event.id === eventId);
    if (!event) return; // If the event is not found, do nothing.

    const clubId = event.club_id; // Assuming the club ID is stored in the event data

    try {
      // Send the request to add the participant to the backend
      const response = await fetch(
        "http://43.205.202.255:5000/event/add_participant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
          body: JSON.stringify({
            club_id: clubId,
            event_id: eventId,
            student_email: studentEmail,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add participant: ${response.status}`);
      }

      // Refetch participant count from the backend after adding the participant
      await fetchParticipantCount(clubId, eventId);

      const data = await response.json();
      console.log("Participant added successfully:", data);
    } catch (error) {
      console.error("Error adding participant:", error);
    }
  };

  const handleNoClick = async (eventId) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("Authorization token is missing.");
      return;
    }

    const decoded = jwtDecode(token);
    const studentEmail = decoded.email;

    const event = events.find((event) => event.id === eventId);
    if (!event) return; // If the event is not found, do nothing.

    const clubId = event.club_id; // Assuming the club ID is stored in the event data

    try {
      // Send the request to remove the participant from the backend
      const response = await fetch(
        "http://43.205.202.255:5000/event/delete_participant",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
          body: JSON.stringify({
            club_id: clubId,
            event_id: eventId,
            student_email: studentEmail,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to remove participant: ${response.status}`);
      }

      // Refetch participant count from the backend after removing the participant
      await fetchParticipantCount(clubId, eventId);

      const data = await response.json();
      console.log("Participant removed successfully:", data);
    } catch (error) {
      console.error("Error removing participant:", error);
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

  return (
    <div className="view-events-container">
      <Sidebar />
      <main className="main-content">
        <header className="banner">
          <img src={bannerImage} alt="Events Banner" className="banner-image" />
        </header>
        <div className="events-header">
          <h2>Popular Events</h2>
        </div>
        {loading ? (
          <div>Loading events...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : events.length > 0 ? (
          <div className="events-grid">
            {events.map((event) => {
              const imageUrl = getImageUrl(event.images);
              const participantCount = participantCounts[event.id] || 0; // Get participant count dynamically
              return (
                <div className="event-card" key={event.id}>
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={event.event_name}
                      className="event-image"
                    />
                  )}
                  <div className="event-info">
                    <h3 className="event-title">{event.event_name}</h3>
                    <p className="event-date">
                      {new Date(event.event_date).toDateString()}
                    </p>
                    <p className="event-location">{event.venue}</p>
                    <p className="event-participants">
                      <strong>Participants:</strong> {participantCount}
                    </p>
                    <div className="button-group">
                      <button
                        className="yes-btn"
                        onClick={() => handleYesClick(event.id)}
                      >
                        Yes
                      </button>
                      <button
                        className="no-btn"
                        onClick={() => handleNoClick(event.id)}
                      >
                        No
                      </button>
                      <button className="maybe-btn">Maybe</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-events-message">
            No events available at the moment.
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewEvents;

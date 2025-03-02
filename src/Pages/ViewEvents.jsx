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

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setStudentEmail(decoded.email);
      } catch (err) {
        console.error("Invalid token or failed to decode", err);
        setError("Failed to decode token. Please log in again.");
      }
    } else {
      console.error("No token found");
      setError("User is not authenticated. Please log in.");
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "http://43.205.202.255:5000/event/get_events?club_id=club_sesa"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.events && Array.isArray(data.events)) {
          setEvents(data.events);
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
  }, []);

  const handleYesClick = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId
          ? { ...event, participant_count: (event.participant_count || 0) + 1 }
          : event
      )
    );
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
                      <strong>Participants:</strong>{" "}
                      {event.participant_count || 0}
                    </p>
                    <div className="button-group">
                      <button
                        className="yes-btn"
                        onClick={() => handleYesClick(event.id)}>
                        Yes
                      </button>
                      <button className="no-btn">No</button>
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

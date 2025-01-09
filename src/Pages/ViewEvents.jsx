import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../CSS/ViewEvents.css";
import logo1short from "../Images/logo1short.png";
import bannerImage from "../Images/events-banner.jpg";
import Gavelevent1 from "../Images/Gavelevent1.jpg";
import Gavelevent2 from "../Images/Gavelevent2.jpg";
import Gavelevent3 from "../Images/Gavelevent3.jpg";
import sesaevent1 from "../Images/sesaevent1.jpg";
import sesaevent2 from "../Images/sesaevent2.jpg";
import juniorhack from "../Images/juniorhack.jpg";
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
  // Sample events data
  const eventsData = [
    {
      id: 1,
      title: "Weekly educational meetings",
      date: "Today · 4:00 PM + 241 more",
      location: "G3 Hall, Faculty of Commerce and Management Studies",
      image: Gavelevent3,
      participants: 32,
    },
    {
      id: 2,
      title: "INCEPTIO 5.0",
      date: "Thu, Jan 16 · 5:45 PM",
      location: "A7 201 Building",
      image: sesaevent1,
      participants: 45,
    },
    {
      id: 3,
      title: "The Annual General Meeting",
      date: "Sat, Jan 18 · 10:00 AM",
      location:
        "G3 Hall, Faculty of Commerce and Management Studies, University of Kelaniya",
      image: Gavelevent1,
      participants: 50,
    },
    {
      id: 4,
      title: "Junior Hack",
      date: "Sun, Jan 19 · 11:00 AM",
      location: "A7 201 Building",
      image: sesaevent2,
      participants: 20,
    },
    {
      id: 5,
      title: "Inter school best speaker",
      date: "Sun, Jan 19 · 11:00 AM",
      location:
        "G3 Hall, Faculty of Commerce and Management Studies, University of Kelaniya",
      image: Gavelevent2,
      participants: 28,
    },
    {
      id: 6,
      title: "Curator's Tour with Sandev Handy",
      date: "Sun, Jan 19 · 11:00 AM",
      location: "Museum of Modern and Contemporary Art",
      image: juniorhack,
      participants: 40,
    },
  ];

  // State to store updated participants count
  const [events, setEvents] = useState(eventsData);

  const handleYesClick = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId
          ? { ...event, participants: event.participants + 1 }
          : event
      )
    );
  };

  return (
    <div className="view-events-container">
      <aside className="sidebar">
        <Link to="/home">
          <img src={logo1short} alt="Nexus Logo" className="logo" />
        </Link>
        <ul className="menu">
          <li>
            <FaUsers /> View Clubs
          </li>
          <li>
            <FaRss /> View Feed
          </li>
          <li className="active">
            <FaCalendarAlt /> View Events
          </li>
          <li>
            <FaComment /> Communication
          </li>
          <li>
            <FaListAlt /> Purchase Merchandise
          </li>
          <li>
            <div className="notifications">
              <FaRegBell />
              Notification
            </div>
          </li>
        </ul>
        <button className="logout">
          <FaSignOutAlt /> Logout
        </button>
      </aside>
      <main className="main-content">
        <header className="banner">
          <img src={bannerImage} alt="Events Banner" className="banner-image" />
          {/* <div className="banner-text">
            <h1>Exciting Club Events Await!</h1>
            <p>Join us for educational meetings, workshops, and hackathons!</p>
          </div> */}
        </header>
        <div className="events-header">
          <h2>Popular Events</h2>
        </div>
        <div className="events-grid">
          {events.map((event) => (
            <div className="event-card" key={event.id}>
              <img
                src={event.image}
                alt={event.title}
                className="event-image"
              />
              <div className="event-info">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-date">{event.date}</p>
                <p className="event-location">{event.location}</p>
                <p className="event-participants">
                  <strong>Participants:</strong> {event.participants}
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
          ))}
        </div>
      </main>
    </div>
  );
};

export default ViewEvents;

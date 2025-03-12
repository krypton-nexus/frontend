import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../CSS/AddEvent.css";
import Sidebar from "../Components/SideBar";
import bannerImage from "../Images/events-banner.jpg";

const AddEvent = () => {
  const [eventData, setEventData] = useState({
    event_name: "",
    event_date: "",
    event_time: "",
    venue: "",
    event_description: "",
    mode: "physical",
    images: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://43.205.202.255:5000/event/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        alert("Event created successfully!");
        setEventData({
          event_name: "",
          event_date: "",
          event_time: "",
          venue: "",
          event_description: "",
          mode: "physical",
          images: "",
        });
      } else {
        alert("Failed to create event. Please try again.");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="view-events-container">
      {/* <AdminSidebar /> */}
      <main className="main-content">
        {/* <header className="banner">
          <img src={bannerImage} alt="Events Banner" className="banner-image" />
        </header> */}
        <div className="events-header">
          <h2>Create a New Event</h2>
        </div>

        <form className="event-form" onSubmit={handleSubmit}>
          <label>
            Event Name:
            <input
              type="text"
              name="event_name"
              value={eventData.event_name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Event Date:
            <input
              type="date"
              name="event_date"
              value={eventData.event_date}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Event Time:
            <input
              type="time"
              name="event_time"
              value={eventData.event_time}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Venue:
            <input
              type="text"
              name="venue"
              value={eventData.venue}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Event Description:
            <textarea
              name="event_description"
              value={eventData.event_description}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Mode:
            <select name="mode" value={eventData.mode} onChange={handleChange}>
              <option value="physical">Physical</option>
              <option value="virtual">Virtual</option>
            </select>
          </label>

          <label>
            Event Images (URLs):
            <input
              type="text"
              name="images"
              value={eventData.images}
              onChange={handleChange}
            />
          </label>

          <button type="submit" className="create-event-btn">
            Create Event
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddEvent;

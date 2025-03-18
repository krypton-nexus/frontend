import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../CSS/AddEvent.css";
import AdminSidebar from "../Components/AdminSidebar";
import bannerImage from "../Images/events-banner.jpg";

const AddEvent = () => {
  const [eventData, setEventData] = useState({
    event_name: "",
    event_date: "",
    event_time: "",
    venue: "",
    event_description: "",
    mode: "physical",
    category: "Education", // Default category
    imageFile: null, // For storing the selected image file
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventData((prevData) => ({
        ...prevData,
        imageFile: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("event_name", eventData.event_name);
    formData.append("event_date", eventData.event_date);
    formData.append("event_time", eventData.event_time);
    formData.append("venue", eventData.venue);
    formData.append("event_description", eventData.event_description);
    formData.append("mode", eventData.mode);
    formData.append("category", eventData.category);
    if (eventData.imageFile) {
      formData.append("image", eventData.imageFile);
    }

    try {
      const response = await fetch("http://43.205.202.255:5000/event/create", {
        method: "POST",
        body: formData, // Send as FormData
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
          category: "Education",
          imageFile: null,
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
      <AdminSidebar />
      <main className="main-content">
        <div className="events-header">
          <h2>Create a New Event</h2>
        </div>

        <form
          className="event-form"
          onSubmit={handleSubmit}
          encType="multipart/form-data">
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
            Category:
            <select
              name="category"
              value={eventData.category}
              onChange={handleChange}>
              <option value="Education">Education</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Networking">Networking</option>
              <option value="Volunteering">Volunteering</option>
            </select>
          </label>

          <label>
            Upload Event Image:
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
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

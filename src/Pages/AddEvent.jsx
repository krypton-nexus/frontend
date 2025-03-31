import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AWS from "aws-sdk";
import "../CSS/AddEvent.css";
import AdminSidebar from "../Components/AdminSidebar";

AWS.config.update({
  accessKeyId: "AKIAUQ4L3D64ZBVKU2W4",
  secretAccessKey: "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",
  region: "ap-south-1",
});

const s3 = new AWS.S3();

const AddEvent = () => {
  const [eventData, setEventData] = useState({
    club_id: "club_gavel",
    event_name: "",
    event_date: "",
    event_time: "",
    venue: "",
    event_description: "",
    mode: "physical",
    category: "Education",
    imageFile: null,
    imageUrl: "",
    ispublic: "1",
    meeting_note: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const folderPath = `Gavel/Event`;

    const params = {
      Bucket: "nexus-se-bucket",
      Key: `${folderPath}/${fileName}`,
      Body: file,
      ContentType: file.type,
    };

    try {
      await s3.upload(params).promise();
      const imageUrl = `https://nexus-se-bucket.s3.ap-south-1.amazonaws.com/${folderPath}/${fileName}`;
      setEventData((prev) => ({
        ...prev,
        imageUrl,
        imageFile: file,
      }));
      console.log("Image uploaded to:", imageUrl);
    } catch (error) {
      console.error("S3 Upload Error:", error);
      alert("Failed to upload image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if imageUrl is populated
    if (!eventData.imageUrl) {
      alert("Please upload an image before submitting.");
      return;
    }

    const payload = {
      club_id: eventData.club_id,
      event_name: eventData.event_name,
      event_date: eventData.event_date,
      event_time: eventData.event_time,
      venue: eventData.venue,
      mode: eventData.mode,
      event_description: eventData.event_description,
      images: eventData.imageUrl, // imageUrl is appended here
      category: eventData.category,
      ispublic: eventData.ispublic,
    };
    try {
      const response = await fetch("http://43.205.202.255:5000/event/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_access_token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Event created successfully!");
        setEventData({
          club_id: "club_gavel",
          event_name: "",
          event_date: "",
          event_time: "",
          venue: "",
          event_description: "",
          mode: "physical",
          category: "Education",
          imageFile: null,
          imageUrl: "",
          ispublic: "1",
          meeting_note: "",
        });
      } else {
        const err = await response.json();
        alert(`Event creation failed: ${err.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Create Event Error:", error);
      alert("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="view-events-container">
      <AdminSidebar />
      <main className="main-content">
        <button
          className="close-event-btn"
          onClick={() => navigate("/adminevent")}
        >
          ✖
        </button>
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
            Category:
            <select
              name="category"
              value={eventData.category}
              onChange={handleChange}
            >
              <option value="Education">Education</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Networking">Networking</option>
              <option value="Volunteering">Volunteering</option>
            </select>
          </label>

          <label>
            Upload Event Image:
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>

          <label className="toggle-switch-label">
            Visibility:
            <div className="toggle-row">
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id="visibilityToggle"
                  checked={eventData.ispublic === "1"}
                  onChange={(e) =>
                    setEventData((prev) => ({
                      ...prev,
                      ispublic: e.target.checked ? "1" : "0",
                    }))
                  }
                />
                <span className="slider round"></span>
              </div>
              <span className="toggle-status">
                {eventData.ispublic === "0" ? "Private" : "Public"}
              </span>
            </div>
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

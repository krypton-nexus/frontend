import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AWS from "aws-sdk";
import "../CSS/AddEvent.css";
import AdminSidebar from "../Components/AdminSidebar";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { jwtDecode } from "jwt-decode";

const BASE_URL = process.env.REACT_APP_BASE_URL;

AWS.config.update({
  accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_S3_REGION,
});
const s3 = new AWS.S3();

const AddEvent = () => {
  const [eventData, setEventData] = useState({
    club_id: "",
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

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Snackbar close handler.
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

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

    // Get club_id from token in localStorage
    let rawClubId = "";
    try {
      const token = localStorage.getItem("admin_access_token");
      if (token) {
      const decoded = jwtDecode(token);
      rawClubId = decoded?.club_id || "";
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
    }

    const folderName = rawClubId
      .replace(/^club_/, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .replace(/^\w/, (c) => c.toUpperCase());

    const fileName = `${timestamp}-${file.name}`;
    const folderPath = `${folderName}/Event`;

    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
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
      setSnackbarMessage("Image uploaded successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("S3 Upload Error:", error);
      setSnackbarMessage("Failed to upload image.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if imageUrl is populated
    if (!eventData.imageUrl) {
      setSnackbarMessage("Please upload an image before submitting.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    const payload = {
      club_id: jwtDecode(localStorage.getItem("admin_access_token")).club_id,
      event_name: eventData.event_name,
      event_date: eventData.event_date,
      event_time: eventData.event_time,
      venue: eventData.venue,
      mode: eventData.mode,
      event_description: eventData.event_description,
      images: eventData.imageUrl,
      category: eventData.category,
      ispublic: eventData.ispublic,
    };

    try {
      const response = await fetch(`${BASE_URL}/event/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_access_token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSnackbarMessage("Event created successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setEventData({
          club_id: "",
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
        setSnackbarMessage(
          `Event creation failed: ${err.error || "Unknown error"}`
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Create Event Error:", error);
      setSnackbarMessage("Something went wrong. Try again later.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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

export default AddEvent;

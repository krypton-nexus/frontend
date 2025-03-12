import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../CSS/ClubCard.css";

const ClubCard = ({ club }) => {
  const navigate = useNavigate();
  const [studentEmail, setStudentEmail] = useState(null);
  const [clubDescription, setClubDescription] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  const getStudentEmailFromToken = useCallback(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.email;
      } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
      }
    }
    return null;
  }, []);

  useEffect(() => {
    const email = getStudentEmailFromToken();
    setStudentEmail(email);

    if (club.additional_information) {
      const sentences = club.additional_information
        .split(".")
        .filter((sentence) => sentence.trim() !== "");
      setClubDescription(sentences);
    }
  }, [club, getStudentEmailFromToken]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSentenceIndex((prevIndex) =>
        prevIndex < clubDescription.length - 1 ? prevIndex + 1 : 0
      );
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentSentenceIndex, clubDescription.length]);

  const isTokenValid = (token) => {
    if (!token) return false;

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp >= currentTime;
    } catch (error) {
      return false;
    }
  };

  const handleJoinNow = async () => {
    const token = localStorage.getItem("access_token");
    if (!token || !isTokenValid(token)) {
      alert("Authorization token is missing or expired. Please log in again.");
      return;
    }

    if (!studentEmail) {
      alert("Student email is missing. Please log in again.");
      return;
    }

    console.log(studentEmail, club.id);

    try {
      const response = await fetch(
        "http://43.205.202.255:5000/membership/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            student_email: studentEmail,
            club_id: club.id,
          }),
        }
      );

      if (response.ok) {
        const successMessage = await response.json();
        alert(
          `Success: ${
            successMessage.message || "Membership request sent successfully!"
          }`
        );

        const notificationResponse = await fetch(
          "http://43.205.202.255:5000/notification_admin/add",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              admin_email: club.admin_email,
              message: `${studentEmail} has requested to join your club: ${club.title}. Please review and approve or reject the request.`,
            }),
          }
        );

        if (notificationResponse.ok) {
          const notificationMessage = await notificationResponse.json();
          alert(
            `Notification sent to the admin: ${notificationMessage.message}`
          );
        } else {
          const notificationError = await notificationResponse.json();
          alert(
            `Error sending notification: ${
              notificationError.message || "Unknown error"
            }`
          );
        }
      } else {
        const errorData = await response.json();
        alert(
          `Error: ${errorData.message || "Failed to send request."} (Status: ${
            response.status
          })`
        );
      }
    } catch (error) {
      console.error("Error sending membership request:", error);
      alert(`An error occurred: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div
      className="club-card"
      style={{
        backgroundImage: `url(${club.images_url?.logo || ""})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "280px",
      }}
    >
      <div className="card-overlay">
        <div className="club-title">{club.title || "Club Name"}</div>
        <div className="buttons">
          <button
            className="view-club"
            onClick={() => navigate(`/club/${club.id}`)}
          >
            View Club
          </button>
          <button className="join-now" onClick={handleJoinNow}>
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;

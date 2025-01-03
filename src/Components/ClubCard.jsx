import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../CSS/ClubCard.css";
import { Card } from "@mui/material";

const ClubCard = ({ club }) => {
  const navigate = useNavigate();

  // State to store student's email
  const [studentEmail, setStudentEmail] = useState(null);

  // State to store club's description sentences
  const [clubDescription, setClubDescription] = useState([]);

  // State to manage the current sentence index for description
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  // Fetch student email from access token once when component mounts
  useEffect(() => {
    const getStudentEmailFromToken = () => {
      const token = localStorage.getItem("access_token"); // Assuming access_token is stored in localStorage
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          return decodedToken.email; // Assuming the email is part of the token's payload
        } catch (error) {
          console.error("Failed to decode token:", error);
          return null;
        }
      }
      return null;
    };

    const email = getStudentEmailFromToken();
    setStudentEmail(email); // Store the email in the state
    console.log(email);
    

    if (club.additional_information) {
      const sentences = club.additional_information
        .split(".")
        .filter((sentence) => sentence.trim() !== ""); // Filter out empty sentences
      setClubDescription(sentences); // Store the description sentences in the state
    }
  }, [club]); // Runs only once when the component mounts or when the `club` prop changes

  // Change sentence every 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSentenceIndex((prevIndex) =>
        prevIndex < clubDescription.length - 1 ? prevIndex + 1 : 0
      );
    }, 5000);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [currentSentenceIndex, clubDescription.length]); // Run this only when the currentSentenceIndex or clubDescription changes

  // Function to handle the "Join Now" button click
  const handleJoinNow = async () => {
    if (!studentEmail) {
      alert("You need to log in to join the club.");
      return;
    }

    // Log the request data to check the values
    const requestData = {
      student_email: studentEmail, // Using the email from the access token
      club_id: club.id,
    };

    console.log(
      "Sending membership request with the following data:",
      requestData
    );

    try {
      // Step 1: Add membership request
      const response = await fetch(
        "http://43.205.202.255:5000/membership/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_email: studentEmail, // Using the email from the access token
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

        // Step 2: Send a notification to the respective admin for approval/rejection
        const notificationResponse = await fetch(
          "http://43.205.202.255:5000/notification_admin/add",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              admin_email: club.admin_email, // Assuming club has an admin_email property
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

  const displayedText =
    clubDescription[currentSentenceIndex] || "No description available.";

  return (
    <div
      className="club-card"
      style={{
        backgroundImage: `url(${
          club.images_url["logo"] || "/placeholder-image.jpg"
        })`,
      }}
    >
      <div className="card-overlay">
        <div className="club-title">{club.title || "Club Name"}</div>
        <p className="club-description">{displayedText}</p>
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
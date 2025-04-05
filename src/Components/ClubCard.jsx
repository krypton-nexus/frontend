import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../CSS/ClubCard.css";

// Snackbar component for temporary notifications
const Snackbar = ({ message, type, open, onClose }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  const backgroundColor =
    type === "error"
      ? "#f44336"
      : type === "success"
      ? "#4CAF50"
      : type === "info"
      ? "#2196F3"
      : "#333";

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor,
        color: "#fff",
        padding: "16px 24px",
        borderRadius: "4px",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
        zIndex: 10000,
      }}
    >
      {message}
    </div>
  );
};

// Helper to perform API calls
const apiCall = async (url, token, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return response;
};

const ClubCard = ({ club }) => {
  const navigate = useNavigate();
  const [studentEmail, setStudentEmail] = useState(null);
  const [clubDescription, setClubDescription] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "info",
  });
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);

  // Show snackbar message
  const showSnackbar = (message, type = "info") => {
    setSnackbar({ open: true, message, type });
  };

  // Decode token to get student email
  const getStudentEmailFromToken = useCallback(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.email;
      } catch (error) {
        console.error("Failed to decode token:", error);
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
      setCurrentSentenceIndex((prev) =>
        prev < clubDescription.length - 1 ? prev + 1 : 0
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

  // Send admin notification separately
  const sendAdminNotification = async (token) => {
    const notifUrl = "http://43.205.202.255:5000/notification_admin/add";
    const notifBody = {
      admin_email: club.admin_email,
      message: `${studentEmail} has requested to join your club: ${club.title}. Please review and approve or reject the request.`,
    };
    return await apiCall(notifUrl, token, notifBody);
  };

  const handleJoinNow = async () => {
    if (isRequestInProgress) return;
    const token = localStorage.getItem("access_token");
    if (!token || !isTokenValid(token)) {
      showSnackbar(
        "Authorization token is missing or expired. Please log in again.",
        "error"
      );
      return;
    }
    if (!studentEmail) {
      showSnackbar("Student email is missing. Please log in again.", "error");
      return;
    }

    setIsRequestInProgress(true);
    try {
      const membershipUrl = "http://43.205.202.255:5000/membership/add";
      const membershipBody = { student_email: studentEmail, club_id: club.id };
      const response = await apiCall(membershipUrl, token, membershipBody);

      if (response.ok) {
        const successData = await response.json();          
        if (successData.message === "Current status: Pending") {
          showSnackbar(
            "Your membership request is already pending approval.",
            "info"
          );
        } else if (successData.message === "Current status: Approved") {
          showSnackbar("You are already a member of this club.", "info");
        } else {
          showSnackbar(
            "Membership request processed successfully. Please wait for admin approval.",
            "success"
          );
        }
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.message ||
          "Failed to send membership request. Please try again later.";
        showSnackbar(errorMessage, "error");
      }
    } catch (error) {
      console.error("Error sending membership request:", error);
      showSnackbar(
        `An error occurred: ${error.message || "Unknown error"}`,
        "error"
      );
    } finally {
      setIsRequestInProgress(false);
    }
  };

  return (
    <>
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
            <button
              className="join-now"
              onClick={handleJoinNow}
              disabled={isRequestInProgress}
            >
              {isRequestInProgress ? "Processing..." : "Join Now"}
            </button>
          </div>
        </div>
      </div>
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default ClubCard;

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../CSS/ClubCard.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Snackbar = ({ message, type = "info", open, onClose }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  const backgroundColor =
    {
      error: "#f44336",
      success: "#4CAF50",
      info: "#2196F3",
    }[type] || "#333";

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
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  );
};

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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "info",
  });
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  const token = localStorage.getItem("access_token");

  const studentEmail = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode(token)?.email;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  }, [token]);

  const isTokenValid = useMemo(() => {
    if (!token) return false;
    try {
      const { exp } = jwtDecode(token);
      return exp >= Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }, [token]);

  const showSnackbar = (message, type = "info") => {
    setSnackbar({ open: true, message, type });
  };

  const clubDescription = useMemo(() => {
    return club.additional_information
      ? club.additional_information.split(".").filter((s) => s.trim() !== "")
      : [];
  }, [club.additional_information]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSentenceIndex((prev) =>
        prev < clubDescription.length - 1 ? prev + 1 : 0
      );
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentSentenceIndex, clubDescription]);

  const sendAdminNotification = async () => {
    const notifUrl = `${BASE_URL}/notification_admin/add`;
    const notifBody = {
      admin_email: club.admin_email,
      message: `${studentEmail} has requested to join your club: ${club.title}. Please review and approve or reject the request.`,
    };
    return await apiCall(notifUrl, token, notifBody);
  };

  const handleJoinNow = async () => {
    if (isRequestInProgress) return;

    if (!token || !isTokenValid) {
      return showSnackbar(
        "Authorization token is missing or expired. Please log in again.",
        "error"
      );
    }

    if (!studentEmail) {
      return showSnackbar(
        "Student email not found. Please log in again.",
        "error"
      );
    }

    setIsRequestInProgress(true);
    try {
      const membershipUrl = `${BASE_URL}/membership/add`;
      const membershipBody = { student_email: studentEmail, club_id: club.id };
      const response = await apiCall(membershipUrl, token, membershipBody);

      if (response.ok) {
        const result = await response.json();
        const msg = result.message;
        if (msg === "Current status: Pending") {
          showSnackbar(
            "Your membership request is already pending approval.",
            "info"
          );
        } else if (msg === "Current status: Approved") {
          showSnackbar("You are already a member of this club.", "info");
        } else {
          await sendAdminNotification();
          showSnackbar(
            "Membership request sent. Awaiting admin approval.",
            "success"
          );
        }
      } else {
        const errData = await response.json();
        const errMsg = errData.message || "Failed to send membership request.";
        showSnackbar(errMsg, "error");
      }
    } catch (error) {
      console.error("Membership Error:", error);
      showSnackbar("An unexpected error occurred. Please try again.", "error");
    } finally {
      setIsRequestInProgress(false);
    }
  };

  return (
    <>
      <div
        className="club-card"
        style={{
          backgroundImage: club.images_url?.logo
            ? `url(${club.images_url.logo})`
            : undefined,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          height: "280px",
        }}
        aria-label={`Club card for ${club.title}`}
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
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
};

export default ClubCard;

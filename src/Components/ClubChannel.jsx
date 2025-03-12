import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../CSS/ClubChannel.css";

const ClubChannel = () => {
  const { clubId } = useParams(); // Get club ID from URL
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Please log in to access the communication channel.");
        navigate("/login"); // Redirect to login page
        return false;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds
        if (decoded.exp < currentTime) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("access_token"); // Clear expired token
          navigate("/login"); // Redirect to login
          return false;
        }

        setUserEmail(decoded.email);
        return true;
      } catch (error) {
        console.error("Invalid token:", error);
        alert("Invalid session. Please log in again.");
        localStorage.removeItem("access_token");
        navigate("/login");
        return false;
      }
    };

    if (!checkTokenValidity()) {
      setLoading(false);
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (!userEmail) return;
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const verifyMembership = async () => {
      try {
        const membershipResponse = await fetch(
          `http://43.205.202.255:5000/membership/list?club_id=${clubId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!membershipResponse.ok) {
          console.error(
            "Failed to verify membership:",
            membershipResponse.status
          );
          setLoading(false);
          return;
        }

        const membersData = await membershipResponse.json();
        const membersEmails = membersData.memberships.map(
          (member) => member.student_email
        );
        setIsAuthorized(membersEmails.includes(userEmail));
      } catch (error) {
        console.error("Error verifying membership:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyMembership();
  }, [clubId, userEmail]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      alert("Message cannot be empty!");
      return;
    }
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("You need to log in to send a message.");
      navigate("/login");
      return;
    }
  };

  if (loading) {
    return (
      <div className="club-channel-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="club-channel-container">
        <h2>Unauthorized</h2>
        <p>You are not authorized to access this club's channel.</p>
      </div>
    );
  }

  return (
    <div className="club-channel-container">
      <h2>Club Communication Channel</h2>
      <div className="messages-container">
        <p>Messages are no longer being fetched from the server.</p>
      </div>
      <div className="message-input-container">
        <textarea
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ClubChannel;

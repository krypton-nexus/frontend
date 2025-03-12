import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Messages from "./Messages";
import MessageForm from "./MessageForm";
import "../CSS/CommunicationChannel.css";

const CommunicationChannel = ({ isOpen, onClose }) => {
  const [clubs, setClubs] = useState([]);
  const [userClubs, setUserClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        setUserEmail(decoded.email);

        // Fetch user clubs with Authorization token
        const membershipRes = await fetch(
          `http://43.205.202.255:5000/student/clubs/${decoded.email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Pass token in the Authorization header
            },
          }
        );
        const membershipData = await membershipRes.json();
        setUserClubs(membershipData.clubs || []);

        // Fetch all clubs with Authorization token
        const clubsRes = await fetch("http://43.205.202.255:5000/club/list", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Pass token in the Authorization header
          },
        });
        const clubsData = await clubsRes.json();
        setClubs(clubsData.clubs || []);

        // Set default selected club if available
        if (clubsData.clubs.length > 0) {
          setSelectedClubId(clubsData.clubs[0].id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []); // Runs only once when the component is mounted

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>
        <h2>Communication Channel</h2>

        {isLoading ? (
          <div className="loading-container">
            <p className="loading-text">Loading...</p>
          </div>
        ) : (
          <>
            <div className="tabs">
              {clubs.map((club) => (
                <div
                  key={club.id}
                  className={`tab ${
                    club.id === selectedClubId ? "active" : ""
                  }`}
                  onClick={() => setSelectedClubId(club.id)}
                >
                  {club.title}
                </div>
              ))}
            </div>

            <div className="messages-section">
              {selectedClubId && userClubs.includes(selectedClubId) ? (
                <>
                  <Messages clubId={selectedClubId} />
                  <MessageForm clubId={selectedClubId} userEmail={userEmail} />
                </>
              ) : (
                <p>You must be a member of this club to access messages.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommunicationChannel;

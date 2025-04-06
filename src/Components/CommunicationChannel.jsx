import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Messages from "./Messages";
import MessageForm from "./MessageForm";
import "../CSS/CommunicationChannel.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

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

        const [membershipRes, clubsRes] = await Promise.all([
          fetch(`${BASE_URL}/student/clubs/${decoded.email}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${BASE_URL}/club/list`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const membershipData = await membershipRes.json();
        const clubsData = await clubsRes.json();

        const userClubIds = membershipData.clubs || [];
        setUserClubs(userClubIds);
        setClubs(clubsData.clubs || []);

        const firstUserClub = clubsData.clubs?.find((c) =>
          userClubIds.includes(c.id)
        );
        setSelectedClubId(
          firstUserClub?.id || clubsData.clubs?.[0]?.id || null
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  if (!isOpen) return null;

  const isUserInSelectedClub = userClubs.includes(selectedClubId);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose} aria-label="Close">
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
              {selectedClubId && isUserInSelectedClub ? (
                <>
                  <Messages clubId={selectedClubId} />
                  <MessageForm clubId={selectedClubId} userEmail={userEmail} />
                </>
              ) : (
                <p className="not-authorized-message">
                  You must be a member of this club to access messages.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommunicationChannel;

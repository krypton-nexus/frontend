import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import "../CSS/ViewEvents.css";
import Messages from "../Components/Messages";
import MessageForm from "../Components/MessageForm";
import Sidebar from "../Components/SideBar";
import bannerImage from "../Images/bannerevent.png";
import "../CSS/CommunicationChannel.css";
import {
  FaUsers,
  FaRegBell,
  FaSignOutAlt,
  FaRss,
  FaCalendarAlt,
  FaComment,
  FaListAlt,
} from "react-icons/fa";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Communication = ({ isOpen = true, onClose = () => {} }) => {
  const [clubs, setClubs] = useState([]);
  const [userClubs, setUserClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to get the token and decode it
  const getToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return null;
    }

    try {
      const decoded = jwtDecode(token);
      return { token, decoded };
    } catch (error) {
      console.error("Invalid token or failed to decode", error);
      return null;
    }
  };

  // Initialize and fetch data
  useEffect(() => {
    const initializeData = async () => {
      const { token, decoded } = getToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      setUserEmail(decoded.email);

      try {
        // Fetch user clubs if token is valid
        const membershipRes = await fetch(
          `${BASE_URL}/student/clubs/${decoded.email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Add token in Authorization header
            },
          }
        );
        const membershipData = await membershipRes.json();
        setUserClubs(membershipData.clubs || []);

        // Fetch all clubs if token is valid
        const clubsRes = await fetch(`${BASE_URL}/club/list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add token in Authorization header
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
  }, []); // Empty dependency array means this will run only once on mount

  if (!isOpen) return null;

  return (
    <div className="view-events-container">
      <Sidebar />
      <main className="main-content">
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
                  onClick={() => setSelectedClubId(club.id)}>
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
                <div className="messages-section-error">
                  <h2>You must be a member of this club to access messages.</h2>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Communication;

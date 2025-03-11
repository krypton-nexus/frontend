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

const Communication = ({ isOpen = true, onClose = () => {} }) => {
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

        // Fetch user clubs
        const membershipRes = await fetch(
          `http://43.205.202.255:5000/student/clubs/${decoded.email}`
        );
        const membershipData = await membershipRes.json();
        setUserClubs(membershipData.clubs || []);

        // Fetch all clubs
        const clubsRes = await fetch("http://43.205.202.255:5000/club/list");
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
  }, []);

  if (!isOpen) return null;

  return (
    <div className="view-events-container">
      <Sidebar />
      <main className="main-content">
        {/* <header className="banner">
          <img src={bannerImage} alt="Events Banner" className="banner-image" />
        </header> */}
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
                <p>You must be a member of this club to access messages.</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Communication;

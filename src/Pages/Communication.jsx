import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../Components/SideBar";
import Messages from "../Components/Messages";
import MessageForm from "../Components/MessageForm";
import "../CSS/ViewEvents.css";
import "../CSS/CommunicationChannel.css";
import Skeleton from "@mui/material/Skeleton";

const Communication = ({ isOpen = true }) => {
  const [clubs, setClubs] = useState([]);
  const [userClubs, setUserClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const initializeData = async () => {
    if (!localStorage.getItem("access_token")) {
      return;
    }
    const decoded = jwtDecode(localStorage.getItem("access_token"));
    setUserEmail(decoded.email);

    try {
      const storedUserClubs =
        JSON.parse(localStorage.getItem("user_clubs")) || [];
      const storedAllClubs =
        JSON.parse(localStorage.getItem("all_clubs")) || [];

      setUserClubs(storedUserClubs);
      setClubs(storedAllClubs);

      if (storedAllClubs.length > 0) {
        setSelectedClubId(storedAllClubs[0].id);
      }
    } catch (error) {
      console.error("Error reading club data from localStorage:", error);
    } finally {
    }
  };

  useEffect(() => {
    initializeData();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="communication-container">
      <aside className="communication-sidebar">
        <Sidebar />
      </aside>
      <div className="communication-content">
        {/* Tabs */}
        <div className="communication-tabs">
          {clubs.map((club) => {
            const isActive = club.id === selectedClubId;
            const isMember = userClubs.includes(club.id);
            return (
              <div
                key={club.id}
                className={`tab ${isActive ? "active" : ""} ${
                  !isMember ? "not-member" : ""
                }`}
                onClick={() => setSelectedClubId(club.id)}
              >
                {club.title}
              </div>
            );
          })}
        </div>

        <div className="communication-messages-wrapper">
          {selectedClubId && (
            <Messages clubId={selectedClubId} userEmail={userEmail} />
          )}
        </div>

        <div className="communication-form-container">
          {selectedClubId && (
            <MessageForm clubId={selectedClubId} userEmail={userEmail} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Communication;

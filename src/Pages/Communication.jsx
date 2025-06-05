import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import Sidebar from "../Components/SideBar";
import Messages from "../Components/Messages";
import MessageForm from "../Components/MessageForm";
import { CircularProgress } from "@mui/material"; // <-- import spinner
import "../CSS/ViewEvents.css";
import "../CSS/CommunicationChannel.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Communication = ({ isOpen = true, onClose = () => {} }) => {
  const [clubs, setClubs] = useState([]);
  const [userClubs, setUserClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return { token, decoded };
    } catch (error) {
      console.error("Invalid token or failed to decode", error);
      return null;
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const tokenData = getToken();

      if (!tokenData) {
        setIsLoading(false);
        return;
      }

      const { token, decoded } = tokenData;

      setUserEmail(decoded.email);

      try {
        const membershipRes = await fetch(
          `${BASE_URL}/student/clubs/${decoded.email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const membershipData = await membershipRes.json();
        setUserClubs(membershipData.clubs || []);

        const clubsRes = await fetch(`${BASE_URL}/club/list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const clubsData = await clubsRes.json();
        setClubs(clubsData.clubs || []);

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
      <main
        className="main-content"
        style={{ position: "relative", minHeight: 400 }}
      >
        {isLoading ? (
          // Centered spinner during loading
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              minHeight: 300,
            }}
          >
            <CircularProgress />
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

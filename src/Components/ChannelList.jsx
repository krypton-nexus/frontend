import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../CSS/ChannelList.css"; 

const ClubList = () => {
  const [clubs, setClubs] = useState([]);
  const [userClubs, setUserClubs] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserEmail(decoded.email);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch("http://43.205.202.255:5000/club/list");
        if (response.ok) {
          const data = await response.json();
          setClubs(data.clubs || []);
        } else {
          console.error("Failed to fetch clubs:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };

    fetchClubs();
  }, []);

  useEffect(() => {
    if (!userEmail) return;
    const fetchUserClubs = async () => {
      try {
        const response = await fetch(
          `http://43.205.202.255:5000/student/clubs/${userEmail}`
        );
        if (response.ok) {
          const data = await response.json();
          setUserClubs(data.clubs || []);
        } else {
          console.error("Failed to fetch user's clubs:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user's clubs:", error);
      }
    };

    fetchUserClubs();
  }, [userEmail]);

  return (
    <div className="club-list-container">
      <h2>Club Channels</h2>
      <ul>
        {clubs.map((club) => {
          const isMember = userClubs.includes(club.id);
          return (
            <li key={club.id} className={isMember ? "member" : ""}>
              <Link to={`/club/${club.id}/channel`}>{club.title}</Link>
              {isMember && <span className="member-tag"> (Member)</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ClubList;

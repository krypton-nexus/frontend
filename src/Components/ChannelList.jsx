import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../CSS/ChannelList.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ClubList = () => {
  const [clubs, setClubs] = useState([]);
  const [userClubs, setUserClubs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const userEmail = decoded.email;

        const [clubsRes, userClubsRes] = await Promise.all([
          fetch(`${BASE_URL}/club/list`),
          fetch(`${BASE_URL}/student/clubs/${userEmail}`),
        ]);

        if (clubsRes.ok) {
          const clubsData = await clubsRes.json();
          setClubs(clubsData.clubs || []);
        }

        if (userClubsRes.ok) {
          const userClubsData = await userClubsRes.json();
          setUserClubs(userClubsData.clubs || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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

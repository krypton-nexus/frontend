import React, { useEffect, useState } from "react";
import "../CSS/ShowClubs.css";
import Sidebar from "./SideBar";
import ClubCard from "./ClubCard";

const ShowClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch("http://13.232.48.203:5000/club/list");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.clubs && Array.isArray(data.clubs)) {
          setClubs(data.clubs);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching clubs data:", error);
        setError("Failed to load clubs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  return (
    <div className="show-clubs-container">
      <Sidebar />
      <div className="main-content">
        <h1>Club List</h1>
        {loading ? (
          <div className="loading-message">Loading clubs...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="clubs">
            {clubs.length > 0 ? (
              clubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))
            ) : (
              <div className="no-clubs-message">No clubs available at the moment.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowClubs;

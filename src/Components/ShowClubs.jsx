import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "../CSS/ShowClubs.css";
import Sidebar from "./SideBar";
import ClubCard from "./ClubCard";
import { FaUserCircle, FaSearch } from "react-icons/fa";

const ShowClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentEmail, setStudentEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Decode JWT to get student email
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setStudentEmail(decoded.email);
      } catch (err) {
        console.error("Invalid token", err);
        setError("Failed to decode token. Please log in again.");
      }
    } else {
      setError("User is not authenticated. Please log in.");
    }
  }, []);

  // Fetch club list
  const fetchClubs = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Authorization token is missing. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://43.205.202.255:5000/club/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      if (Array.isArray(data.clubs)) {
        setClubs(data.clubs);
      } else {
        throw new Error("Invalid data format received.");
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
      setError("Failed to load clubs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentEmail) {
      fetchClubs();
    }
  }, [studentEmail]);

  // Filter clubs based on search query
  const filteredClubs = clubs.filter((club) =>
    club.name?.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="show-clubs-container">
      <Sidebar />
      <div className="main-content">
        {/* Header with search + avatar */}
        <div className="membership-header">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search Clubs..."
              className="membership-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            />
            <button className="search-icon" type="button">
              <FaSearch />
            </button>
          </div>
          <FaUserCircle className="membership-avatar" size={30} />
        </div>

        <hr className="section-divider" />
        <h1>Club List</h1>

        {/* Loading / Error / Data Display */}
        {loading ? (
          <div className="loading-message">Loading clubs...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="clubs">
            {filteredClubs.length > 0 ? (
              filteredClubs.map((club) => (
                <ClubCard
                  key={club.id}
                  club={club}
                  studentEmail={studentEmail}
                />
              ))
            ) : (
              <div className="no-clubs-message">
                No clubs found matching "<strong>{searchQuery}</strong>"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowClubs;

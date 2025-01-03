import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Correct import
import "../CSS/ShowClubs.css";
import Sidebar from "./SideBar";
import ClubCard from "./ClubCard";

const ShowClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentEmail, setStudentEmail] = useState("");

  // Decode the JWT and extract the email
  useEffect(() => {
    const token = localStorage.getItem("access_token"); // Replace with the appropriate storage mechanism
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token
        setStudentEmail(decoded.email); // Assuming the token contains an `email` field
      } catch (err) {
        console.error("Invalid token or failed to decode", err);
        setError("Failed to decode token. Please log in again.");
      }
    } else {
      console.error("No token found");
      setError("User is not authenticated. Please log in.");
    }
  }, []);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch("http://43.205.202.255:5000/club/list");
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
                <ClubCard
                  key={club.id}
                  club={club}
                  studentEmail={studentEmail}
                />
              ))
            ) : (
              <div className="no-clubs-message">
                No clubs available at the moment.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowClubs;
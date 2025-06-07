import React, { useEffect, useState, useMemo, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import Sidebar from "./SideBar";
import ClubCard from "./ClubCard";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import axios from "axios";
import "../CSS/ShowClubs.css";
import UserProfile from "./UserProfile";
import Skeleton from "@mui/material/Skeleton";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ShowClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentEmail, setStudentEmail] = useState("");
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Decode JWT token and set student email
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("User is not authenticated. Please log in.");
      setLoading(false);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem("access_token");
        setError("Session expired. Please log in again.");
        setLoading(false);
      } else {
        setStudentEmail(decoded.email);
      }
    } catch (err) {
      console.error("Invalid token", err);
      setError("Failed to decode token. Please log in again.");
      setLoading(false);
    }
  }, []);

  // Fetch user details after studentEmail is available
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("access_token");
      if (!token || !studentEmail) return;
      try {
        const response = await axios.get(
          `${BASE_URL}/student/${studentEmail}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data) {
          setUser(response.data);
        } else {
          console.error("No user data received");
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };
    fetchUserDetails();
  }, [studentEmail]);

  // Fetch the list of clubs once the student email is available
  useEffect(() => {
    const fetchClubs = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      try {
        const response = await fetch(`${BASE_URL}/club/list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data.clubs)) {
          setClubs(data.clubs);
        } else {
          throw new Error("Invalid club list data format.");
        }
      } catch (err) {
        console.error("Error fetching clubs:", err);
        setError("Failed to load clubs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (studentEmail) {
      fetchClubs();
    }
  }, [studentEmail]);

  // Filter clubs based on search query
  const filteredClubs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return clubs.filter((club) => club.name?.toLowerCase().includes(q));
  }, [clubs, searchQuery]);

  return (
    <div className="show-clubs-container">
      <Sidebar />
      <div className="main-content">
        <div className="membership-header">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search Clubs..."
              className="membership-search"
              value={searchQuery}
              onChange={handleSearch}
            />
            <button className="searchIcon" type="button">
              <FaSearch />
            </button>
          </div>
          {/* When the avatar is clicked, the popup is shown */}
          <FaUserCircle
            className="membership-avatar"
            size={30}
            onClick={() => setProfileOpen(true)}
            style={{ cursor: "pointer" }}
          />
        </div>

        <hr className="section-divider" />
        <h1>Club List</h1>

        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
              paddingLeft: 0,
              marginLeft: 0,
              width: "100%",
            }}
          >
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 8,
                  overflow: "hidden",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  padding: 12,
                }}
              >
                {/* Image placeholder */}
                <Skeleton variant="rectangular" height={120} animation="wave" />
                {/* Title */}
                <Skeleton
                  variant="text"
                  width="80%"
                  height={30}
                  animation="wave"
                />
                {/* Date or details */}
                <Skeleton
                  variant="text"
                  width="60%"
                  height={20}
                  animation="wave"
                />
                {/* Buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  <Skeleton
                    variant="rectangular"
                    width={40}
                    height={30}
                    animation="wave"
                  />
                  <Skeleton
                    variant="rectangular"
                    width={40}
                    height={30}
                    animation="wave"
                  />
                  <Skeleton
                    variant="rectangular"
                    width={40}
                    height={30}
                    animation="wave"
                  />
                </div>
              </div>
            ))}
          </div>
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
      {/* User Profile Popup */}

      <UserProfile
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
      />
    </div>
  );
};

export default ShowClubs;

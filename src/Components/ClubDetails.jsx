import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../CSS/ClubDetails.css";
import { FaArrowLeft } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const ClubDetails = () => {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to check if the token is valid
  const isTokenValid = (token) => {
    if (!token) return false;

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp >= currentTime;
    } catch (error) {
      return false;
    }
  };

  // Fetch club details with token validation
  useEffect(() => {
    const fetchClubDetails = async () => {
      const token = localStorage.getItem("access_token");

      // If no token or token is invalid, set error and stop fetching
      if (!token || !isTokenValid(token)) {
        setError(
          "Authorization token is missing or expired. Please log in again."
        );
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://43.205.202.255:5000/club/${clubId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Send token in Authorization header
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setClub(data); // Set the fetched club data
      } catch (err) {
        console.error("Error fetching club data:", err);
        setError("Failed to load club details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClubDetails();
  }, [clubId]); // Only refetch club details when `clubId` changes

  // Show error message if there's an error
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Show loading message if the data is still being fetched
  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  return (
    <div className="club-details-container">
      <div className="club-header">
        <div className="club-header-content">
          <Link to="/viewclubs" className="back-arrow">
            <FaArrowLeft />
          </Link>
          <h1 className="club-title">{club.title}</h1>
        </div>

        {club.images_url?.img1 && (
          <img
            src={club.images_url.img1}
            alt={`${club.title} header`}
            className="club-header-img"
          />
        )}
      </div>

      <div className="club-content">
        <p className="club-welcome-message">{club.welcome_msg}</p>
        <p className="club-short-message">{club.welcome_short_para}</p>

        <section className="club-section">
          <h2>About the Club</h2>
          <p>{club.about_club}</p>
        </section>

        <section className="club-section">
          <h2>Our Activities</h2>
          <p>{club.our_activities}</p>
        </section>

        <section className="club-section">
          <h2>Additional Information</h2>
          <p>{club.additional_information}</p>
        </section>
      </div>

      <div className="club-footer">
        {club.images_url?.footer && (
          <img
            src={club.images_url.footer}
            alt={`${club.title} footer`}
            className="club-footer-img"
          />
        )}
      </div>
    </div>
  );
};

export default ClubDetails;

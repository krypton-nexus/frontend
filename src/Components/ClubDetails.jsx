import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../CSS/ClubDetails.css";

const ClubDetails = () => {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        const response = await fetch(
          `http://43.205.202.255:5000/club/${clubId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setClub(data);
      } catch (err) {
        console.error("Error fetching club data:", err);
        setError("Failed to load club details. Please try again later.");
      }
    };

    fetchClubDetails();
  }, [clubId]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!club) {
    return <div className="loading-message">Loading...</div>;
  }

  return (
    <div className="club-details-container">
      <div className="club-header">
        <h1 className="club-title">{club.title}</h1>
        <img
          src={club.images_url["header image"]}
          alt={`${club.title} header`}
          className="club-header-img"
        />
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
        <img
          src={club.images_url["footer image"]}
          alt={`${club.title} footer`}
          className="club-footer-img"
        />
      </div>
    </div>
  );
};

export default ClubDetails;
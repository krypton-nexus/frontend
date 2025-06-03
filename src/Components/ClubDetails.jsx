import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../CSS/ClubDetails.css";
import { FaArrowLeft } from "react-icons/fa";
import img1 from "../Images/activity1.jpg";
import img2 from "../Images/activity2.jpg";
import img3 from "../Images/activity3.jpg";
import img4 from "../Images/activity4.jpg";
import img5 from "../Images/activity5.jpg";
import img6 from "../Images/activity6.jpg";
import img7 from "../Images/activity7.jpg";
import img8 from "../Images/activity8.jpg";
import img9 from "../Images/activity9.jpg";
import img10 from "../Images/activity10.jpg";
import img11 from "../Images/activity.jpg";
import img12 from "../Images/activity11.jpg";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ClubDetails = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getValidToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp >= currentTime) return token;
    } catch (err) {
      console.error("Invalid token:", err);
    }

    return null;
  };

  useEffect(() => {
    const fetchClubDetails = async () => {
      const token = getValidToken();

      if (!token) {
        setError("Authorization token is missing or expired. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/club/${clubId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError("Club not found.");
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return;
        }

        const data = await response.json();
        setClub(data);
      } catch (err) {
        console.error("Error fetching club data:", err);
        setError("Failed to load club details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClubDetails();
  }, [clubId]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (loading) {
    return <div className="loading-message">Loading club details...</div>;
  }

  if (!club) {
    return <div className="error-message">Club not found.</div>;
  }

  return (
    <div className="club-details-container">
      <div className="club-header">
        <div className="club-header-content">
          <Link
            to="/viewclubs"
            className="back-arrow"
            aria-label="Back to club list">
            <FaArrowLeft />
          </Link>
          <h1 className="club-title">{club.title || "Untitled Club"}</h1>
        </div>

        {club.images_url?.img1 && (
          <img
            src={club.images_url.img1}
            alt={`${club.title} header`}
            className="club-header-img"
          />
        )}
      </div>
      <div className="club-welcome-section"></div>
      <div className="club-content">
        {club.welcome_msg && (
          <p className="club-welcome-message">{club.welcome_msg}</p>
        )}

        {club.welcome_short_para && (
          <p className="club-short-message">{club.welcome_short_para}</p>
        )}

        {club.about_club && (
          <section className="club-section">
            <h2>About the Club</h2>
            <p>{club.about_club}</p>
          </section>
        )}

        <div className="activity-card-grid">
          {[img9, img10, img11, img12].map((src, index) => (
            <div className="activity-card" key={index}>
              <img src={src} alt={`Activity ${index + 1}`} />
            </div>
          ))}
        </div>

        {/* {club.our_activities && (
          <section className="club-section">
            <h2>Our Activities</h2>
            <p>{club.our_activities}</p>
          </section>
        )} */}

        {club.our_activities && (
          <section className="club-section">
            <h2>Our Activities</h2>
            <p>{club.our_activities}</p>

            <div className="activity-card-grid">
              {[img1, img2, img3, img4, img5, img6, img7, img8].map(
                (src, index) => (
                  <div className="activity-card" key={index}>
                    <img src={src} alt={`Activity ${index + 1}`} />
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {club.additional_information && (
          <section className="club-section">
            <h2>Additional Information</h2>
            <p>{club.additional_information}</p>
          </section>
        )}
      </div>

      {club.images_url?.footer && (
        <div className="club-footer">
          <img
            src={club.images_url.footer}
            alt={`${club.title} footer`}
            className="club-footer-img"
          />
        </div>
      )}
    </div>
  );
};

export default ClubDetails;

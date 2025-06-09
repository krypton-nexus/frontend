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

  const ClubDetailsSkeleton = () => (
    <div className="club-details-container skeleton">
      <div className="club-header">
        <div className="club-header-content">
          <div
            className="back-arrow skeleton-box"
            style={{ width: 32, height: 32 }}
          ></div>
          <div
            className="club-title skeleton-box"
            style={{ width: 220, height: 32, marginLeft: 16 }}
          ></div>
        </div>
        <div
          className="club-header-img skeleton-box"
          style={{ width: "100%", height: 180, marginTop: 16 }}
        ></div>
      </div>
      <div
        className="club-welcome-section skeleton-box"
        style={{ width: "60%", height: 36, margin: "32px auto" }}
      ></div>
      <div className="club-content">
        <div
          className="club-welcome-message skeleton-box"
          style={{ width: "80%", height: 20, margin: "0 auto 12px" }}
        ></div>
        <div
          className="club-short-message skeleton-box"
          style={{ width: "65%", height: 16, margin: "0 auto 24px" }}
        ></div>

        <section className="club-section">
          <div
            className="section-title skeleton-box"
            style={{ width: 150, height: 24, marginBottom: 10 }}
          ></div>
          <div
            className="section-content skeleton-box"
            style={{ width: "90%", height: 60 }}
          ></div>
        </section>

        <div
          className="activity-card-grid"
          style={{ marginTop: 30, gap: 16, display: "flex", flexWrap: "wrap" }}
        >
          {[...Array(5)].map((_, i) => (
            <div
              className="activity-card skeleton-box"
              style={{
                width: 250,
                height: 250,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "auto",
              }}
              key={i}
            ></div>
          ))}
        </div>

        <section className="club-section" style={{ marginTop: 36 }}>
          <div
            className="section-title skeleton-box"
            style={{ width: 180, height: 24, marginBottom: 10 }}
          ></div>
          <div
            className="section-content skeleton-box"
            style={{ width: "90%", height: 60 }}
          ></div>
          <div
            className="activity-card-grid"
            style={{
              marginTop: 16,
              gap: 12,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {[...Array(8)].map((_, i) => (
              <div
                className="activity-card skeleton-box"
                style={{ width: 110, height: 80 }}
                key={i}
              ></div>
            ))}
          </div>
        </section>

        <section className="club-section" style={{ marginTop: 36 }}>
          <div
            className="section-title skeleton-box"
            style={{ width: 200, height: 24, marginBottom: 10 }}
          ></div>
          <div
            className="section-content skeleton-box"
            style={{ width: "90%", height: 48 }}
          ></div>
        </section>
      </div>
      <div className="club-footer" style={{ marginTop: 40 }}>
        <div
          className="club-footer-img skeleton-box"
          style={{ width: "100%", height: 90 }}
        ></div>
      </div>
    </div>
  );

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
    return <ClubDetailsSkeleton />;
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
            aria-label="Back to club list"
          >
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

import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/ClubCard.css";

const ClubCard = ({ club }) => {
  const navigate = useNavigate();

  return (
    <div
      className="club-card"
      style={{
        backgroundImage: `url(${club.images_url["header image"] || "/placeholder-image.jpg"})`,
      }}
    >
      <div className="card-overlay">
        <div className="club-title">{club.title || "Club Name"}</div>
        <p className="club-description">
          {club.description || "No description available."}
        </p>
        <div className="buttons">
          <button
            className="view-club"
            onClick={() => navigate(`/club/${club.id}`)}
          >
            View Club
          </button>
          <button
            className="join-now"
            onClick={() => alert("Feature not implemented yet!")}
          >
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;

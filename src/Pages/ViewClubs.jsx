import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/ViewClubs.css";
import logo1short from "../Images/logo1short.png";
import sesacard from "../Images/sesacard.jfif";
import gavelcard from "../Images/gavelcard.jfif";
import adcard from "../Images/adcard.jpg";
import leocard from "../Images/leocard.jfif";
import tsacard from "../Images/tsacard.jpeg";
import rotcard from "../Images/rotcard.png";
import {
  FaUsers,
  FaRegBell,
  FaSignOutAlt,
  FaRss,
  FaCalendarAlt,
  FaComment,
  FaListAlt,
} from "react-icons/fa";

const ViewClubs = () => {
  const navigate = useNavigate();

  const clubs = [
    {
      name: "SESA",
      image: sesacard,
      description:
        "The Software Engineering Student Association (SESA) at the University of Kelaniya unites aspiring software engineers through workshops, hackathons, and industry collaborations, providing a platform for academic and professional growth. ",
      route: "/sesapage",
    },
    {
      name: "Gavel",
      image: gavelcard,
      description:
        "The Gavel Club at the University of Kelaniya empowers students to improve their public speaking and leadership skills through structured meetings, speech contests, and mentorship opportunities.",
      route: "/gavelpage",
    },
    {
      name: "Adventure",
      image: adcard,
      description:
        "The Adventure Club at the University of Kelaniya encourages students to explore the outdoors and develop teamwork skills through hiking, camping, and other adventurous activities.",
      route: "/sesapage",
    },
    {
      name: "LEO",
      image: leocard,
      description:
        "The LEO Club at the University of Kelaniya inspires students to engage in leadership, community service, and personal development through impactful projects and volunteer activities.",
      route: "/sesapage",
    },
    {
      name: "TSA",
      image: tsacard,
      description:
        "The Tamil Student Association at the University of Kelaniya celebrates Tamil culture and heritage, fostering unity through cultural events, language workshops, and community engagement activities.",
      route: "/sesapage",
    },
    {
      name: "Rotaract",
      image: rotcard,
      description:
        "The Rotaract Club at the University of Kelaniya empowers students to develop leadership skills and engage in community service through various social and professional development projects.",
      route: "/sesapage",
    },
  ];

  return (
    <div className="view-clubs-container">
      <aside className="sidebar">
        <Link to="/home">
          <img src={logo1short} alt="Nexus Logo" className="logo" />{" "}
        </Link>
        <ul className="menu">
          <li className="active">
            <FaUsers /> View Clubs
          </li>
          <li>
            <FaRss /> View Feed
          </li>
          <li>
            <FaCalendarAlt /> View Events
          </li>
          <li>
            <FaComment /> Communication
          </li>
          <li>
            <FaListAlt /> Purchase Merchandise
          </li>
          <li>
            <div className="notifications">
              <FaRegBell />
              Notification <span className="badge">8</span>
            </div>
          </li>
        </ul>
        <button className="logout">
          <FaSignOutAlt /> Logout
        </button>
      </aside>
      <main className="main-content">
        <header>
          <input type="text" placeholder="Search..." className="search-bar" />
        </header>
        <section className="clubs">
          {clubs.map((club, index) => (
            <div
              key={index}
              className="club-card"
              style={{ backgroundImage: `url(${club.image})` }}>
              <div className="card-overlay">
                <div className="club-title">{club.name}</div>
                <p className="club-description">{club.description}</p>
                <div className="buttons">
                  <button
                    className="view-club"
                    onClick={() => navigate(club.route)} // Navigate to the club's route
                  >
                    View Club
                  </button>
                  <button className="join-now">Join Now</button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default ViewClubs;

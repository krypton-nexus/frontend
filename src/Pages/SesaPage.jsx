import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../CSS/SesaPage.css";
import { FaArrowLeft } from "react-icons/fa";
import sesacard from "../Images/sesacard.jfif";
import sesaimg1 from "../Images/sesaimg1.jpg";
import sesaimg3 from "../Images/sesaimg3.jpg";
import prehack from "../Images/prehack.jpg";
import realhack from "../Images/realhack.jpg";
import juniorhack from "../Images/juniorhack.jpg";
import sesalogo2 from "../Images/sesalogo2.png";

const SesaPage = () => {
  const navigate = useNavigate();
  return (
    <div className="sesa-page-container">
      {/* Header with Join Button */}
      <header className="sesa-header">
        {/* <Link to="/home">
          <img src={sesalogo2} alt="Logo" className="logo" />
        </Link> */}
        <div className="header-left">
          <button
            className="back-button"
            onClick={() => navigate("/viewclubs")}>
            <FaArrowLeft /> {/* Left arrow icon */}
          </button>
          <h1>Software Engineering Student Association (SESA)</h1>
        </div>
        <button className="join-now">Join Now</button>
      </header>

      <section className="sesa-banner">
        <div className="hero-header">
          <Link to="/home">
            <img src={sesalogo2} alt="Logo" className="logo" />
          </Link>
        </div>
        <div className="hero-content">
          <h1>
            Welcome to <span className="highlight">SESA</span> <br></br>Software
            Engineering Student Association
          </h1>
          <p>
            The Software Engineering Student Association (SESA) brings together
            aspiring software engineers to foster growth through workshops,
            hackathons, and industry collaborations.
          </p>

          <div className="sesa-hero-buttons">
            <button className="btn register-btn" onClick={() => navigate("/")}>
              Join Now
            </button>
          </div>
        </div>
      </section>

      <section className="sesa-hero-section">
        <img src={sesacard} alt="SESA Hero" className="hero-image" />
        <div className="hero-content">
          <h2>ABOUT SESA</h2>
          <p>
            The Software Engineering Student Association (SESA) is a student-led
            organization dedicated to the academic and professional development
            of software engineering students. Through events such as coding
            competitions, career fairs, and guest lectures, SESA provides a
            platform for students to learn, collaborate, and grow.
            <br />
            SESA also emphasizes the importance of teamwork, leadership, and
            real-world problem-solving by connecting students with industry
            professionals and fostering a vibrant community of learners.
          </p>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="sesa-gallery-section">
        <br />
        <h2>OUR ACTIVITIES</h2>
        <p>
          Our activities include engaging hackathons like Pre-Hack and Real
          Hack, where students tackle real-world challenges with innovative
          solutions. We also organize interactive workshops designed to enhance
          technical and soft skills, providing opportunities for students to
          collaborate, learn, and grow in a dynamic environment.
        </p>
        <div className="gallery">
          <img src={prehack} alt="Activity 1" />
          <img src={sesaimg3} alt="Activity 2" />
          <img src={realhack} alt="Activity 3" />
        </div>
      </section>

      <section className="sesa-hero-section">
        <div className="hero-content juniorhack">
          <h2>Junior Hack</h2>
          <p className="juniorhack">
            Junior Hack at the University of Kelaniya is a premier event
            designed to inspire and nurture young innovators in the field of
            technology. Tailored specifically for junior students, this
            hackathon provides a platform for participants to collaborate,
            innovate, and develop solutions to real-world problems. The event
            encourages creativity and teamwork, enabling students to explore
            emerging technologies and apply their knowledge in practical
            scenarios. Through workshops, mentorship sessions, and hands-on
            activities, Junior Hack not only enhances technical skills but also
            fosters critical thinking and problem-solving abilities.
            Participants gain valuable exposure to the hackathon culture,
            preparing them for larger competitions and future industry
            challenges. Whether it’s building innovative applications, crafting
            sustainable solutions, or simply exploring the joy of coding, Junior
            Hack creates an inclusive environment where ideas come to life and
            the leaders of tomorrow take their first steps.
          </p>
        </div>
        <img src={juniorhack} alt="SESA Hero" className="juniorhack-image" />
      </section>

      {/* Description Section */}
      <section className="sesa-description-section">
        <h2>FIRST BATCH</h2>
        <img src={sesaimg1} alt="SESA Hero" className="description-image" />
        <p>
          The Software Engineering Student Association (SESA) is a student-led
          organization dedicated to the academic and professional development of
          software engineering students. Through events such as coding
          competitions, career fairs, and guest lectures, SESA provides a
          platform for students to learn, collaborate, and grow. SESA also
          emphasizes the importance of teamwork, leadership, and real-world
          problem-solving by connecting students with industry professionals and
          fostering a vibrant community of learners.
        </p>
      </section>
    </div>
  );
};

export default SesaPage;

import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../CSS/SesaPage.css";
import { FaArrowLeft } from "react-icons/fa";
import gavelcard from "../Images/gavelcard.jfif";
import gavelimg1 from "../Images/gavelimg1.jpg";
import gavelimg2 from "../Images/gavelimg2.jpg";
import gavelimg3 from "../Images/gavelimg3.jpg";
import gavelimg4 from "../Images/gavelimg4.jpg";
import gavelimg5 from "../Images/gavelimg5.jpg";
import gavelimg6 from "../Images/gavelimg6.jpg";
import gavelcele from "../Images/gavelcele.jpg";
import gavelimg from "../Images/gavelimg.jpg";
import gavel from "../Images/gavel.jfif";

const GavelPage = () => {
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
          <h1>Gavel Club</h1>
        </div>
        <button className="join-now">Join Now</button>
      </header>

      <section className="sesa-banner">
        <div className="hero-header">
          <Link to="/home">
            <img src={gavel} alt="Logo" className="logo" />
          </Link>
        </div>
        <div className="hero-content">
          <h1>
            Welcome to <span className="highlight">GAVEL</span> <br></br>
            University of Kelaniya
          </h1>
          <p>
            The Gavel Club at the University of Kelaniya brings together
            aspiring speakers and leaders to foster growth through speech
            contests, debates, and leadership development programs.
          </p>

          <div className="sesa-hero-buttons">
            <button className="btn register-btn" onClick={() => navigate("/")}>
              Join Now
            </button>
          </div>
        </div>
      </section>

      <section className="sesa-hero-section">
        <img src={gavelcard} alt="SESA Hero" className="hero-image" />
        <div className="hero-content">
          <h2>ABOUT GAVEL</h2>
          <p>
            The Gavel Club at the University of Kelaniya is a student-led
            organization dedicated to enhancing public speaking, leadership, and
            communication skills. Through activities such as speech contests,
            debate sessions, and mentorship programs, the club provides a
            platform for students to express themselves, gain confidence, and
            develop critical soft skills.
            <br />
            The Gavel Club also emphasizes the importance of teamwork, creative
            thinking, and personal growth by offering structured meetings and
            workshops. By fostering a supportive and dynamic community, it
            empowers students to become effective communicators and leaders,
            preparing them for both professional success and societal impact.
          </p>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="sesa-gallery-section">
        <br />
        <h2>OUR ACTIVITIES</h2>
        <p>
          Our activities include captivating speech contests and debate
          sessions, where members can hone their public speaking and critical
          thinking skills. The Gavel Club also organizes interactive workshops
          and leadership training programs designed to enhance communication,
          teamwork, and interpersonal abilities. Regularly held meetings provide
          a platform for members to practice prepared speeches and impromptu
          speaking, fostering confidence and creativity. Additionally, social
          and community engagement events allow students to build connections,
          share ideas, and grow in a dynamic and supportive environment,
          preparing them for leadership roles and professional success.
        </p>
        <div className="gallery">
          <img src={gavelimg1} alt="Activity 1" />
          <img src={gavelimg2} alt="Activity 2" />
          <img src={gavelimg3} alt="Activity 3" />
        </div>
        <br />
        <br />
        <div className="gallery">
          <img src={gavelimg4} alt="Activity 1" />
          <img src={gavelimg5} alt="Activity 2" />
          <img src={gavelimg6} alt="Activity 3" />
        </div>
      </section>

      <section className="sesa-hero-section">
        <div className="hero-content juniorhack">
          <h2>GAVEL ORIENTATION</h2>
          <p className="juniorhack">
            The Gavel Club at the University of Kelaniya is a student-led
            organization focused on enhancing public speaking and leadership
            skills among its members. Through structured meetings, speech
            contests, and mentorship programs, the club creates a supportive
            environment for students to develop their communication abilities
            and build confidence. Gavel Club emphasizes the importance of
            self-expression, critical thinking, and teamwork, offering members
            opportunities to engage in activities that prepare them for
            real-world challenges. By fostering a community of aspiring leaders
            and skilled speakers, the Gavel Club empowers students to excel
            academically, professionally, and personally while contributing
            positively to society.
          </p>
        </div>
        <img src={gavelimg} alt="SESA Hero" className="juniorhack-image" />
      </section>

      {/* Description Section */}
      <section className="sesa-description-section">
        <h2>Gavel Celebrations</h2>
        <img src={gavelcele} alt="SESA Hero" className="description-image" />
        <p>
          The Gavel Club at the University of Kelaniya is a student-led
          organization focused on enhancing public speaking and leadership
          skills among its members. Through structured meetings, speech
          contests, and mentorship programs, the club creates a supportive
          environment for students to develop their communication abilities and
          build confidence. Gavel Club emphasizes the importance of
          self-expression, critical thinking, and teamwork, offering members
          opportunities to engage in activities that prepare them for real-world
          challenges. By fostering a community of aspiring leaders and skilled
          speakers, the Gavel Club empowers students to excel academically,
          professionally, and personally while contributing positively to
          society.
        </p>
      </section>
    </div>
  );
};

export default GavelPage;

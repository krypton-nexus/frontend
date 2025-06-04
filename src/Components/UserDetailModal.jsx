import React from "react";
import PropTypes from "prop-types";

const UserDetailModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
        <h2 className="modal-title">Member Details</h2>
        <div className="user-info">
          <div className="info-item">
            <strong>First Name:</strong>
            <span>{user.first_name || "N/A"}</span>
          </div>
          <div className="info-item">
            <strong>Last Name:</strong>
            <span>{user.last_name || "N/A"}</span>
          </div>
          <div className="info-item">
            <strong>Email:</strong>
            <span>{user.email || "N/A"}</span>
          </div>
          <div className="info-item">
            <strong>Phone Number:</strong>
            <span>{user.phone_number || "N/A"}</span>
          </div>
          <div className="info-item">
            <strong>Date of Birth:</strong>
            <span>
              {user.dob
                ? new Date(user.dob).toLocaleDateString("en-US", {
                    timeZone: "Asia/Colombo",
                    dateStyle: "long",
                  })
                : "N/A"}
            </span>
          </div>
          <div className="info-item">
            <strong>Student Number:</strong>
            <span>{user.student_number || "N/A"}</span>
          </div>
          <div className="info-item">
            <strong>Year:</strong>
            <span>{user.year || "N/A"}</span>
          </div>
          <div className="info-item">
            <strong>Course Name:</strong>
            <span>{user.course_name || "N/A"}</span>
          </div>
          <div className="info-item">
            <strong>Department:</strong>
            <span>{user.department || "N/A"}</span>
          </div>
          <div className="info-item">
            <strong>Faculty:</strong>
            <span>{user.faculty || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

UserDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    phone_number: PropTypes.string,
    dob: PropTypes.string,
    student_number: PropTypes.string,
    year: PropTypes.string,
    course_name: PropTypes.string,
    department: PropTypes.string,
    faculty: PropTypes.string,
  }),
};

export default UserDetailModal;

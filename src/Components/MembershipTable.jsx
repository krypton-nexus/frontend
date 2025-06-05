import React from "react";
import { Ban } from "lucide-react"; // Or from "react-icons/lu" etc.

const MembershipTable = ({
  title,
  data,
  isCurrentMembers,
  onViewDetails,
  onStatusChange,
  onMemberDeletion,
}) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div>
        <hr className="section-divider" />
        <div className="no-membership-request">
          <h2>
            <span className="ban-icon">
              <Ban size={18} className="text-red-400" />
            </span>
            No {title?.toLowerCase() || "members"} available.
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="membership-table-container">
      <br />
      <h2>{title}</h2>
      <table className="membership-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Course Name</th>
            <th>Year</th>
            <th>Faculty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((member) => (
            <tr key={member.email}>
              <td>{member.firstName}</td>
              <td>{member.lastName}</td>
              <td>{member.courseName}</td>
              <td>{member.year}</td>
              <td>{member.faculty}</td>
              <td>
                <button
                  className="view-btn"
                  onClick={() => onViewDetails(member.email)}
                >
                  View
                </button>
                {isCurrentMembers ? (
                  <button
                    className="delete-btn"
                    onClick={() => onMemberDeletion(member.email)}
                  >
                    Delete
                  </button>
                ) : (
                  <>
                    <button
                      className="accept-btn"
                      onClick={() => onStatusChange("Approved", member.email)}
                    >
                      Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => onStatusChange("rejected", member.email)}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MembershipTable;

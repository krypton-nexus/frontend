import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import "../CSS/UserProfile.css";
import { jwtDecode as jwt_decode } from "jwt-decode"; // Alias the named import

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("Unauthorized access. Please log in.");
        navigate("/login");
        return;
      }

      try {
        // Decode the JWT token to get the email
        const decodedToken = jwt_decode(token);
        const email = decodedToken.email;

        if (!email) {
          // Redirect to login if email is missing
          alert("Invalid token. Please log in again.");
          navigate("/login");
          return;
        }
        const response = await axios.get(
          `http://13.232.48.203:5000/student/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
console.log(response.data);
        if (token) {
          setUser(response.data); // Assuming response has a `user` object
        } else {
          setError(response.data.message || "Failed to fetch user details.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "An error occurred. Please try again."
        );
        navigate("/login");

        // Redirect to login if unauthorized
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchUserDetails();
  }, [navigate]);

  if (!user && !error) {
    return <p>Loading user details...</p>;
  }

  return (
    <div className="user-profile-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <h2>NEXUS</h2>
        </div>
        <nav className="nav-menu">
          <ul>
            <li>View Clubs</li>
            <li>View Feed</li>
            <li>View Events</li>
            <li>Communication</li>
            <li>Purchase Merchandise</li>
            <li className="notification">Notification</li>
          </ul>
        </nav>
        <div className="logout">
          <button
            onClick={() => {
              localStorage.removeItem("access_token");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="profile-content">
        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <header className="profile-header">
              <div className="user-avatar">
                <FaUserCircle size={80} />
              </div>
              <div className="user-info">
                <h2>{user.full_name}</h2>
                <p>Member Since: {user.created_at}</p>
              </div>
            </header>

            {/* Profile Details */}
            <section className="profile-details">
              <h3>Personal Info</h3>
              <table>
                <tbody>
                  <tr>
                    <td>Full Name</td>
                    <td>{user.first_name + " " + user.last_name}</td>
                  </tr>
                  <tr>
                    <td>Mobile Number</td>
                    <td>{user.phone_number}</td>
                  </tr>
                  <tr>
                    <td>Email Address</td>
                    <td>{user.email}</td>
                  </tr>
                  <tr>
                    <td>Birthday</td>
                    <td>
                      {user.dob
                        ? new Date(user.dob).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td>Faculty</td>
                    <td>{user.faculty}</td>
                  </tr>
                  <tr>
                    <td>Student Number</td>
                    <td>{user.student_number}</td>
                  </tr>
                  <tr>
                    <td>Department</td>
                    <td>{user.department}</td>
                  </tr>
                  <tr>
                    <td>Year</td>
                    <td>{user.year}</td>
                  </tr>
                  <tr>
                    <td>Course Name</td>
                    <td>{user.course_name}</td>
                  </tr>
                </tbody>
              </table>

              <div className="profile-actions">
                <button className="btn-password">Change My Password</button>
                <button className="btn-delete">Delete My Account</button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default UserProfile;

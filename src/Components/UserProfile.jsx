import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../CSS/UserProfile.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const UserProfile = ({ open, onClose }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    const fetchUserDetails = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("User is not authenticated. Please log in.");
        return;
      }
      try {
        const decoded = jwtDecode(token);
        if (!decoded.email) {
          setError("Invalid token. Please log in again.");
          return;
        }
        const response = await axios.get(
          `${BASE_URL}/student/${decoded.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data) {
          setUser(response.data);
        } else {
          setError("Failed to fetch user details.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "An error occurred. Please try again."
        );
      }
    };

    fetchUserDetails();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="upd">
        <h3>User Profile</h3>
        <DialogContent>
          {error && <p className="error-message">{error}</p>}
          {user ? (
            <div className="profile-details">
              <div className="user-avatar">
                <FaUserCircle size={80} />
              </div>

              <div className="userInfo">
                <div>
                  Full Name:{" "}
                  <b>
                    {user.first_name} {user.last_name}
                  </b>
                </div>
                <div>
                  {" "}
                  Email: <b>{user.email}</b>
                </div>
                <div>
                  {" "}
                  Mobile: <b>{user.phone_number}</b>
                </div>
                <div>
                  {" "}
                  Member Since:{" "}
                  <b>{new Date(user.created_at).toLocaleDateString()}</b>
                </div>
              </div>
            </div>
          ) : (
            !error && <p>Loading user details...</p>
          )}
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default UserProfile;

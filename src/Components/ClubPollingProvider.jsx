import { useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ClubPollingProvider = () => {
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const tokenExpiry = localStorage.getItem("token_expiry");

    if (!token || !tokenExpiry || Date.now() >= tokenExpiry) return;

    const decoded = jwtDecode(token);
    const email = decoded.email;

    const fetchClubs = async () => {
      try {
        let userClubs = [];
        let allClubs = [];

        try {
          const userClubsRes = await axios.get(
            `${BASE_URL}/student/clubs/${email}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (typeof userClubsRes.data !== "string") {
            userClubs = userClubsRes.data.clubs || [];
          }
        } catch (err) {
          if (err.response && err.response.status === 404) {
            userClubs = [];
          } else {
            throw err;
          }
        }

        // Fetch all clubs
        const allClubsRes = await axios.get(`${BASE_URL}/club/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (typeof allClubsRes.data !== "string") {
          allClubs = allClubsRes.data.clubs || [];
        }
        const prevUserClubs = localStorage.getItem("user_clubs");
        const prevAllClubs = localStorage.getItem("all_clubs");

        const newUserClubsStr = JSON.stringify(userClubs);
        const newAllClubsStr = JSON.stringify(allClubs);

        const hasChanged =
          newUserClubsStr !== prevUserClubs || newAllClubsStr !== prevAllClubs;

        if (hasChanged) {
          localStorage.setItem("user_clubs", newUserClubsStr);
          localStorage.setItem("all_clubs", newAllClubsStr);
          window.location.reload(); 
        }
      } catch (err) {
        console.warn("Global club polling failed:", err);
      }
    };

    fetchClubs(); // Initial fetch
    const interval = setInterval(fetchClubs, 10000); 

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default ClubPollingProvider;

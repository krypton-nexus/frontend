import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const currentPath = window.location.pathname;

    if (token && currentPath === "/login") {
      // Redirect to /viewclubs if the user is logged in and trying to access /login
      navigate("/viewclubs");
    } else if (
      !token &&
      currentPath !== "/login" &&
      currentPath !== "/adminlogin" &&
      currentPath !== "/admindashboard" &&
      currentPath !== "/home" &&
      currentPath !== "/signup" // Allow unauthenticated users to access the signup page
    ) {
      // Redirect to /home if the user is not logged in and trying to access a protected route
      navigate("/home");
    } else if (token && currentPath === "/signup") {
      // Redirect to /viewclubs if the user is already logged in and tries to access /signup
      navigate("/viewclubs");
    }
  }, [navigate]);
};

export default useAuthCheck;
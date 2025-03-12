import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const currentPath = window.location.pathname;
    const expiryTime = localStorage.getItem("token_expiry");

    // If the token is expired, clear it and redirect
    if (token && expiryTime && new Date().getTime() >= expiryTime) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_expiry");
      navigate("/home");
      return; // Prevent further checks once the token is expired
    }

    // If authenticated and on login/signup page, redirect to /viewclubs
    if (token && (currentPath === "/login" || currentPath === "/signup")) {
      navigate("/viewclubs");
    }

    // If not authenticated and on protected route, redirect to /home
    if (!token && !["/login", "/signup", "/home"].includes(currentPath)) {
      navigate("/home");
    }
  }, [navigate]);
};

export default useAuthCheck;

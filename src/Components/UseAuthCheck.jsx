import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = window.location.pathname;

    // Check if we're on an admin route.
    if (currentPath.startsWith("/admin")) {
      const adminToken = localStorage.getItem("admin_access_token");
      // If no admin token, redirect to admin login page.
      if (!adminToken) {
        navigate("/admin");
      }
      // Admin token is sufficient; no further checks.
      return;
    }

    // For non-admin routes, use access_token and token_expiry.
    const token = localStorage.getItem("access_token");
    const expiryTime = localStorage.getItem("token_expiry");

    // If the token is expired, clear it and redirect.
    if (token && expiryTime && new Date().getTime() >= expiryTime) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_expiry");
      navigate("/home");
      return;
    }

    // If authenticated and on login/signup page, redirect to /viewclubs.
    if (token && (currentPath === "/login" || currentPath === "/signup")) {
      navigate("/viewclubs");
    }

    // If not authenticated and on a protected route, redirect to /home.
    if (!token && !["/login", "/signup", "/home"].includes(currentPath)) {
      navigate("/home");
    }
  }, [navigate]);
};

export default useAuthCheck;

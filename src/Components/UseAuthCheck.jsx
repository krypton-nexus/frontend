import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = window.location.pathname;
    const token = localStorage.getItem("access_token");
    const expiryTime = localStorage.getItem("token_expiry");
    const adminToken = localStorage.getItem("admin_access_token");

    const isAdminPath = currentPath.startsWith("/admin");
    const specialAdminPaths = [
      "/admindashboard",
      "/finance",
      "/addtask",
      "/feed",
      "/merchandise",
      "adminevent",
    ];
    const isSpecialAdminPath = specialAdminPaths.includes(currentPath);

    // Redirect if accessing admin or admin-like page without admin token
    if ((isAdminPath || isSpecialAdminPath) && !adminToken) {
      navigate("/admin");
      return;
    }

    // Handle expired user token
    if (token && expiryTime && new Date().getTime() >= expiryTime) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_expiry");
      navigate("/home");
      return;
    }

    // Redirect logged-in user away from login/signup
    if (token && ["/login", "/signup"].includes(currentPath)) {
      navigate("/viewclubs");
      return;
    }

    // Redirect unauthenticated users away from protected user routes
    const publicPaths = ["/login", "/signup", "/home"];
    const isPublic = publicPaths.includes(currentPath);
    if (!token && !isPublic && !isAdminPath && !isSpecialAdminPath) {
      navigate("/home");
    }
  }, [navigate]);
};

export default useAuthCheck;

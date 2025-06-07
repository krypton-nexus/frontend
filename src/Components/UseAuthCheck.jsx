import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const useAuthCheck = () => {
  const navigate = useNavigate();
  const now = Date.now();


  useEffect(() => {
    const currentPath = window.location.pathname;
    const userToken = localStorage.getItem("access_token");
    const adminToken = localStorage.getItem("admin_access_token");

    let userExpiry = null;
    let adminExpiry = null;

    if (userToken) {
      try {
        const decodedUser = jwtDecode(userToken);
        userExpiry = decodedUser.exp ? decodedUser.exp * 1000 : null;
      } catch (error) {
        console.error("Failed to decode user token:", error);
        localStorage.removeItem("access_token");
      }
    }

    if (adminToken) {
      try {
        const decodedAdmin = jwtDecode(adminToken);
        adminExpiry = decodedAdmin.exp ? decodedAdmin.exp * 1000 : null;
      } catch (error) {
        console.error("Failed to decode admin token:", error);
        localStorage.removeItem("admin_access_token");
      }
    }

    const isAdminPath = currentPath.startsWith("/admin");
    const specialAdminPaths = [
      "/admindashboard",
      "/finance",
      "/task",
      "/feed",
      "/addmerchandise",
      "/adminevent",
      "/add-product",
      "/addevent",
      "/system-admin-dashboard",
    ];
    const isSpecialAdminPath = specialAdminPaths.includes(currentPath);
    if (isAdminPath || isSpecialAdminPath) {
      if (!adminToken || !adminExpiry || now >= adminExpiry) {
        localStorage.removeItem("admin_access_token");
        navigate("/admin");
        return;
      }
    }

    if (userToken && userExpiry && now >= userExpiry) {
      localStorage.removeItem("access_token");
      navigate("/home");
      return;
    }

    if (userToken && ["/login", "/signup"].includes(currentPath)) {
      navigate("/viewclubs");
      return;
    }
    const publicPaths = ["/login", "/signup", "/home"];
    const isPublic = publicPaths.includes(currentPath);
    if (!userToken && !isPublic && !isAdminPath && !isSpecialAdminPath) {
      navigate("/home");
    }
  }, [navigate]);
};

export default useAuthCheck;

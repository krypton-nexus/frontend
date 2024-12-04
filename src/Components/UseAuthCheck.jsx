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
    } else if (!token && currentPath !== "/login" && currentPath !== "/home") {
      // Redirect to /home if the user is not logged in and trying to access a protected route
      navigate("/home");
    }
  }, [navigate]);
};

export default useAuthCheck;

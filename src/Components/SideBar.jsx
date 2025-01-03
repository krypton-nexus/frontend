// import React from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   FaUsers,
//   FaRss,
//   FaCalendarAlt,
//   FaComment,
//   FaListAlt,
//   FaSignOutAlt,
//   FaRegBell,
// } from "react-icons/fa";
// import logo1short from "../Images/logo1short.png";
// import "../CSS/SideBar.css";

// const Sidebar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     // Clear client-side session and authentication data
//     localStorage.removeItem("access_token");
//     sessionStorage.clear();

//     try {
//       // Call the API to invalidate the server-side session
//       const response = await fetch(
//         " http://43.205.202.255:5000/student/logout",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Logout failed with status: ${response.status}`);
//       }

//       // After successful logout, navigate to the home page
//       navigate("/home", { replace: true });

//       alert("You have logged out successfully.");
//     } catch (error) {
//       console.error("Logout error:", error);
//       alert("An error occurred during logout. Please try again.");
//     }
//   };

//   const menuItems = [
//     { path: "/viewclubs", label: "View Clubs", icon: <FaUsers /> },
//     { path: "/view-feed", label: "View Feed", icon: <FaRss /> },
//     { path: "/view-events", label: "View Events", icon: <FaCalendarAlt /> },
//     { path: "/communication", label: "Communication", icon: <FaComment /> },
//     {
//       path: "/merchandise",
//       label: "Purchase Merchandise",
//       icon: <FaListAlt />,
//     },
//     { path: "/notifications", label: "Notification", icon: <FaRegBell /> },
//   ];

//   return (
//     <aside className="sidebar">
//       <Link to="/home">
//         <img src={logo1short} alt="Nexus Club Platform Logo" className="logo" />
//       </Link>
//       <ul className="menu">
//         {menuItems.map(({ path, label, icon }) => (
//           <li key={path} className={location.pathname === path ? "active" : ""}>
//             <Link to={path}>
//               {icon} {label}
//             </Link>
//           </li>
//         ))}
//       </ul>
//       <button className="logout" onClick={handleLogout}>
//         <FaSignOutAlt /> Logout
//       </button>
//     </aside>
//   );
// };

// export default Sidebar;
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaRss,
  FaCalendarAlt,
  FaComment,
  FaListAlt,
  FaSignOutAlt,
  FaRegBell,
} from "react-icons/fa";
import logo1short from "../Images/logo1short.png";
import "../CSS/SideBar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear client-side session and authentication data
    localStorage.removeItem("access_token");
    sessionStorage.clear();

    // After successful logout, navigate to the home page
    navigate("/home", { replace: true });

  };

  const menuItems = [
    { path: "/viewclubs", label: "View Clubs", icon: <FaUsers /> },
    { path: "/view-feed", label: "View Feed", icon: <FaRss /> },
    { path: "/view-events", label: "View Events", icon: <FaCalendarAlt /> },
    { path: "/communication", label: "Communication", icon: <FaComment /> },
    {
      path: "/merchandise",
      label: "Purchase Merchandise",
      icon: <FaListAlt />,
    },
    { path: "/notifications", label: "Notification", icon: <FaRegBell /> },
  ];

  return (
    <aside className="sidebar">
      <Link to="/home">
        <img src={logo1short} alt="Nexus Club Platform Logo" className="logo" />
      </Link>
      <ul className="menu">
        {menuItems.map(({ path, label, icon }) => (
          <li key={path} className={location.pathname === path ? "active" : ""}>
            <Link to={path}>
              {icon} {label}
            </Link>
          </li>
        ))}
      </ul>
      <button className="logout" onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;

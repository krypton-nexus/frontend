import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Import Components
import ClubDetails from "./Components/ClubDetails";
import ChatBot from "./Components/ChatBot";
import UseAuthCheck from "./Components/UseAuthCheck";

// Import Pages
import Home from "./Pages/Home";
import ShowClubs from "./Components/ShowClubs";
import SesaPage from "./Pages/SesaPage";
import GavelPage from "./Pages/GavelPage";
import Login from "./Components/Login";
import AdminLogin from "./Components/AdminLogin";
import Signup from "./Components/Signup";
import UserProfile from "./Pages/UserProfile";
import AdminDashboard from "./Pages/AdminDashboard";

const NoButtonLayout = ({ children }) => (
  <>
    {children}
    <ChatBot />
  </>
);

const App = () => {
  return (
    <Router>
      <UseAuthCheck /> {/* Runs the auth check on app load */}
      <Routes>
        {/* Redirect root path to /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Public Routes */}
        <Route
          path="/home"
          element={
            <NoButtonLayout>
              <Home />
            </NoButtonLayout>
          }
        />
        <Route
          path="/viewclubs"
          element={
            <NoButtonLayout>
              <ShowClubs />
            </NoButtonLayout>
          }
        />
        <Route
          path="/sesapage"
          element={
            <NoButtonLayout>
              <SesaPage />
            </NoButtonLayout>
          }
        />
        <Route
          path="/gavelpage"
          element={
            <NoButtonLayout>
              <GavelPage />
            </NoButtonLayout>
          }
        />
        <Route
          path="/club/:clubId"
          element={
            <NoButtonLayout>
              <ClubDetails />
            </NoButtonLayout>
          }
        />

        {/* Authentication Routes */}
        <Route
          path="/login"
          element={
            <NoButtonLayout>
              <Login />
            </NoButtonLayout>
          }
        />
        <Route
          path="/adminlogin"
          element={
            <NoButtonLayout>
              <AdminLogin />
            </NoButtonLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <NoButtonLayout>
              <Signup />
            </NoButtonLayout>
          }
        />
        <Route
          path="/admindashboard"
          element={
            <NoButtonLayout>
              <AdminDashboard/>
            </NoButtonLayout>
          }
        />
        {/* <Route
          path="/auth/verify/:token"
          element={
            <NoButtonLayout>
              <VerifyEmail />
            </NoButtonLayout>
          }
        /> */}

        {/* User Profile */}
        <Route
          path="/userprofile"
          element={
            <NoButtonLayout>
              <UserProfile />
            </NoButtonLayout>
          }
        />

        {/* Fallback 404 Route */}
        {/* <Route
          path="*"
          element={
            <NoButtonLayout>
              <NotFound />
            </NoButtonLayout>
          }
        /> */}
      </Routes>
    </Router>
  );
};

export default App;
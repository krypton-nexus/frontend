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
import CommunicationChannel from "./Components/CommunicationChannel";
import ChannelList from "./Components/ChannelList";
import ClubChannel from "./Components/ClubChannel";

// Import Pages
import Home from "./Pages/Home";
import ShowClubs from "./Components/ShowClubs";
import ViewEvents from "./Pages/ViewEvents";
import SesaPage from "./Pages/SesaPage";
import GavelPage from "./Pages/GavelPage";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import UserProfile from "./Pages/UserProfile";
import AdminDashboard from "./Pages/AdminDashboard";
import Notification from "./Pages/Notification";
import Merchandise from "./Pages/Merchandise";
import AdminLogin from "./Components/AdminLogin";

// Layout Wrapper to include ChatBot in all pages
const NoButtonLayout = ({ children }) => (
  <>
    {children}
    <ChatBot />
  </>
);

const App = () => {
  return (
    <Router>
      <UseAuthCheck />
      <Routes>
        {/* Redirect root path to home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Public Pages */}
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
          path="/viewevents"
          element={
            <NoButtonLayout>
              <ViewEvents />
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

        {/* Admin Dashboard */}
        <Route
          path="/admindashboard"
          element={
            <NoButtonLayout>
              <AdminDashboard />
            </NoButtonLayout>
          }
        />

        {/* User Profile */}
        <Route
          path="/userprofile"
          element={
            <NoButtonLayout>
              <UserProfile />
            </NoButtonLayout>
          }
        />

        {/* Notifications and Merchandise */}
        <Route
          path="/notification"
          element={
            <NoButtonLayout>
              <Notification />
            </NoButtonLayout>
          }
        />
        <Route
          path="/merchandise"
          element={
            <NoButtonLayout>
              <Merchandise />
            </NoButtonLayout>
          }
        />

        {/* Clubs & Communication */}
        <Route
          path="/clubdetails"
          element={
            <NoButtonLayout>
              <ClubDetails />
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
        <Route
          path="/clubs"
          element={
            <NoButtonLayout>
              <ChannelList />
            </NoButtonLayout>
          }
        />
        <Route
          path="/club/:clubId/channel"
          element={
            <NoButtonLayout>
              <ClubChannel />
            </NoButtonLayout>
          }
        />
        <Route
          path="/communication"
          element={
            <NoButtonLayout>
              <CommunicationChannel />
            </NoButtonLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

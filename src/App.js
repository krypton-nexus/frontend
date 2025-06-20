import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ClubDetails from "./Components/ClubDetails";
import ChatBot from "./Components/ChatBot";
import UseAuthCheck from "./Components/UseAuthCheck";
import AdminLogin from "./Components/AdminLogin";
import ShowClubs from "./Components/ShowClubs";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import UserProfile from "./Components/UserProfile";
import ClubPollingProvider from "./Components/ClubPollingProvider";

// Import Pages
import Home from "./Pages/Home";
import ViewEvents from "./Pages/ViewEvents";
import Finance from "./Pages/Finance";
import AdminDashboard from "./Pages/AdminDashboard";
import AddEvent from "./Pages/AddEvent";
import AdminEvent from "./Pages/AdminEvent";
import AddProduct from "./Pages/AddProduct";
import AdminMarketplace from "./Pages/AdminMarketplace";
import Notification from "./Pages/Notification";
import Merchandise from "./Pages/Merchandise";
import Communication from "./Pages/Communication";
import Task from "./Pages/Task";
import ViewFeed from "./Pages/ViewFeed";
import SystemAdminDashboard from "./Pages/SystemAdminDashboard";

// Layout Wrapper to include ChatBot in all pages
const NoButtonLayout = ({ children }) => (
  <>
    <ClubPollingProvider />
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
          path="/finance"
          element={
            <NoButtonLayout>
              <Finance />
            </NoButtonLayout>
          }
        />
        <Route
          path="/addevent"
          element={
            <NoButtonLayout>
              <AddEvent />
            </NoButtonLayout>
          }
        />
        <Route
          path="/addproduct"
          element={
            <NoButtonLayout>
              <AddProduct />
            </NoButtonLayout>
          }
        />
        <Route
          path="/adminevent"
          element={
            <NoButtonLayout>
              <AdminEvent />
            </NoButtonLayout>
          }
        />
        <Route
          path="/adminmarketplace"
          element={
            <NoButtonLayout>
              <AdminMarketplace />
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
          path="admin"
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
        <Route
          path="/communication"
          element={
            <NoButtonLayout>
              <Communication />
            </NoButtonLayout>
          }
        />
        <Route
          path="/task"
          element={
            <NoButtonLayout>
              <Task />
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
          path="/add-product"
          element={
            <NoButtonLayout>
              <AddProduct />
            </NoButtonLayout>
          }
        />
        <Route
          path="/view-feed"
          element={
            <NoButtonLayout>
              <ViewFeed />
            </NoButtonLayout>
          }
        />
        <Route
          path="/system-admin-dashboard"
          element={
            <NoButtonLayout>
              <SystemAdminDashboard />
            </NoButtonLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

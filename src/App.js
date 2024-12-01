import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Components
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import BackToTopButton from "./components/BackToTopButton";
// import Blog from "./pages/blog";

// Import Pages
import Home from "./Pages/Home";
import ViewClubs from "./Pages/ViewClubs";
import SesaPage from "./Pages/SesaPage";
import GavelPage from "./Pages/GavelPage";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import VerifyEmail from "./Components/VerifyEmail";
import UserProfile from "./Pages/UserProfile";
import ChatBot from "./Components/ChatBot";
import Verify from "./Components/VerifyEmail";
// import Profile from "./Admin/Profile";

const NoButtonLayout = ({ children }) => {
  return (
    <>
      {/* <Header /> */}
      {children}
      {/* <Footer /> */}
      <ChatBot />
      {/* <BackToTopButton /> */}
    </>
  );
};

const App = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => setIsChatbotOpen((prev) => !prev);

  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/"
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
                <ViewClubs />
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
          {/* <Route
            path="/about"
            element={
              <NoButtonLayout>
                <AboutUs />
              </NoButtonLayout>
            }
          />
          <Route
            path="/services"
            element={
              <NoButtonLayout>
                <Service />
              </NoButtonLayout>
            }
          />
          <Route
            path="/media"
            element={
              <NoButtonLayout>
                <Media />
              </NoButtonLayout>
            }
          />

          <Route
            path="/projectpage"
            element={
              <NoButtonLayout>
                <ProjectPage />
              </NoButtonLayout>
            }
          />
          <Route
            path="/eventpage"
            element={
              <NoButtonLayout>
                <EventPage />
              </NoButtonLayout>
            }
          />
          <Route
            path="/donation"
            element={
              <NoButtonLayout>
                <Donation />
              </NoButtonLayout>
            }
          />
          <Route
            path="/login"
            element={
              <NoButtonLayout>
                <Login />
              </NoButtonLayout>
            }
          />
          <Route
            path="/blog1"
            element={
              <NoButtonLayout>
                <Blog1 />
              </NoButtonLayout>
            }
          />
          <Route
            path="/blog"
            element={
              <>
                {<Header />}
                <Blog />
              </>
            }
          /> */}
          <Route
            path="/home"
            element={
              <NoButtonLayout>
                <Home />
              </NoButtonLayout>
            }
          />
          <Route
            path="/login"
            element={
              <NoButtonLayout>
                <Login />
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
            path="/"
            element={
              <>
                <Home
                  isChatbotOpen={isChatbotOpen}
                  toggleChatbot={toggleChatbot}
                />
                <ChatBot
                  isChatbotOpen={isChatbotOpen}
                  toggleChatbot={toggleChatbot}
                />
              </>
            }
          />
          <Route path="/auth/verify/:token" element={<VerifyEmail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/userprofile" element={<UserProfile />} />{" "}
          <Route path="/verify/:token" element={<Verify />} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

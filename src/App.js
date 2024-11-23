import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Components
// import Header from "./components/Header";
// import Footer from "./components/Footer";
import Help from "./Components/Help";
// import BackToTopButton from "./components/BackToTopButton";
// import Blog from "./pages/blog";

// Import Pages
import Home from "./Pages/Home";

import Login from "./Components/Login";
// import Signup from "./Components/Signup";
import SignupTest3 from "./Components/SignupTest3";

// import Profile from "./Admin/Profile";

const NoButtonLayout = ({ children }) => {
  return (
    <>
      {/* <Header /> */}
      {children}
      {/* <Footer /> */}
      <Help />
      {/* <BackToTopButton /> */}
    </>
  );
};

const App = () => {
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
          {/* <Route
            path="/signup"
            element={
              <NoButtonLayout>
                <Signup />
              </NoButtonLayout>
            }
          /> */}
          <Route
            path="/signuptest3"
            element={
              <NoButtonLayout>
                <SignupTest3 />
              </NoButtonLayout>
            }
          />
          {/* <Route path="/blogpost" element={<BlogPostForm />} /> */}
          <Route path="/login" element={<Login />} />
          {/* <Route path="/signup" element={<Signup />} /> */}
          <Route path="/signuptest3" element={<SignupTest3 />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
        </Routes>
      </Router>
    </div>
  );
};

export default App;

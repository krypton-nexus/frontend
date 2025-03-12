import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../CSS/Signup.css";
import logo1 from "../Images/logo1.png";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    faculty: "",
    department: "",
    year: "",
    courseName: "",
    studentNumber: "",
    dateOfBirth: "",
  });
  const navigate = useNavigate();

  // Validation Functions
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError("Email is required.");
    } else if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (value) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!value) {
      setPasswordError("Password is required.");
    } else if (!passwordRegex.test(value)) {
      setPasswordError(
        "Password must include at least 8 characters with uppercase, lowercase, number, and special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = (value) => {
    if (!value) {
      setConfirmPasswordError("Confirm Password is required.");
    } else if (value !== password) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate fields dynamically
    if (name === "email") validateEmail(value);
    if (name === "password") validatePassword(value);
    if (name === "confirmPassword") validateConfirmPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submission
    validateEmail(email);
    validatePassword(password);
    validateConfirmPassword(confirmPassword);

    // Check for any validation errors
    if (!emailError && !passwordError && !confirmPasswordError) {
      setLoading(true);
      try {
        // Submit registration data
        const response = await axios.post(
          "http://43.205.202.255:5000/student/register",
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: email,
            phone_number: formData.phoneNumber,
            faculty: formData.faculty,
            department: formData.department,
            year: formData.year,
            course_name: formData.courseName,
            student_number: formData.studentNumber,
            dob: formData.dateOfBirth,
            password: password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          enqueueSnackbar(
            "Registration successful! Please verify your email.",
            {
              variant: "success",
            }
          );
          navigate("/verify/:token");
          setFormData({
            firstName: "",
            lastName: "",
            phoneNumber: "",
            faculty: "",
            department: "",
            year: "",
            courseName: "",
            studentNumber: "",
            dateOfBirth: "",
          });
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        }
      } catch (error) {
        if (error.response) {
          console.error("Response data:", error.response.data); // Log response data for more insights
          setError(error.response.data.error);
        } else
          enqueueSnackbar(
            "An error occurred during registration. Please check your input.",
            { variant: "error" }
          );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="signup-container">
      <Link to="/home">
        <img src={logo1} alt="Logo" className="logo" />
      </Link>
      <div className="signup-box">
        <h2>
          WELCOME <span className="highlight">NEXUS</span>
        </h2>
        <p>Welcome to Nexus Dashboard Community</p>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="input-field"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="input-field"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className={`input-field ${emailError ? "error-border" : ""}`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                required
              />
              {emailError && (
                <div className="error-box">
                  <span className="error-icon">!</span>
                  {emailError}
                </div>
              )}
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                className="input-field"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-wrapper">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={`input-field ${passwordError ? "error-border" : ""}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                required
              />
              {passwordError && (
                <div className="error-box">
                  <span className="error-icon">!</span>
                  {passwordError}
                </div>
              )}
            </div>
            <div className="input-wrapper">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className={`input-field ${
                  confirmPasswordError ? "error-border" : ""
                }`}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateConfirmPassword(e.target.value);
                }}
                required
              />
              {confirmPasswordError && (
                <div className="error-box">
                  <span className="error-icon">!</span>
                  {confirmPasswordError}
                </div>
              )}
            </div>
          </div>
          <div className="form-row">
            <input
              type="text"
              name="faculty"
              placeholder="Faculty"
              className="input-field"
              value={formData.faculty}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="department"
              placeholder="Department"
              className="input-field"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              name="year"
              placeholder="Year"
              className="input-field"
              value={formData.year}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="courseName"
              placeholder="Course Name"
              className="input-field"
              value={formData.courseName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              name="studentNumber"
              placeholder="Student Number"
              className="input-field"
              value={formData.studentNumber}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="dateOfBirth"
              className="input-field"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember Me</label>
          </div>
          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p className="register">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

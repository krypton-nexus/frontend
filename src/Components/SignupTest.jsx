import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";

import "../CSS/Signup.css";
import logo1 from "../Images/logo1.png";

// Cognito Configuration (Replace with your actual values)
const poolData = {
  UserPoolId: "ap-south-1_z7LlV43Z1", // Your Cognito User Pool ID
  ClientId: "76mvqvob9ttth1jb9dlng1rjlj", // Your Cognito App Client ID
};

const userPool = new CognitoUserPool(poolData);

const SignupTest = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    faculty: "",
    department: "",
    year: "",
    courseName: "",
    studentNumber: "",
    dob: "",
  });

  const navigate = useNavigate(); // Using useNavigate for React Router v6

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        faculty,
        department,
        year,
        courseName,
        studentNumber,
        dob,
      } = formData;

      // Create Cognito user attributes
      const attributeList = [
        new CognitoUserAttribute({
          Name: "email",
          Value: email,
        }),
        new CognitoUserAttribute({
          Name: "given_name",
          Value: firstName,
        }),
        new CognitoUserAttribute({
          Name: "family_name",
          Value: lastName,
        }),
        new CognitoUserAttribute({
          Name: "phone_number",
          Value: phoneNumber,
        }),
        new CognitoUserAttribute({
          Name: "custom:faculty", // Custom attributes
          Value: faculty,
        }),
        new CognitoUserAttribute({
          Name: "custom:department",
          Value: department,
        }),
        new CognitoUserAttribute({
          Name: "custom:year",
          Value: year,
        }),
        new CognitoUserAttribute({
          Name: "custom:courseName",
          Value: courseName,
        }),
        new CognitoUserAttribute({
          Name: "custom:studentNumber",
          Value: studentNumber,
        }),
        new CognitoUserAttribute({
          Name: "birthdate",
          Value: dob,
        }),
      ];

      // Sign up user
      const signUpData = await new Promise((resolve, reject) => {
        userPool.signUp(email, password, attributeList, null, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      console.log("Signup successful: ", signUpData);
      alert("Signup successful! Please check your email to confirm.");
      navigate("/login"); // Redirect to login page after signup
    } catch (error) {
      console.error("Error signing up:", error);
      alert(error.message || "Error signing up. Please try again.");
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
        <p>Welcome to Nexus dashboard Community</p>
        <form className="signup-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="First Name"
              className="input-field"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="input-field"
              required
            />
          </div>
          <div className="form-row">
            <input
              type="email"
              placeholder="Email Address"
              className="input-field"
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="input-field"
              required
            />
          </div>
          <div className="form-row">
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="input-field"
              required
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Faculty"
              className="input-field"
              required
            />
            <input
              type="text"
              placeholder="Department"
              className="input-field"
              required
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Year"
              className="input-field"
              required
            />
            <input
              type="text"
              placeholder="Course Name"
              className="input-field"
              required
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Student Number"
              className="input-field"
              required
            />
            <input
              type="date"
              placeholder="Date of Birth"
              className="input-field"
              required
            />
          </div>
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember Me</label>
          </div>
          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
        <p className="register">
          If you don’t have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupTest;

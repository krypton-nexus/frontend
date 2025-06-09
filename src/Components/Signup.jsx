import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import "../CSS/Signup.css";
import logo1 from "../Images/logo1.png";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const facultyData = {
  "Faculty of Commerce & Management studies": [
    "DEPARTMENT OF ACCOUNTANCY",
    "DEPARTMENT OF COMMERCE & FINANCIAL MANAGEMENT",
    "DEPARTMENT OF FINANCE",
    "DEPARTMENT OF HUMAN RESOURCE MANAGEMENT",
    "DEPARTMENT OF MARKETING MANAGEMENT",
  ],
  "Faculty of Computing and Technology": [
    "Department of Applied Computing",
    "Department of Computer Systems Engineering",
    "Department of Software Engineering",
  ],
  "Faculty of Humanities": [
    "Drama, Cinema, and Television",
    "English",
    "English Language Teaching",
    "Fine Arts",
    "Hindi Studies",
    "Linguistics",
    "Modern Languages",
    "Pali & Buddhist Studies",
    "Sanskrit and Eastern Studies",
    "Sinhala",
    "Western Classical Culture & Christian Culture",
  ],
  "Faculty of Medicine": [
    "Anatomy",
    "Biochemistry & Clinical Chemistry",
    "Disability Studies",
    "Family Medicine",
    "Forensic Medicine",
    "Medicine",
    "Medical Education",
    "Medical Microbiology",
    "Obstetrics & Gynaecology",
    "Paediatrics",
    "Parasitology",
    "Pathology",
    "Pharmacology",
    "Physiology",
    "Psychiatry",
    "Public Health",
    "Surgery",
  ],
  "Faculty of Science": [
    "Software Engineering Teaching Unit",
    "Sports & Exercise Science",
    "Chemistry",
    "Industrial Management",
    "Mathematics",
    "Microbiology",
    "Physics and Electronics",
    "Plant and Molecular Biology",
    "Statistics & Computer Science",
    "Zoology and Environmental Management",
  ],
  "Faculty of Social Sciences": [
    "Archaeology",
    "Economics",
    "Geography",
    "History",
    "Information Technology",
    "International Studies",
    "Mass Communication",
    "Library and Information Science",
    "Philosophy",
    "Political Science",
    "Sociology",
    "Social Statistics",
    "Sport Science and Physical Education",
  ],
};

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    faculty: "",
    department: "",
    year: "",
    courseName: "",
    studentNumber: "",
    dateOfBirth: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validateFields = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.firstName) errors.firstName = "First name is required.";
    if (!formData.lastName) errors.lastName = "Last name is required.";
    if (!formData.email || !emailRegex.test(formData.email))
      errors.email = "Enter a valid email address.";
    if (!formData.phoneNumber) errors.phoneNumber = "Phone number is required.";
    if (!formData.password || !passwordRegex.test(formData.password))
      errors.password =
        "Password must be 8+ chars and include uppercase, lowercase, number & special character.";
    if (formData.confirmPassword !== formData.password)
      errors.confirmPassword = "Passwords do not match.";
    if (!formData.faculty) errors.faculty = "Faculty is required.";
    if (!formData.department) errors.department = "Department is required.";
    if (!formData.year) errors.year = "Year is required.";
    if (!formData.courseName) errors.courseName = "Course name is required.";
    if (!formData.studentNumber)
      errors.studentNumber = "Student number is required.";
    if (!formData.dateOfBirth)
      errors.dateOfBirth = "Date of birth is required.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "faculty") {
      setFormData((prev) => ({
        ...prev,
        faculty: value,
        department: "", // reset department when faculty changes
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setFormErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/student/register`,
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          faculty: formData.faculty,
          department: formData.department,
          year: formData.year,
          course_name: formData.courseName,
          student_number: formData.studentNumber,
          dob: formData.dateOfBirth,
          password: formData.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        enqueueSnackbar("Registration successful! Please verify your email.", {
          variant: "success",
        });
        navigate("/verify/:token");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          faculty: "",
          department: "",
          year: "",
          courseName: "",
          studentNumber: "",
          dateOfBirth: "",
        });
      }
    } catch (err) {
      if (err.response?.data?.error) {
        setServerError(err.response.data.error);
      } else {
        enqueueSnackbar("Something went wrong. Please try again later.", {
          variant: "error",
        });
      }
    } finally {
      setLoading(false);
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
              name="firstName"
              placeholder="First Name"
              required
              className="input-field"
              value={formData.firstName}
              onChange={handleChange}
            />
            <input
              name="lastName"
              placeholder="Last Name"
              className="input-field"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <input
              name="email"
              placeholder="Email Address"
              className={`input-field ${
                formErrors.email ? "error-border" : ""
              }`}
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="phoneNumber"
              placeholder="Phone Number"
              className="input-field"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <input
              name="password"
              type="password"
              placeholder="Password"
              className={`input-field ${
                formErrors.password ? "error-border" : ""
              }`}
              value={formData.password}
              onChange={handleChange}
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className={`input-field ${
                formErrors.confirmPassword ? "error-border" : ""
              }`}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <select
              name="faculty"
              className="input-field"
              value={formData.faculty}
              onChange={handleChange}
            >
              <option value="">Select Faculty</option>
              {Object.keys(facultyData).map((faculty) => (
                <option key={faculty} value={faculty}>
                  {faculty}
                </option>
              ))}
            </select>
            <select
              name="department"
              className="input-field"
              value={formData.department}
              onChange={handleChange}
              disabled={!formData.faculty}
            >
              <option value="">Select Department</option>
              {facultyData[formData.faculty]?.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <select
              name="year"
              className="input-field"
              value={formData.year}
              onChange={handleChange}
            >
              <option value="">Select Year</option>
              {[1, 2, 3, 4, 5].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <input
              name="courseName"
              placeholder="Course Name (e.g., SE, PS, PE)"
              className="input-field"
              value={formData.courseName}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <input
              name="studentNumber"
              placeholder="Student Number"
              className="input-field"
              value={formData.studentNumber}
              onChange={handleChange}
            />
            <input
              name="dateOfBirth"
              type="date"
              className="input-field"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          {Object.entries(formErrors).map(
            ([key, error]) =>
              error && (
                <p className="error-message" key={key}>
                  {error}
                </p>
              )
          )}
          {serverError && <p className="error-message">{serverError}</p>}
        </form>

        <p className="register">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

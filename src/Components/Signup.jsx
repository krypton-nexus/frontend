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

const countryOptions = [
  { code: "+1", name: "USA", flag: "🇺🇸", maxLength: 10 },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧", maxLength: 10 },
  { code: "+91", name: "India", flag: "🇮🇳", maxLength: 10 },
  { code: "+94", name: "Sri Lanka", flag: "🇱🇰", maxLength: 9 },
  { code: "+61", name: "Australia", flag: "🇦🇺", maxLength: 9 },
  { code: "+81", name: "Japan", flag: "🇯🇵", maxLength: 10 },
  { code: "+86", name: "China", flag: "🇨🇳", maxLength: 11 },
  { code: "+49", name: "Germany", flag: "🇩🇪", maxLength: 11 },
  { code: "+33", name: "France", flag: "🇫🇷", maxLength: 9 },
  { code: "+39", name: "Italy", flag: "🇮🇹", maxLength: 10 },
  { code: "+7", name: "Russia", flag: "🇷🇺", maxLength: 10 },
  { code: "+34", name: "Spain", flag: "🇪🇸", maxLength: 9 },
  { code: "+60", name: "Malaysia", flag: "🇲🇾", maxLength: 9 },
  { code: "+65", name: "Singapore", flag: "🇸🇬", maxLength: 8 },
  { code: "+62", name: "Indonesia", flag: "🇮🇩", maxLength: 10 },
  { code: "+880", name: "Bangladesh", flag: "🇧🇩", maxLength: 10 },
  { code: "+92", name: "Pakistan", flag: "🇵🇰", maxLength: 10 },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦", maxLength: 9 },
  { code: "+971", name: "United Arab Emirates", flag: "🇦🇪", maxLength: 9 },
  { code: "+974", name: "Qatar", flag: "🇶🇦", maxLength: 8 },
  { code: "+20", name: "Egypt", flag: "🇪🇬", maxLength: 10 },
  { code: "+27", name: "South Africa", flag: "🇿🇦", maxLength: 9 },
  { code: "+256", name: "Uganda", flag: "🇺🇬", maxLength: 9 },
  { code: "+234", name: "Nigeria", flag: "🇳🇬", maxLength: 10 },
  { code: "+351", name: "Portugal", flag: "🇵🇹", maxLength: 9 },
  { code: "+47", name: "Norway", flag: "🇳🇴", maxLength: 8 },
  { code: "+46", name: "Sweden", flag: "🇸🇪", maxLength: 9 },
  { code: "+45", name: "Denmark", flag: "🇩🇰", maxLength: 8 },
  { code: "+41", name: "Switzerland", flag: "🇨🇭", maxLength: 9 },
  { code: "+82", name: "South Korea", flag: "🇰🇷", maxLength: 10 },
  { code: "+84", name: "Vietnam", flag: "🇻🇳", maxLength: 9 },
  { code: "+66", name: "Thailand", flag: "🇹🇭", maxLength: 9 },
  { code: "+63", name: "Philippines", flag: "🇵🇭", maxLength: 10 },
  { code: "+48", name: "Poland", flag: "🇵🇱", maxLength: 9 },
  { code: "+52", name: "Mexico", flag: "🇲🇽", maxLength: 10 },
  { code: "+598", name: "Uruguay", flag: "🇺🇾", maxLength: 9 },
  { code: "+591", name: "Bolivia", flag: "🇧🇴", maxLength: 8 },
  { code: "+54", name: "Argentina", flag: "🇦🇷", maxLength: 10 },
  { code: "+55", name: "Brazil", flag: "🇧🇷", maxLength: 11 },
  { code: "+998", name: "Uzbekistan", flag: "🇺🇿", maxLength: 9 },
  { code: "+976", name: "Mongolia", flag: "🇲🇳", maxLength: 8 },
  { code: "+90", name: "Turkey", flag: "🇹🇷", maxLength: 10 },
];

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
  const [selectedCountry, setSelectedCountry] = useState(countryOptions[3]);

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
    if (!formData.phoneNumber) {
      errors.phoneNumber = "Phone number is required.";
    } else if (formData.phoneNumber.length !== selectedCountry.maxLength) {
      errors.phoneNumber = `Phone number must be ${selectedCountry.maxLength} digits.`;
    } else if (formData.phoneNumber[0] === "0") {
      errors.phoneNumber = "Phone number should not start with 0.";
    }

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
            <div className="form-ro">
              <div className="phone-container">
                <select
                  className="country-select"
                  value={selectedCountry.code}
                  onChange={(e) => {
                    const selected = countryOptions.find(
                      (c) => c.code === e.target.value
                    );
                    setSelectedCountry(selected);
                    setFormData((prev) => ({ ...prev, phoneNumber: "" }));
                  }}
                >
                  {countryOptions.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="phone-input"
                  placeholder="Enter phone number"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (
                      /^\d*$/.test(val) &&
                      val.length <= selectedCountry.maxLength
                    ) {
                      if (val.length === 0 || val[0] !== "0") {
                        setFormData((prev) => ({ ...prev, phoneNumber: val }));
                      }
                    }
                  }}
                  maxLength={selectedCountry.maxLength}
                />
              </div>
            </div>
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

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../CSS/VerifyEmail.css";

const VerifyEmail = () => {
  const { token } = useParams(); // Extract token from URL
  const [status, setStatus] = useState("loading"); // loading, success, error, alreadyVerified, notVerified
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `http://13.232.48.203:5000/auth/verify/${token}`
        );

        if (response.status === 200) {
          if (response.data.is_verified) {
            setStatus("alreadyVerified");
            setMessage("Your email is already verified. You can now log in.");
          } else {
            setStatus("notVerified");
            setMessage(
              "Your email is not yet verified. Please check your inbox."
            );
          }
        }
      } catch (error) {
        setStatus("error");
        if (error.response?.status === 404) {
          setMessage(
            "The verification link is invalid or expired. Please request a new one."
          );
        } else {
          setMessage(
            error.response?.data?.message ||
              "An error occurred. Please try again later."
          );
        }
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="verify-email-container">
      <h2>Email Verification</h2>
      {status === "loading" && <p>Verifying your email, please wait...</p>}
      {status === "success" && (
        <>
          <p className="success-message">{message}</p>
          <Link to="/login" className="btn">
            Go to Login
          </Link>
        </>
      )}
      {status === "alreadyVerified" && (
        <>
          <p className="success-message">{message}</p>
          <Link to="/login" className="btn">
            Go to Login
          </Link>
        </>
      )}
      {status === "notVerified" && (
        <>
          <p className="error-message">{message}</p>
          <p>
            Please verify your email to continue. Check your inbox for the
            verification link.
          </p>
          <Link to="/resend-verification" className="btn">
            Resend Verification Email
          </Link>
        </>
      )}
      {status === "error" && (
        <>
          <p className="error-message">{message}</p>
          <Link to="/resend-verification" className="btn">
            Resend Verification Email
          </Link>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
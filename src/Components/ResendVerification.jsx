import React, { useState } from "react";
import axios from "axios";
import "../CSS/ResendVerification.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { status } = await axios.post(
        `${BASE_URL}/student/resend-verification`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (status === 200) {
        setMessage(
          "Verification email has been resent. Please check your inbox."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resend-verification-container">
      <h2>Resend Verification Email</h2>
      <p>
        If you didn’t receive the verification email, enter your email address
        below to resend it.
      </p>
      <form onSubmit={handleResend}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Resending..." : "Resend Email"}
        </button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ResendVerification;

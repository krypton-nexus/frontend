import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Verify = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/auth/verify/${token}`);
        setMessage(response.data.message || "Verification successful.");
        setStatus("success");
        enqueueSnackbar("Email verified successfully!", { variant: "success" });

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2500);
      } catch (error) {
        console.error("Verification error:", error);
        setMessage("Verification failed or link has expired.");
        setStatus("error");
        enqueueSnackbar("Verification failed. Please request a new link.", {
          variant: "error",
        });
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>
        {status === "loading" ? "wait" : status === "success" ? "verified" : "verfication failed"}
      </h2>
      <p>{message}</p>
    </div>
  );
};

export default Verify;

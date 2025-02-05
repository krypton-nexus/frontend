import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Verify = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `http://43.205.202.255:5000/auth/verify/${token}`
        );
        setMessage(response.data.message);
        setTimeout(() => {
          window.location.reload(); // Automatically refresh the page
        }, 2000); // Adjust delay as needed
      } catch (error) {
        setMessage("Verification failed or link expired.");
      }
    };

    verifyEmail();
  }, [token]);

  return <div>{message}</div>;
};

export default Verify;
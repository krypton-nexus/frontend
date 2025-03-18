// MessageForm.jsx
import React, { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { jwtDecode } from "jwt-decode";
import "../CSS/MessageForm.css";
import { FaPaperPlane, FaPlus, FaRegSmile } from "react-icons/fa";

const MessageForm = ({ clubId, userEmail }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  useEffect(() => {
    const checkAuthorization = () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setIsAuthorized(decodedToken.email === userEmail);
        } catch (error) {
          console.error("Error decoding token:", error);
          setIsAuthorized(false);
        }
      } else {
        setIsAuthorized(false);
      }
    };

    checkAuthorization();
  }, [userEmail]);
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Message cannot be empty.");
      return;
    }
    if (!isAuthorized) {
      setError("You are not authorized to send messages.");
      return;
    }
    try {
      await addDoc(collection(db, "messages", clubId, "messages"), {
        sendersEmail: userEmail,
        text: text.trim(),
        timestamp: serverTimestamp(),
      });
      setText("");
      setError(null);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="message-form-container">
      {!isAuthorized && (
        <p className="error-message">
          You are not authorized to send messages.
        </p>
      )}
      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
          disabled={!isAuthorized}
        />
        <button
          type="submit"
          className="message-send-button"
          disabled={!isAuthorized}>
          <FaPaperPlane />
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default MessageForm;

import React, { useState, useEffect, useRef } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { jwtDecode } from "jwt-decode";
import "../CSS/MessageForm.css";
import { FaPaperPlane } from "react-icons/fa";

const TYPING_TIMEOUT = 2000; // 2 seconds timeout

const MessageForm = ({ clubId, userEmail }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [usersTyping, setUsersTyping] = useState([]);
  const typingTimeoutRef = useRef(null);

  // Check if the current user is authorized by comparing the decoded token email
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

  // Update the typing status in Firestore under the "typingIndicators" collection.
  const updateTypingStatus = async (typing) => {
    if (!clubId || !userEmail) return;
    const typingDocRef = doc(db, "typingIndicators", clubId);
    try {
      await setDoc(
        typingDocRef,
        { [userEmail]: typing ? serverTimestamp() : null },
        { merge: true }
      );
    } catch (error) {
      console.error("Error updating typing status:", error);
    }
  };

  // Handle the onChange event. Each time the user types, update the status.
  // A timeout resets the status to “not typing” after TYPING_TIMEOUT ms of inactivity.
  const handleTyping = (e) => {
    setText(e.target.value);
    updateTypingStatus(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      updateTypingStatus(false);
    }, TYPING_TIMEOUT);
  };

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
      updateTypingStatus(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  // Helper function to fetch first name from the API using the email and token.
  const fetchFirstName = async (email) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://43.205.202.255:5000/student/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.first_name || email;
    } catch (error) {
      console.error("Error fetching first name for", email, error);
      return email;
    }
  };

  // Listen to the typing indicator document in Firestore.
  // Only include users who have updated their timestamp within TYPING_TIMEOUT ms.
  useEffect(() => {
    if (!clubId) return;
    const typingDocRef = doc(db, "typingIndicators", clubId);
    const unsubscribe = onSnapshot(typingDocRef, async (docSnapshot) => {
      const data = docSnapshot.data();
      if (data) {
        const now = Date.now();
        const activeEmails = [];
        Object.entries(data).forEach(([email, timestamp]) => {
          // Exclude the current user and only consider recent updates as active typing
          if (email === userEmail) return;
          if (timestamp && now - timestamp.toMillis() < TYPING_TIMEOUT) {
            activeEmails.push(email);
          }
        });
        // Map emails to first names using the API with token.
        const firstNames = await Promise.all(
          activeEmails.map(async (email) => await fetchFirstName(email))
        );
        setUsersTyping(firstNames);
      } else {
        setUsersTyping([]);
      }
    });
    return () => unsubscribe();
  }, [clubId, userEmail]);

  // Clear any pending typing status on component unmount.
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      updateTypingStatus(false);
    };
  }, []);

  return (
    <div className="message-form-container">
      {!isAuthorized && (
        <p className="error-message">
          You are not authorized to send messages.
        </p>
      )}

      {usersTyping.length > 0 && (
        <div className="typing-indicator">
          {usersTyping.join(", ")} {usersTyping.length === 1 ? "is" : "are"}{" "}
          typing...
        </div>
      )}
      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={text}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="message-input"
          disabled={!isAuthorized}
        />
        <button
          type="submit"
          className="message-send-button"
          disabled={!isAuthorized}
        >
          <FaPaperPlane />
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default MessageForm;

import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { bgcolor, color } from "@mui/system";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const TYPING_TIMEOUT = 2000;

const MessageForm = ({ clubId, userEmail }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [membershipChecked, setMembershipChecked] = useState(false);
  const [usersTyping, setUsersTyping] = useState([]);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAuthorized(decoded.email === userEmail);
      } catch {
        setIsAuthorized(false);
      }
    } else {
      setIsAuthorized(false);
    }
  }, [userEmail]);

  useEffect(() => {
    setMembershipChecked(false);
    const stored = JSON.parse(localStorage.getItem("user_clubs") || "[]");
    const isInClub = stored.some((club) => club === clubId);
    setIsMember(isInClub);
    setMembershipChecked(true);
  }, [clubId]);

  const updateTypingStatus = useCallback(
    async (typing) => {
      if (!clubId || !userEmail || !isMember) return;
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
    },
    [clubId, userEmail, isMember]
  );

  const handleTyping = (e) => {
    setText(e.target.value);
    if (isMember) {
      updateTypingStatus(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        updateTypingStatus(false);
      }, TYPING_TIMEOUT);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Message cannot be empty.");
      return;
    }
    if (!isAuthorized || !isMember) {
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
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    }
  };

  const fetchFirstName = useCallback(async (email) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${BASE_URL}/student/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.first_name || email;
    } catch (err) {
      console.error("Error fetching first name for", email, err);
      return email;
    }
  }, []);

  useEffect(() => {
    if (!clubId || !isMember) return;
    const typingDocRef = doc(db, "typingIndicators", clubId);
    const unsubscribe = onSnapshot(typingDocRef, async (docSnapshot) => {
      const data = docSnapshot.data();
      if (data) {
        const now = Date.now();
        const activeEmails = [];
        Object.entries(data).forEach(([email, timestamp]) => {
          if (email === userEmail) return;
          if (timestamp && now - timestamp.toMillis() < TYPING_TIMEOUT) {
            activeEmails.push(email);
          }
        });
        const firstNames = await Promise.all(
          activeEmails.map(async (email) => await fetchFirstName(email))
        );
        setUsersTyping(firstNames);
      } else {
        setUsersTyping([]);
      }
    });

    return () => unsubscribe();
  }, [clubId, userEmail, isMember, fetchFirstName]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      updateTypingStatus(false);
    };
  }, [updateTypingStatus]);

  const disabled = !isAuthorized || !isMember;

  return (
    <div className="message-form-wrapper">
      {/* {!membershipChecked ? (
        <p className="info-message">Checking club membership...</p>
      ) : !isMember ? (
        <p className="error-message">
          You must be a member of this club to send messages.
        </p>
      ) : !isAuthorized ? (
        <p className="error-message">
          You are not authorized to send messages.
        </p>
      ) : null} */}

      {usersTyping.length > 0 && isMember && (
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
          disabled={disabled}
        />
        <button
          type="submit"
          className="message-send-button"
          disabled={disabled}
          style={{
            backgroundColor: disabled && "black",
            cursor: disabled && "not-allowed", 
            opacity: disabled && 0.1,
          }}
        >
          <FaPaperPlane />
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default MessageForm;

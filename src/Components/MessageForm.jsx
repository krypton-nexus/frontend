import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  setDoc,
  onSnapshot,
  deleteField,
} from "firebase/firestore";
import { db } from "../firebase";
import { jwtDecode } from "jwt-decode";
import "../CSS/MessageForm.css";
import { FaPaperPlane } from "react-icons/fa";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const TYPING_TIMEOUT = 3000;

const MessageForm = ({ clubId, userEmail }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [membershipChecked, setMembershipChecked] = useState(false);
  const [usersTyping, setUsersTyping] = useState([]);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const lastTypingStatusRef = useRef(null);

  const encodeEmail = (email) =>
    email.replace(/\./g, "_dot_").replace(/@/g, "_at_");
  const decodeEmail = (key) => key.replace(/_dot_/g, ".").replace(/_at_/g, "@");

  const safeEmailKey = encodeEmail(userEmail);

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
    setIsMember(stored.includes(clubId));
    setMembershipChecked(true);
  }, [clubId]);

  const updateTypingStatus = useCallback(
    async (typing) => {
      if (!clubId || !userEmail || !isMember) return;
      if (lastTypingStatusRef.current === typing) return;

      lastTypingStatusRef.current = typing;
      const typingDocRef = doc(db, "typingIndicators", clubId);

      try {
        if (typing) {
          await setDoc(
            typingDocRef,
            {
              [safeEmailKey]: {
                timestamp: serverTimestamp(),
                lastSeen: Date.now(),
              },
            },
            { merge: true }
          );
          isTypingRef.current = true;
        } else {
          await setDoc(
            typingDocRef,
            { [safeEmailKey]: deleteField() },
            { merge: true }
          );
          isTypingRef.current = false;
        }
      } catch (error) {
        console.error("Error updating typing status:", error);
      }
    },
    [clubId, userEmail, isMember]
  );

  const handleTyping = (e) => {
    const newText = e.target.value;
    setText(newText);
    if (!isMember || !isAuthorized) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (newText.trim().length > 0) {
      if (!isTypingRef.current) updateTypingStatus(true);
      typingTimeoutRef.current = setTimeout(() => {
        updateTypingStatus(false);
      }, TYPING_TIMEOUT);
    } else {
      updateTypingStatus(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return setError("Message cannot be empty.");
    if (!isAuthorized || !isMember)
      return setError("You are not authorized to send messages.");

    try {
      updateTypingStatus(false);
      await addDoc(collection(db, "messages", clubId, "messages"), {
        sendersEmail: userEmail,
        text: text.trim(),
        timestamp: serverTimestamp(),
      });
      setText("");
      setError(null);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    }
  };

  const fetchFirstName = useCallback(async (email) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${BASE_URL}/student/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Fetch error");
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
      if (!data) return setUsersTyping([]);

      const now = Date.now();
      const activeEmails = [];

      Object.entries(data).forEach(([key, typingData]) => {
        const decoded = decodeEmail(key);
        if (decoded === userEmail) return;

        let timestamp = typingData?.timestamp;
        let lastSeen = typingData?.lastSeen;

        if (timestamp && timestamp.toMillis) {
          const timeDiff = now - timestamp.toMillis();
          if (timeDiff < TYPING_TIMEOUT * 2) activeEmails.push(decoded);
        } else if (lastSeen && now - lastSeen < TYPING_TIMEOUT * 2) {
          activeEmails.push(decoded);
        }
      });

      const firstNames = await Promise.all(
        activeEmails.map((email) => fetchFirstName(email))
      );
      setUsersTyping(firstNames);
    });

    return () => unsubscribe();
  }, [clubId, userEmail, isMember, fetchFirstName]);

  useEffect(() => {
    const handleLeave = () => {
      if (isTypingRef.current) updateTypingStatus(false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && isTypingRef.current) {
        updateTypingStatus(false);
      }
    };

    window.addEventListener("beforeunload", handleLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      handleLeave();
      window.removeEventListener("beforeunload", handleLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [updateTypingStatus]);

  const disabled = !isAuthorized || !isMember;

  return (
    <div className="message-form-wrapper">
      {usersTyping.length > 0 && isMember && (
        <div className="typing-indicator">
          {usersTyping.length === 1
            ? `${usersTyping[0]} is typing...`
            : usersTyping.length === 2
            ? `${usersTyping.join(" and ")} are typing...`
            : `${usersTyping.slice(0, 2).join(", ")} and ${
                usersTyping.length - 2
              } other${usersTyping.length - 2 > 1 ? "s" : ""} are typing...`}
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
            backgroundColor: disabled ? "black" : undefined,
            cursor: disabled ? "not-allowed" : undefined,
            opacity: disabled ? 0.1 : undefined,
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

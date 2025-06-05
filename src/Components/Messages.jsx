import React, { useState, useEffect, useCallback, useRef } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { jwtDecode } from "jwt-decode";
import "../CSS/Messages.css";
import Skeleton from "@mui/material/Skeleton";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Messages = ({ clubId }) => {
  const [messages, setMessages] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [userNames, setUserNames] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserEmail(decoded.email || null);
      } catch (err) {
        console.error("Token decode failed:", err);
      }
    }
  }, []);

  const fetchUserNames = useCallback(async (emails) => {
    const result = {};
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Missing token for user name fetch.");
      return result;
    }
    for (const email of emails) {
      if (!email) continue;
      try {
        const response = await fetch(`${BASE_URL}/student/${email}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          result[email] = `${data.first_name || "Anonymous"} ${
            data.last_name || ""
          }`.trim();
        } else {
          console.error(`Failed to get name for ${email}`);
        }
      } catch (err) {
        console.error(`Error getting name for ${email}:`, err);
      }
    }
    return result;
  }, []);

  const getDateLabel = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    if (date >= weekStart && date <= weekEnd)
      return date.toLocaleDateString("en-US", { weekday: "long" });
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const groupMessagesByDate = (msgs) => {
    const grouped = {};
    msgs.forEach((msg) => {
      if (msg.timestamp?.seconds) {
        const date = new Date(msg.timestamp.seconds * 1000);
        const label = getDateLabel(date);
        if (!grouped[label]) grouped[label] = [];
        grouped[label].push(msg);
      }
    });
    return grouped;
  };

  useEffect(() => {
    if (!clubId) return;

    const q = query(
      collection(db, "messages", clubId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const messageData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(messageData);

      const uniqueEmails = [
        ...new Set(messageData.map((m) => m.sendersEmail).filter(Boolean)),
      ];
      const nameMap = await fetchUserNames(uniqueEmails);
      setUserNames((prev) => ({ ...prev, ...nameMap }));

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [clubId, fetchUserNames]);

  useEffect(() => {
    if (!isLoading && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages, isLoading]);

  // === RENDER ===

  if (isLoading) {
    return (
      <div className="messages-container">
        {/* Date separator skeleton */}
        <div className="date-separator">
          <Skeleton
            variant="text"
            width={80}
            height={20}
            animation="wave"
            style={{ margin: "0 auto" }}
          />
        </div>

        {/* Message skeletons */}
        {[...Array(6)].map((_, i) => {
          const isSentByUser = i % 3 === 0; // Mix of user and other messages
          return (
            <div
              key={i}
              className={`message ${
                isSentByUser ? "message-right" : "message-left"
              }`}
            >
              {!isSentByUser && (
                <Skeleton
                  className="message-avatar"
                  variant="circular"
                  width={40}
                  height={40}
                  animation="wave"
                />
              )}
              <div
                className={`message-bubble ${
                  isSentByUser ? "sent" : "received"
                }`}
              >
                {!isSentByUser && (
                  <div className="message-sender-name">
                    <Skeleton
                      variant="text"
                      width={80}
                      height={16}
                      animation="wave"
                    />
                  </div>
                )}
                <div className="message-text">
                  <div className="message-content">
                    <Skeleton
                      variant="text"
                      width={Math.random() * 200 + 100}
                      height={16}
                      animation="wave"
                      style={{ marginBottom: 4 }}
                    />
                    {Math.random() > 0.5 && (
                      <Skeleton
                        variant="text"
                        width={Math.random() * 150 + 80}
                        height={16}
                        animation="wave"
                      />
                    )}
                  </div>
                  <div className="message-timestamp">
                    <Skeleton
                      variant="text"
                      width={50}
                      height={12}
                      animation="wave"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="messages-container">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  const grouped = groupMessagesByDate(messages);
  const orderedLabels = Object.keys(grouped).sort((a, b) => {
    const firstA = grouped[a][0]?.timestamp?.seconds || 0;
    const firstB = grouped[b][0]?.timestamp?.seconds || 0;
    return firstA - firstB;
  });

  return (
    <div className="messages-container">
      {orderedLabels.map((label) => (
        <div key={label}>
          <div className="date-separator">
            <span className="date-label">{label}</span>
          </div>
          {grouped[label].map((msg) => {
            const isSentByUser = msg.sendersEmail === userEmail;
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              userNames[msg.sendersEmail] || "User"
            )}&background=random`;

            return (
              <div
                key={msg.id}
                className={`message ${
                  isSentByUser ? "message-right" : "message-left"
                }`}
              >
                {!isSentByUser && (
                  <img
                    className="message-avatar"
                    src={avatarUrl}
                    alt="Avatar"
                  />
                )}
                <div
                  className={`message-bubble ${
                    isSentByUser ? "sent" : "received"
                  }`}
                >
                  {!isSentByUser && (
                    <div className="message-sender-name">
                      {userNames[msg.sendersEmail] || "User"}
                    </div>
                  )}
                  <div className="message-text">
                    <div className="message-content">{msg.text}</div>
                    <div className="message-timestamp">
                      {msg.timestamp?.seconds
                        ? new Date(
                            msg.timestamp.seconds * 1000
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
 
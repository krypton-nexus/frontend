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
  const [isUserMember, setIsUserMember] = useState(false);
  const [membershipCheckDone, setMembershipCheckDone] = useState(false);
  const messagesEndRef = useRef(null);

  // Step 1: Get user email from token
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

  // Step 2: Check membership from localStorage user_clubs
  useEffect(() => {
    setMembershipCheckDone(false);
    const stored = JSON.parse(localStorage.getItem("user_clubs") || "[]");
    const isMember = stored.some((club) => club === clubId);
    setIsUserMember(isMember);
    setMembershipCheckDone(true);
  }, [clubId]);

  const fetchUserNames = useCallback(async (emails) => {
    const result = {};
    const token = localStorage.getItem("access_token");
    if (!token) return result;

    for (const email of emails) {
      if (!email) continue;
      try {
        const res = await fetch(`${BASE_URL}/student/${email}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          result[email] = `${data.first_name || "Anonymous"} ${
            data.last_name || ""
          }`.trim();
        }
      } catch (err) {
        console.error(`Error fetching name for ${email}:`, err);
      }
    }
    return result;
  }, []);

  // Step 4: Firestore messages listener (only if member)
  useEffect(() => {
    if (!clubId || !isUserMember) return;

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
  }, [clubId, isUserMember, fetchUserNames]);

  // Step 5: Scroll to bottom on update
  useEffect(() => {
    if (!isLoading && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages, isLoading]);

  // Step 6: Date grouping logic
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

  // === UI Render Section ===

  if (!membershipCheckDone) {
    return (
      <div className="messages-container">
        <Skeleton width={150} height={20} animation="wave" />
      </div>
    );
  }

  if (!isUserMember) {
    return (
      <div className="messages-container">
        <div className="membership_error"> You must be a member of this club to access messages.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="messages-container">
        <div className="date-separator">
          <Skeleton
            width={80}
            height={20}
            animation="wave"
            style={{ margin: "0 auto" }}
          />
        </div>
        {[...Array(5)].map((_, i) => {
          const isRight = i % 2 === 0;
          return (
            <div
              key={i}
              className={`message ${
                isRight ? "message-right" : "message-left"
              }`}
            >
              {!isRight && (
                <Skeleton
                  className="message-avatar"
                  variant="circular"
                  width={40}
                  height={40}
                />
              )}
              <div
                className={`message-bubble ${isRight ? "sent" : "received"}`}
              >
                {!isRight && (
                  <div className="message-sender-name">
                    <Skeleton width={80} height={16} />
                  </div>
                )}
                <div className="message-text">
                  <Skeleton
                    width={180}
                    height={16}
                    style={{ marginBottom: 4 }}
                  />
                  <Skeleton width={150} height={16} />
                  <Skeleton width={50} height={12} />
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